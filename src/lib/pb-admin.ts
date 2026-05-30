import PocketBase from "pocketbase";
import {
  buildLandingTemplateConfig,
  type LandingTemplateConfig,
  toLandingTemplateEntries,
} from "@/lib/template-config";

function resolvePocketBaseUrl() {
  const raw = (
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://localhost:8090"
  ).trim();
  const isLocal = raw.includes("localhost") || raw.includes("127.0.0.1");

  if (!isLocal && raw.startsWith("http://")) {
    return raw.replace("http://", "https://");
  }

  return raw;
}

const pb = new PocketBase(resolvePocketBaseUrl());
pb.autoCancellation(false);

type ClientPayload = object | FormData;

let authPromise: Promise<void> | null = null;

function ensureAuth(): Promise<void> {
  if (pb.authStore.isValid) return Promise.resolve();
  if (!authPromise) {
    const email =
      process.env.POCKETBASE_ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_EMAIL ||
      "";
    const password =
      process.env.POCKETBASE_ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_PASSWORD ||
      "";
    authPromise = pb
      .collection("_superusers")
      .authWithPassword(email, password)
      .then(() => {
        authPromise = null;
      })
      .catch((err) => {
        authPromise = null;
        console.error("PocketBase admin auth failed:", err);
      });
  }
  return authPromise;
}

export async function adminLogin(email: string, password: string) {
  const auth = await pb
    .collection("_superusers")
    .authWithPassword(email, password);
  return auth;
}

// Services
export async function getServices() {
  return pb.collection("services").getFullList({ sort: "order" });
}
export async function createService(data: object) {
  await ensureAuth();
  const payload: Record<string, unknown> = { ...data };
  if (payload.features && typeof payload.features === "string") {
    try {
      payload.features = JSON.parse(payload.features);
    } catch {
      payload.features = [];
    }
  }
  return pb.collection("services").create(payload);
}
export async function updateService(id: string, data: object) {
  await ensureAuth();
  return pb.collection("services").update(id, data);
}
export async function deleteService(id: string) {
  await ensureAuth();
  return pb.collection("services").delete(id);
}

// Projects
export async function getProjects() {
  return pb.collection("projects").getFullList({ sort: "-year" });
}
export async function createProject(data: object) {
  await ensureAuth();
  const payload: Record<string, unknown> = { ...data };
  if (
    payload.servicesProvided &&
    typeof payload.servicesProvided === "string"
  ) {
    try {
      payload.servicesProvided = JSON.parse(payload.servicesProvided);
    } catch {
      payload.servicesProvided = [];
    }
  }
  return pb.collection("projects").create(payload);
}
export async function updateProject(id: string, data: object) {
  await ensureAuth();
  return pb.collection("projects").update(id, data);
}
export async function deleteProject(id: string) {
  await ensureAuth();
  return pb.collection("projects").delete(id);
}

// Clients
export async function getClients() {
  return pb.collection("clients").getFullList({ sort: "order" });
}
export async function createClient(data: ClientPayload) {
  await ensureAuth();
  return pb.collection("clients").create(data);
}
export async function updateClient(id: string, data: ClientPayload) {
  await ensureAuth();
  return pb.collection("clients").update(id, data);
}
export async function deleteClient(id: string) {
  await ensureAuth();
  return pb.collection("clients").delete(id);
}

// SiteConfig
export async function getSiteConfig() {
  return pb.collection("siteConfig").getFullList();
}

export async function getSiteConfigMap(): Promise<Record<string, string>> {
  const records = await getSiteConfig();
  const map: Record<string, string> = {};

  records.forEach((record: unknown) => {
    if (typeof record !== "object" || record === null) return;
    const item = record as { key?: unknown; value?: unknown };
    if (typeof item.key !== "string" || typeof item.value !== "string") return;
    map[item.key] = item.value;
  });

  return map;
}

export async function getLandingTemplateConfig(): Promise<LandingTemplateConfig> {
  const map = await getSiteConfigMap();
  return buildLandingTemplateConfig(map);
}

export async function saveLandingTemplateConfig(config: LandingTemplateConfig) {
  await ensureAuth();
  const entries = toLandingTemplateEntries(config);
  const current = await getSiteConfigMap();

  const changedEntries = entries.filter(
    (entry) => current[entry.key] !== entry.value,
  );

  for (const entry of changedEntries) {
    await setSiteConfig(entry.key, entry.value);
  }

  return {
    changed: changedEntries.length,
    total: entries.length,
  };
}

export async function setSiteConfig(key: string, value: string) {
  if (!key || !value) return null;
  await ensureAuth();
  try {
    const existing = await pb
      .collection("siteConfig")
      .getFirstListItem(`key="${key}"`);
    return pb.collection("siteConfig").update(existing.id, { value });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      err.status === 404
    ) {
      return pb.collection("siteConfig").create({ key, value });
    }
    throw err;
  }
}

// Contacts
export async function getContacts() {
  await ensureAuth();
  try {
    const result = await pb
      .collection("contacts")
      .getList(1, 100, { sort: "-created" });
    return result.items;
  } catch {
    const fallback = await pb
      .collection("contacts")
      .getList(1, 100, { sort: "-id" });
    return fallback.items;
  }
}
