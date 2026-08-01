/**
 * Migra el contenido de PocketBase a Payload/Postgres.
 *
 * Es idempotente: cada documento se busca por su clave natural (slug, nombre)
 * y se actualiza si ya existe, así que se puede correr varias veces mientras
 * se afina la migración sin duplicar nada.
 *
 *   npm run migrate:pb            # migra
 *   npm run migrate:pb -- --dry   # solo reporta qué haría
 */

import { getPayload } from "payload";
import config from "@payload-config";
import { landingTemplateDefaults } from "../src/lib/template-config.js";

const DRY = process.argv.includes("--dry");

/**
 * El .env trae la URL en http://. Servida por esa vía la instancia responde
 * con datos distintos (15 servicios y 0 contactos, frente a 18 y 1 por https),
 * así que se fuerza https igual que hace la app en runtime.
 */
function resolvePbUrl() {
  const raw = (
    process.env.POCKETBASE_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const isLocal = raw.includes("localhost") || raw.includes("127.0.0.1");
  return !isLocal && raw.startsWith("http://")
    ? raw.replace("http://", "https://")
    : raw;
}

const PB_URL = resolvePbUrl();
const PB_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "";
const PB_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || "";

type PbRecord = Record<string, unknown> & {
  id: string;
  collectionId?: string;
};

let pbToken = "";

async function pbAuth() {
  const res = await fetch(
    `${PB_URL}/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
    },
  );
  if (!res.ok) {
    throw new Error(`Auth de PocketBase falló: ${res.status} ${await res.text()}`);
  }
  pbToken = (await res.json()).token;
}

async function pbList(collection: string): Promise<PbRecord[]> {
  const res = await fetch(
    `${PB_URL}/api/collections/${collection}/records?perPage=500`,
    { headers: { Authorization: pbToken } },
  );
  if (!res.ok) {
    console.warn(`  ! no se pudo leer ${collection}: ${res.status}`);
    return [];
  }
  return (await res.json()).items as PbRecord[];
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function bool(value: unknown, fallback = true): boolean {
  return typeof value === "boolean" ? value : fallback;
}

async function main() {
  if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
    throw new Error(
      "Faltan POCKETBASE_URL / POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD",
    );
  }

  const payload = await getPayload({ config });
  await pbAuth();
  console.log(`Conectado a PocketBase (${PB_URL})${DRY ? " — MODO DRY RUN" : ""}\n`);

  // ---------------------------------------------------------------- media
  // Solo los logos de clientes tienen archivos; servicios y proyectos están
  // sin imágenes en PocketBase.
  const mediaBySource = new Map<string, number>();

  async function uploadMedia(
    record: PbRecord,
    filename: string,
    alt: string,
  ): Promise<number | undefined> {
    const key = `${record.id}/${filename}`;
    if (mediaBySource.has(key)) return mediaBySource.get(key);

    const url = `${PB_URL}/api/files/${record.collectionId}/${record.id}/${filename}`;
    const res = await fetch(url, { headers: { Authorization: pbToken } });
    if (!res.ok) {
      console.warn(`  ! no se pudo descargar ${filename}: ${res.status}`);
      return undefined;
    }
    const buffer = Buffer.from(await res.arrayBuffer());

    if (DRY) {
      console.log(`  [dry] subiría ${filename} (${buffer.length} bytes)`);
      return undefined;
    }

    const created = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: buffer,
        mimetype: res.headers.get("content-type") || "image/png",
        name: filename,
        size: buffer.length,
      },
    });
    mediaBySource.set(key, created.id);
    return created.id;
  }

  /** Busca por clave natural para que reejecutar la migración no duplique. */
  async function upsert(
    collection: "services" | "projects" | "clients" | "contacts",
    where: Record<string, unknown>,
    data: Record<string, unknown>,
  ): Promise<number | undefined> {
    const existing = await payload.find({
      collection,
      where,
      limit: 1,
      depth: 0,
    });

    if (DRY) {
      console.log(
        `  [dry] ${existing.docs.length ? "actualizaría" : "crearía"} ${collection}: ${JSON.stringify(Object.values(where)[0])}`,
      );
      return existing.docs[0]?.id;
    }

    if (existing.docs.length > 0) {
      const updated = await payload.update({
        collection,
        id: existing.docs[0].id,
        data: data as never,
      });
      return updated.id;
    }
    const created = await payload.create({ collection, data: data as never });
    return created.id;
  }

  // ------------------------------------------------------------- services
  const pbServices = await pbList("services");
  const serviceIdBySlug = new Map<string, number>();
  // Se valida contra los slugs de origen, no contra lo insertado, para que el
  // dry run reporte referencias rotas de verdad y no falsos positivos.
  const knownServiceSlugs = new Set(pbServices.map((s) => str(s.slug)));
  console.log(`Servicios: ${pbServices.length}`);

  for (const service of pbServices) {
    const features = Array.isArray(service.features)
      ? (service.features as unknown[])
          .filter((f): f is string => typeof f === "string")
          .map((text) => ({ text }))
      : [];

    const id = await upsert(
      "services",
      { slug: { equals: str(service.slug) } },
      {
        slug: str(service.slug),
        title: str(service.title),
        shortDescription: str(service.shortDescription),
        fullDescription: str(service.fullDescription, str(service.shortDescription)),
        features,
        icon: str(service.icon, "Settings"),
        unitPrice: num(service.unitPrice),
        order: num(service.order) ?? 0,
        isActive: bool(service.isActive),
      },
    );
    if (id) serviceIdBySlug.set(str(service.slug), id);
  }
  console.log(`  -> ${serviceIdBySlug.size} en Payload\n`);

  // ------------------------------------------------------------- projects
  const pbProjects = await pbList("projects");
  console.log(`Proyectos: ${pbProjects.length}`);

  for (const project of pbProjects) {
    // En PocketBase esto era un array de slugs sin integridad referencial.
    // Los que no resuelven se reportan en vez de perderse en silencio.
    const slugs = Array.isArray(project.servicesProvided)
      ? (project.servicesProvided as unknown[]).filter(
          (s): s is string => typeof s === "string",
        )
      : [];
    const resolved: number[] = [];
    for (const slug of slugs) {
      if (!knownServiceSlugs.has(slug)) {
        console.warn(`  ! ${project.slug}: servicio inexistente "${slug}"`);
        continue;
      }
      const id = serviceIdBySlug.get(slug);
      if (id) resolved.push(id);
    }

    await upsert(
      "projects",
      { slug: { equals: str(project.slug) } },
      {
        slug: str(project.slug),
        title: str(project.title),
        clientName: str(project.clientName),
        location: str(project.location),
        description: str(project.description),
        servicesProvided: resolved,
        category: str(project.category) || undefined,
        year: num(project.year),
        isFeatured: bool(project.isFeatured, false),
        isActive: bool(project.isActive),
      },
    );
  }
  console.log(`  -> listo\n`);

  // -------------------------------------------------------------- clients
  const pbClients = await pbList("clients");
  console.log(`Clientes: ${pbClients.length}`);

  for (const client of pbClients) {
    const logoName = str(client.logo);
    const logoId = logoName
      ? await uploadMedia(client, logoName, `Logo de ${str(client.name)}`)
      : undefined;

    await upsert(
      "clients",
      { name: { equals: str(client.name) } },
      {
        name: str(client.name),
        logo: logoId,
        website: str(client.website),
        order: num(client.order) ?? 0,
        isActive: bool(client.isActive),
      },
    );
  }
  console.log(`  -> ${mediaBySource.size} logos subidos\n`);

  // ------------------------------------------------------------- contacts
  const pbContacts = await pbList("contacts");
  console.log(`Mensajes de contacto: ${pbContacts.length}`);

  for (const contact of pbContacts) {
    await upsert(
      "contacts",
      { subject: { equals: str(contact.subject) } },
      {
        firstName: str(contact.firstName),
        lastName: str(contact.lastName),
        email: str(contact.email),
        phone: str(contact.phone),
        company: str(contact.company),
        subject: str(contact.subject),
        message: str(contact.message),
        status: str(contact.status, "new"),
      },
    );
  }
  console.log(`  -> listo\n`);

  // ------------------------------------------------------- landing global
  const pbConfig = await pbList("siteConfig");
  const cfg: Record<string, string> = {};
  for (const entry of pbConfig) {
    if (typeof entry.key === "string" && typeof entry.value === "string") {
      cfg[entry.key] = entry.value;
    }
  }
  console.log(`Configuración del sitio: ${Object.keys(cfg).length} claves`);

  const d = landingTemplateDefaults;
  const pick = (key: string, fallback: string) => str(cfg[key], fallback);

  // statsItems y servicesItems venían serializados como JSON dentro de un
  // campo de texto; acá se vuelven estructuras reales.
  let statsItems = d.statsItems.map((s) => ({
    value: s.value,
    label: s.label,
    suffix: s.suffix,
  }));
  try {
    const parsed = JSON.parse(cfg.tpl_statsItems || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      statsItems = parsed
        .filter((s) => s && typeof s.value === "string" && typeof s.label === "string")
        .map((s) => ({
          value: s.value,
          label: s.label,
          suffix: typeof s.suffix === "string" ? s.suffix : "",
        }));
    }
  } catch {
    console.warn("  ! tpl_statsItems no es JSON válido, se usan los valores por defecto");
  }

  let servicesItems: number[] = [];
  try {
    const parsed = JSON.parse(cfg.tpl_servicesItems || "[]");
    if (Array.isArray(parsed)) {
      servicesItems = parsed
        .map((s) => (s && typeof s.slug === "string" ? serviceIdBySlug.get(s.slug) : undefined))
        .filter((id): id is number => typeof id === "number");
    }
  } catch {
    console.warn("  ! tpl_servicesItems no es JSON válido, la portada usará los servicios activos");
  }

  const aboutValuesList = pick("tpl_aboutValuesList", d.aboutValuesList)
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text }));

  const globalData = {
    heroEyebrow: pick("tpl_heroEyebrow", d.heroEyebrow),
    heroTitleStart: pick("tpl_heroTitleStart", d.heroTitleStart),
    heroTitleHighlightOne: pick("tpl_heroTitleHighlightOne", d.heroTitleHighlightOne),
    heroTitleConnector: pick("tpl_heroTitleConnector", d.heroTitleConnector),
    heroTitleHighlightTwo: pick("tpl_heroTitleHighlightTwo", d.heroTitleHighlightTwo),
    heroSubtitle: pick("tpl_heroSubtitle", d.heroSubtitle),
    heroPrimaryCtaLabel: pick("tpl_heroPrimaryCtaLabel", d.heroPrimaryCtaLabel),
    heroPrimaryCtaHref: pick("tpl_heroPrimaryCtaHref", d.heroPrimaryCtaHref),
    heroSecondaryCtaLabel: pick("tpl_heroSecondaryCtaLabel", d.heroSecondaryCtaLabel),
    heroSecondaryCtaHref: pick("tpl_heroSecondaryCtaHref", d.heroSecondaryCtaHref),

    primaryColor: pick("tpl_primaryColor", d.primaryColor),
    accentColor: pick("tpl_accentColor", d.accentColor),
    highlightColor: pick("tpl_highlightColor", d.highlightColor),

    statsItems,

    servicesEyebrow: pick("tpl_servicesEyebrow", d.servicesEyebrow),
    servicesTitle: pick("tpl_servicesTitle", d.servicesTitle),
    servicesSubtitle: pick("tpl_servicesSubtitle", d.servicesSubtitle),
    servicesDescription: pick("tpl_servicesDescription", d.servicesDescription),
    servicesLinkLabel: pick("tpl_servicesLinkLabel", d.servicesLinkLabel),
    servicesItems,

    featuredProjectsEyebrow: pick("tpl_featuredProjectsEyebrow", d.featuredProjectsEyebrow),
    featuredProjectsTitle: pick("tpl_featuredProjectsTitle", d.featuredProjectsTitle),
    featuredProjectsSubtitle: pick("tpl_featuredProjectsSubtitle", d.featuredProjectsSubtitle),
    featuredProjectsLinkLabel: pick("tpl_featuredProjectsLinkLabel", d.featuredProjectsLinkLabel),

    clientsEyebrow: pick("tpl_clientsEyebrow", d.clientsEyebrow),
    clientsTitle: pick("tpl_clientsTitle", d.clientsTitle),

    ctaTitle: pick("tpl_ctaTitle", d.ctaTitle),
    ctaSubtitle: pick("tpl_ctaSubtitle", d.ctaSubtitle),
    ctaPrimaryLabel: pick("tpl_ctaPrimaryLabel", d.ctaPrimaryLabel),
    ctaPrimaryHref: pick("tpl_ctaPrimaryHref", d.ctaPrimaryHref),
    ctaSecondaryLabel: pick("tpl_ctaSecondaryLabel", d.ctaSecondaryLabel),
    ctaSecondaryHref: pick("tpl_ctaSecondaryHref", d.ctaSecondaryHref),

    contactInfoTitle: pick("contactInfoTitle", d.contactInfoTitle),
    contactInfoDescription: pick("contactInfoDescription", d.contactInfoDescription),
    // El esquema viejo tenía la misma información duplicada en dos claves
    // (contactPhone y phone). Gana la específica y la otra sirve de respaldo.
    contactPhone: pick("contactPhone", pick("phone", d.contactPhone)),
    contactEmail: pick("contactEmail", pick("email", d.contactEmail)),
    contactAddress: pick("contactAddress", pick("address", d.contactAddress)),
    contactCity: pick("contactCity", ""),
    contactHours: pick("contactHours", d.contactHours),

    aboutEyebrow: pick("tpl_aboutEyebrow", d.aboutEyebrow),
    aboutTitle: pick("tpl_aboutTitle", d.aboutTitle),
    aboutHistoryPart1: pick("tpl_aboutHistoryPart1", d.aboutHistoryPart1),
    aboutHistoryPart2: pick("tpl_aboutHistoryPart2", d.aboutHistoryPart2),
    aboutHistoryPart3: pick("tpl_aboutHistoryPart3", d.aboutHistoryPart3),
    aboutMission: pick("tpl_aboutMission", d.aboutMission),
    aboutVision: pick("tpl_aboutVision", d.aboutVision),
    aboutValuesList,

    linkedinUrl: pick("linkedinUrl", d.linkedinUrl),
    instagramUrl: pick("instagramUrl", pick("instagram", d.instagramUrl)),
    facebookUrl: pick("facebookUrl", ""),
    whatsapp: pick("whatsapp", ""),
    googleMapsUrl: pick("googleMapsUrl", d.googleMapsUrl),

    companyName: pick("companyName", ""),
    companyTagline: pick("companyTagline", ""),
    defaultMetaTitle: pick("defaultMetaTitle", ""),
    defaultMetaDescription: pick("defaultMetaDescription", "").slice(0, 160),
  };

  if (DRY) {
    console.log(`  [dry] escribiría ${Object.keys(globalData).length} campos en landing-template`);
  } else {
    await payload.updateGlobal({
      slug: "landing-template",
      data: globalData as never,
    });
    console.log(`  -> ${Object.keys(globalData).length} campos escritos`);
  }

  // Descartadas a propósito: about_text traía texto de otra empresa (HM INOVA,
  // residuo de una copia de plantilla) y hero_subtitle quedó superado por
  // tpl_heroSubtitle.
  const intentionallyDropped = new Set(["about_text", "hero_subtitle"]);

  const consumed = new Set([
    ...Object.keys(globalData).map((k) => `tpl_${k}`),
    ...Object.keys(globalData),
    "phone", "email", "address", "instagram",
    "tpl_statsItems", "tpl_servicesItems", "tpl_aboutValuesList",
  ]);
  const unused = Object.keys(cfg).filter(
    (k) => !consumed.has(k) && !intentionallyDropped.has(k),
  );
  if (unused.length > 0) {
    console.log(`\nClaves de siteConfig sin destino en el nuevo modelo (${unused.length}):`);
    console.log(`  ${unused.join(", ")}`);
  }
  console.log(
    `Descartadas a propósito: ${[...intentionallyDropped].join(", ")}`,
  );

  console.log("\nMigración terminada.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nMigración falló:", err);
  process.exit(1);
});
