import "server-only";

import { getPayloadClient } from "@/lib/payload-client";
import {
  landingTemplateDefaults,
  type LandingServiceItem,
  type LandingStat,
  type LandingTemplateConfig,
} from "@/lib/template-config";
import type {
  Client,
  LandingTemplate,
  Media,
  Project,
  Service,
} from "@/payload-types";

/**
 * Lectura de contenido desde Payload para las páginas públicas.
 *
 * Devuelve las mismas formas que consumían los componentes cuando los datos
 * venían de PocketBase (LandingTemplateConfig y compañía), para que la
 * migración no obligue a reescribir cada sección.
 */

/** Un upload de Payload llega como id numérico o como el documento completo. */
function mediaUrl(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const media = value as Media;
  return typeof media.url === "string" ? media.url : "";
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function toStats(value: LandingTemplate["statsItems"]): LandingStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    return landingTemplateDefaults.statsItems;
  }
  return value.map((item) => ({
    value: item.value,
    label: item.label,
    suffix: item.suffix ?? "",
  }));
}

function toServiceItems(
  value: LandingTemplate["servicesItems"],
): LandingServiceItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Service => typeof item === "object" && item !== null)
    .map((service) => ({
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      icon: service.icon ?? "Settings",
      imageUrl: mediaUrl(service.image),
    }));
}

export async function getLandingTemplate(): Promise<LandingTemplateConfig> {
  const payload = await getPayloadClient();

  // depth 2 resuelve los uploads y los servicios relacionados en una sola
  // consulta, en vez de dejar ids sueltos que habría que volver a pedir.
  const raw = (await payload.findGlobal({
    slug: "landing-template",
    depth: 2,
  })) as LandingTemplate;

  const d = landingTemplateDefaults;
  const g = <K extends keyof LandingTemplateConfig>(
    key: K,
  ): LandingTemplateConfig[K] =>
    text(
      (raw as unknown as Record<string, unknown>)[key],
      d[key] as string,
    ) as LandingTemplateConfig[K];

  const serviceItems = toServiceItems(raw.servicesItems);

  return {
    ...d,

    heroEyebrow: g("heroEyebrow"),
    heroTitleStart: g("heroTitleStart"),
    heroTitleHighlightOne: g("heroTitleHighlightOne"),
    heroTitleConnector: g("heroTitleConnector"),
    heroTitleHighlightTwo: g("heroTitleHighlightTwo"),
    heroSubtitle: g("heroSubtitle"),
    heroPrimaryCtaLabel: g("heroPrimaryCtaLabel"),
    heroPrimaryCtaHref: g("heroPrimaryCtaHref"),
    heroSecondaryCtaLabel: g("heroSecondaryCtaLabel"),
    heroSecondaryCtaHref: g("heroSecondaryCtaHref"),
    heroBgImage: mediaUrl(raw.heroBgImage) || d.heroBgImage,

    primaryColor: g("primaryColor"),
    accentColor: g("accentColor"),
    highlightColor: g("highlightColor"),

    statsItems: toStats(raw.statsItems),

    servicesEyebrow: g("servicesEyebrow"),
    servicesTitle: g("servicesTitle"),
    servicesSubtitle: g("servicesSubtitle"),
    servicesDescription: g("servicesDescription"),
    servicesLinkLabel: g("servicesLinkLabel"),
    // Sin selección explícita caemos a los servicios activos, para que la
    // portada nunca quede vacía por olvidar configurarla.
    servicesItems:
      serviceItems.length > 0 ? serviceItems : await getServiceItemsFallback(),

    featuredProjectsEyebrow: g("featuredProjectsEyebrow"),
    featuredProjectsTitle: g("featuredProjectsTitle"),
    featuredProjectsSubtitle: g("featuredProjectsSubtitle"),
    featuredProjectsLinkLabel: g("featuredProjectsLinkLabel"),

    clientsEyebrow: g("clientsEyebrow"),
    clientsTitle: g("clientsTitle"),

    ctaTitle: g("ctaTitle"),
    ctaSubtitle: g("ctaSubtitle"),
    ctaPrimaryLabel: g("ctaPrimaryLabel"),
    ctaPrimaryHref: g("ctaPrimaryHref"),
    ctaSecondaryLabel: g("ctaSecondaryLabel"),
    ctaSecondaryHref: g("ctaSecondaryHref"),

    contactInfoTitle: g("contactInfoTitle"),
    contactInfoDescription: g("contactInfoDescription"),
    contactPhone: g("contactPhone"),
    contactEmail: g("contactEmail"),
    contactAddress: g("contactAddress"),
    contactHours: g("contactHours"),

    aboutEyebrow: g("aboutEyebrow"),
    aboutTitle: g("aboutTitle"),
    aboutHistoryPart1: g("aboutHistoryPart1"),
    aboutHistoryPart2: g("aboutHistoryPart2"),
    aboutHistoryPart3: g("aboutHistoryPart3"),
    aboutHistoryImage: mediaUrl(raw.aboutHistoryImage) || d.aboutHistoryImage,
    aboutMission: g("aboutMission"),
    aboutVision: g("aboutVision"),
    aboutValuesList: Array.isArray(raw.aboutValuesList)
      ? raw.aboutValuesList.map((v) => v.text).join("\n")
      : d.aboutValuesList,

    linkedinUrl: g("linkedinUrl"),
    instagramUrl: g("instagramUrl"),
    googleMapsUrl: g("googleMapsUrl"),
  };
}

async function getServiceItemsFallback(): Promise<LandingServiceItem[]> {
  const services = await getServices();
  return services.slice(0, 6).map((service) => ({
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    icon: service.icon ?? "Settings",
    imageUrl: mediaUrl(service.image),
  }));
}

export async function getServices(): Promise<Service[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 1,
  });
  return result.docs;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    where: { isActive: { equals: true } },
    sort: "-year",
    limit: 100,
    depth: 1,
  });
  return result.docs;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

export async function getClients(): Promise<Client[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "clients",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 1,
  });
  return result.docs;
}

export { mediaUrl };
