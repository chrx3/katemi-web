"use server";

import PocketBase from "pocketbase";
import { requireAdmin } from "@/lib/admin-session";
import {
  buildLandingTemplateConfig,
  type LandingTemplateConfig,
  toLandingTemplateEntries,
} from "@/lib/template-config";

/**
 * Capa de acceso a PocketBase. Todo lo de este archivo corre EXCLUSIVAMENTE en
 * el servidor ("use server"): las credenciales del superusuario nunca llegan al
 * bundle del cliente.
 *
 * Cada export es un endpoint HTTP invocable por cualquiera que conozca su
 * action id, así que las mutaciones y las lecturas privadas llaman a
 * requireAdmin() antes de tocar la base. Las lecturas públicas (siteConfig)
 * quedan abiertas a propósito: alimentan las páginas públicas y sus reglas en
 * PocketBase ya son de lectura libre.
 */

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

/**
 * Autentica como superusuario. Sin fallback a variables NEXT_PUBLIC_: esas se
 * inlinean en el bundle del cliente y fueron la causa de la fuga de
 * credenciales en producción.
 */
function ensureAuth(): Promise<void> {
  if (pb.authStore.isValid) return Promise.resolve();

  if (!authPromise) {
    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
      return Promise.reject(
        new Error(
          "Faltan POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD en el entorno del servidor",
        ),
      );
    }

    authPromise = pb
      .collection("_superusers")
      .authWithPassword(email, password)
      .then(() => {
        authPromise = null;
      })
      .catch((err) => {
        authPromise = null;
        throw err;
      });
  }

  return authPromise;
}

/** Puerta estándar de toda operación privada: sesión válida + auth en PocketBase. */
async function authorize() {
  await requireAdmin();
  await ensureAuth();
}

// Services
export async function getServices() {
  await authorize();
  return pb.collection("services").getFullList({ sort: "order" });
}

export async function createService(data: object) {
  await authorize();
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
  await authorize();
  return pb.collection("services").update(id, data);
}

export async function deleteService(id: string) {
  await authorize();
  return pb.collection("services").delete(id);
}

// Projects
export async function getProjects() {
  await authorize();
  return pb.collection("projects").getFullList({ sort: "-year" });
}

export async function createProject(data: object) {
  await authorize();
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
  await authorize();
  return pb.collection("projects").update(id, data);
}

export async function deleteProject(id: string) {
  await authorize();
  return pb.collection("projects").delete(id);
}

// Clients
export async function getClients() {
  await authorize();
  return pb.collection("clients").getFullList({ sort: "order" });
}

export async function createClient(data: ClientPayload) {
  await authorize();
  return pb.collection("clients").create(data);
}

export async function updateClient(id: string, data: ClientPayload) {
  await authorize();
  return pb.collection("clients").update(id, data);
}

export async function deleteClient(id: string) {
  await authorize();
  return pb.collection("clients").delete(id);
}

// SiteConfig — lectura pública: alimenta las páginas del sitio y su listRule
// en PocketBase ya es abierta, así que no requiere sesión ni superusuario.
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
  await authorize();
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
  await authorize();

  try {
    // Filtro parametrizado: interpolar la key directamente permitiría inyectar
    // sintaxis de filtro de PocketBase a través del nombre del campo.
    const existing = await pb
      .collection("siteConfig")
      .getFirstListItem(pb.filter("key={:key}", { key }));
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
  await authorize();
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

/**
 * Contactos recientes para el aviso de mensajes nuevos en el panel.
 * Reemplaza la suscripción realtime que se autenticaba como superusuario
 * desde el navegador.
 */
export async function getRecentContacts(limit = 10) {
  await authorize();
  const result = await pb
    .collection("contacts")
    .getList(1, Math.min(Math.max(limit, 1), 50), { sort: "-created" });

  return result.items.map((item) => ({
    id: String(item.id),
    firstName: typeof item.firstName === "string" ? item.firstName : "",
    lastName: typeof item.lastName === "string" ? item.lastName : "",
    subject: typeof item.subject === "string" ? item.subject : "",
  }));
}
