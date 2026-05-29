import { readFileSync, existsSync } from "fs";
import { join } from "path";
import PocketBase from "pocketbase";
import {
  landingTemplateDefaults,
  toLandingTemplateEntries,
} from "../src/lib/template-config";

type SeedData = {
  services: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  clients: Array<Record<string, unknown>>;
  stats: Array<Record<string, unknown>>;
  siteConfig: Array<{ key: string; value: string; group?: string }>;
};

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) continue;

    const content = readFileSync(path, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function resolvePocketBaseUrl() {
  const raw = (
    process.env.POCKETBASE_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    "http://localhost:8090"
  ).trim();

  if (
    !raw.includes("localhost") &&
    !raw.includes("127.0.0.1") &&
    raw.startsWith("http://")
  ) {
    return raw.replace("http://", "https://");
  }

  return raw;
}

function inferSiteConfigGroup(key: string): string {
  if (key.startsWith("defaultMeta")) return "seo";
  if (
    key.startsWith("contact") ||
    key === "contactInfoTitle" ||
    key === "contactInfoDescription" ||
    key === "contactHours"
  ) {
    return "contact";
  }
  if (
    key === "linkedinUrl" ||
    key === "instagramUrl" ||
    key === "googleMapsUrl" ||
    key === "facebookUrl"
  ) {
    return "social";
  }
  if (key === "companyName" || key === "companyTagline") return "general";
  return "";
}

function buildSiteConfigEntries(seed: SeedData) {
  const entries = new Map<string, { key: string; value: string; group: string }>();

  for (const item of seed.siteConfig) {
    entries.set(item.key, {
      key: item.key,
      value: item.value,
      group: item.group || inferSiteConfigGroup(item.key),
    });
  }

  for (const entry of toLandingTemplateEntries(landingTemplateDefaults)) {
    entries.set(entry.key, {
      key: entry.key,
      value: entry.value,
      group: inferSiteConfigGroup(entry.key),
    });
  }

  return Array.from(entries.values());
}

function log(message: string) {
  console.log(message);
}

async function upsertSiteConfig(
  pb: PocketBase,
  entries: Array<{ key: string; value: string; group: string }>,
  dryRun: boolean,
) {
  const existing = await pb.collection("siteConfig").getFullList();
  const byKey = new Map(
    existing.map((record) => [record.key as string, record]),
  );

  let created = 0;
  let updated = 0;

  for (const entry of entries) {
    if (!entry.value) continue;

    const current = byKey.get(entry.key);
    if (current) {
      const needsUpdate =
        current.value !== entry.value ||
        (entry.group && current.group !== entry.group);

      if (needsUpdate) {
        log(`  ~ siteConfig ${entry.key}`);
        if (!dryRun) {
          await pb.collection("siteConfig").update(current.id, {
            value: entry.value,
            ...(entry.group ? { group: entry.group } : {}),
          });
        }
        updated += 1;
      }
      continue;
    }

    log(`  + siteConfig ${entry.key}`);
    if (!dryRun) {
      await pb.collection("siteConfig").create({
        key: entry.key,
        value: entry.value,
        ...(entry.group ? { group: entry.group } : {}),
      });
    }
    created += 1;
  }

  return { created, updated };
}

async function removeRecord(
  pb: PocketBase,
  collection: string,
  record: { id: string; slug?: string; name?: string; label?: string },
  dryRun: boolean,
) {
  const label = record.slug || record.name || record.label || record.id;
  log(`  - ${collection} ${label}`);

  if (dryRun) return "deleted" as const;

  try {
    await pb.collection(collection).delete(record.id);
    return "deleted" as const;
  } catch {
    log(`  ! ${collection} ${label} (desactivado; tiene referencias)`);
    await pb.collection(collection).update(record.id, { isActive: false });
    return "deactivated" as const;
  }
}

async function syncBySlug(
  pb: PocketBase,
  collection: "services" | "projects",
  items: Array<Record<string, unknown>>,
  dryRun: boolean,
  removeStale: boolean,
) {
  const existing = await pb.collection(collection).getFullList();
  const bySlug = new Map(existing.map((record) => [record.slug as string, record]));
  const seedSlugs = new Set(items.map((item) => item.slug as string));

  let created = 0;
  let updated = 0;
  let deleted = 0;
  let deactivated = 0;

  for (const item of items) {
    const slug = item.slug as string;
    const payload = { ...item };
    delete payload.id;

    const current = bySlug.get(slug);
    if (current) {
      log(`  ~ ${collection} ${slug}`);
      if (!dryRun) {
        await pb.collection(collection).update(current.id, payload);
      }
      updated += 1;
    } else {
      log(`  + ${collection} ${slug}`);
      if (!dryRun) {
        await pb.collection(collection).create(payload);
      }
      created += 1;
    }
  }

  if (removeStale) {
    for (const record of existing) {
      const slug = record.slug as string;
      if (seedSlugs.has(slug)) continue;
      const result = await removeRecord(pb, collection, record, dryRun);
      if (result === "deleted") deleted += 1;
      if (result === "deactivated") deactivated += 1;
    }
  }

  return { created, updated, deleted, deactivated };
}

async function syncClients(
  pb: PocketBase,
  items: Array<Record<string, unknown>>,
  dryRun: boolean,
  removeStale: boolean,
) {
  const existing = await pb.collection("clients").getFullList();
  const byName = new Map(existing.map((record) => [record.name as string, record]));
  const seedNames = new Set(items.map((item) => item.name as string));

  let created = 0;
  let updated = 0;
  let deleted = 0;
  let deactivated = 0;

  for (const item of items) {
    const name = item.name as string;
    const logoFile = item.logoFile as string | undefined;
    const logoPath = logoFile
      ? join(process.cwd(), "public/clients", logoFile)
      : null;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("website", (item.website as string) || "");
    formData.append("order", String((item.order as number) ?? 0));
    formData.append("isActive", String(item.isActive ?? true));

    if (logoPath && existsSync(logoPath)) {
      const buffer = readFileSync(logoPath);
      const mimeType = logoFile?.endsWith(".svg")
        ? "image/svg+xml"
        : "image/png";
      formData.append("logo", new Blob([buffer], { type: mimeType }), logoFile);
    }

    const current = byName.get(name);
    if (current) {
      log(`  ~ clients ${name}`);
      if (!dryRun) {
        await pb.collection("clients").update(current.id, formData);
      }
      updated += 1;
    } else {
      log(`  + clients ${name}`);
      if (!dryRun) {
        await pb.collection("clients").create(formData);
      }
      created += 1;
    }
  }

  if (removeStale) {
    for (const record of existing) {
      const name = record.name as string;
      if (seedNames.has(name)) continue;
      const result = await removeRecord(pb, "clients", record, dryRun);
      if (result === "deleted") deleted += 1;
      if (result === "deactivated") deactivated += 1;
    }
  }

  return { created, updated, deleted, deactivated };
}

async function syncStats(
  pb: PocketBase,
  items: Array<Record<string, unknown>>,
  dryRun: boolean,
  removeStale: boolean,
) {
  const existing = await pb.collection("stats").getFullList();
  const byLabel = new Map(existing.map((record) => [record.label as string, record]));
  const seedLabels = new Set(items.map((item) => item.label as string));

  let created = 0;
  let updated = 0;
  let deleted = 0;
  let deactivated = 0;

  for (const item of items) {
    const label = item.label as string;
    const payload = {
      label,
      value: item.value as string,
      prefix: (item.prefix as string) || "",
      suffix: (item.suffix as string) || "",
      order: (item.order as number) ?? 0,
      isActive: item.isActive ?? true,
    };

    const current = byLabel.get(label);
    if (current) {
      log(`  ~ stats ${label}`);
      if (!dryRun) {
        await pb.collection("stats").update(current.id, payload);
      }
      updated += 1;
    } else {
      log(`  + stats ${label}`);
      if (!dryRun) {
        await pb.collection("stats").create(payload);
      }
      created += 1;
    }
  }

  if (removeStale) {
    for (const record of existing) {
      const label = record.label as string;
      if (seedLabels.has(label)) continue;
      const result = await removeRecord(pb, "stats", record, dryRun);
      if (result === "deleted") deleted += 1;
      if (result === "deactivated") deactivated += 1;
    }
  }

  return { created, updated, deleted, deactivated };
}

async function main() {
  loadEnvFiles();

  const dryRun = process.argv.includes("--dry-run");
  const noDelete = process.argv.includes("--no-delete");
  const removeStale = !noDelete;

  const email =
    process.env.POCKETBASE_ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_EMAIL;
  const password =
    process.env.POCKETBASE_ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan POCKETBASE_ADMIN_EMAIL y POCKETBASE_ADMIN_PASSWORD en .env.local",
    );
  }

  const seedPath = join(process.cwd(), "seed-data.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8")) as SeedData;
  const siteConfigEntries = buildSiteConfigEntries(seed);

  const pb = new PocketBase(resolvePocketBaseUrl());
  pb.autoCancellation(false);

  log(`PocketBase: ${resolvePocketBaseUrl()}`);
  log(dryRun ? "Modo dry-run (sin escribir cambios)" : "Modo escritura");
  log(removeStale ? "Eliminar registros fuera del seed: sí" : "Eliminar registros fuera del seed: no");

  if (!dryRun) {
    await pb.collection("_superusers").authWithPassword(email, password);
  } else {
    log("Dry-run: se comparara contra PocketBase sin escribir cambios");
  }

  log("\nSincronizando projects...");
  const projects = await syncBySlug(
    pb,
    "projects",
    seed.projects,
    dryRun,
    removeStale,
  );

  log("\nSincronizando services...");
  const services = await syncBySlug(
    pb,
    "services",
    seed.services,
    dryRun,
    removeStale,
  );

  log("\nSincronizando clients...");
  const clients = await syncClients(pb, seed.clients, dryRun, removeStale);

  log("\nSincronizando stats...");
  const stats = await syncStats(pb, seed.stats, dryRun, removeStale);

  log("\nSincronizando siteConfig...");
  const siteConfig = await upsertSiteConfig(pb, siteConfigEntries, dryRun);

  log("\nResumen:");
  log(
    `  projects  -> +${projects.created} ~${projects.updated} -${projects.deleted} !${projects.deactivated}`,
  );
  log(
    `  services  -> +${services.created} ~${services.updated} -${services.deleted} !${services.deactivated}`,
  );
  log(
    `  clients   -> +${clients.created} ~${clients.updated} -${clients.deleted} !${clients.deactivated}`,
  );
  log(
    `  stats     -> +${stats.created} ~${stats.updated} -${stats.deleted} !${stats.deactivated}`,
  );
  log(`  siteConfig -> +${siteConfig.created} ~${siteConfig.updated}`);

  if (dryRun) {
    log("\nEjecuta sin --dry-run para aplicar los cambios.");
  } else {
    log("\nSeed completado.");
  }
}

main().catch((error) => {
  console.error("\nError en seed:", error);
  process.exit(1);
});
