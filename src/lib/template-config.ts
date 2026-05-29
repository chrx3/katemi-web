import {
  companyDescription,
  companyInfo,
  companyMission,
  companyStats,
  companyValues,
  companyVision,
  toLandingServiceItems,
} from "@/lib/company-content";

export interface LandingStat {
  value: string;
  label: string;
  suffix: string;
}

export interface LandingServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
}

export interface LandingTemplateConfig {
  heroEyebrow: string;
  heroTitleStart: string;
  heroTitleHighlightOne: string;
  heroTitleConnector: string;
  heroTitleHighlightTwo: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroBgImage: string;

  primaryColor: string;
  accentColor: string;
  highlightColor: string;

  statsItems: LandingStat[];

  servicesEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  servicesDescription: string;
  servicesLinkLabel: string;
  servicesItems: LandingServiceItem[];

  featuredProjectsEyebrow: string;
  featuredProjectsTitle: string;
  featuredProjectsSubtitle: string;
  featuredProjectsLinkLabel: string;

  clientsEyebrow: string;
  clientsTitle: string;

  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  contactInfoTitle: string;
  contactInfoDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutHistoryPart1: string;
  aboutHistoryPart2: string;
  aboutHistoryPart3: string;
  aboutHistoryImage: string;
  aboutMission: string;
  aboutVision: string;
  aboutValuesList: string;

  linkedinUrl: string;
  instagramUrl: string;
  googleMapsUrl: string;
}

export const landingTemplateDefaults: LandingTemplateConfig = {
  heroEyebrow: companyInfo.tagline,
  heroTitleStart: "Soluciones integrales en",
  heroTitleHighlightOne: "ingeniería",
  heroTitleConnector: "y",
  heroTitleHighlightTwo: "construcción",
  heroSubtitle: companyDescription.intro,
  heroPrimaryCtaLabel: "Cotizar Proyecto",
  heroPrimaryCtaHref: "/contacto",
  heroSecondaryCtaLabel: "Ver Nuestros Proyectos",
  heroSecondaryCtaHref: "/proyectos",
  heroBgImage: "",

  primaryColor: "#0B1D3A",
  accentColor: "#00A896",
  highlightColor: "#00D4FF",

  statsItems: companyStats,

  servicesEyebrow: "Qué hacemos",
  servicesTitle: "Nuestros Servicios",
  servicesSubtitle:
    "Desarrollo y ejecución de proyectos de ingeniería, construcción e instalaciones para sectores comercial, industrial y de servicios.",
  servicesDescription: companyDescription.sectors,
  servicesLinkLabel: "Ver Todos los Servicios",
  servicesItems: toLandingServiceItems(6),

  featuredProjectsEyebrow: "Portafolio",
  featuredProjectsTitle: "Proyectos Destacados",
  featuredProjectsSubtitle:
    "Experiencia en proyectos para clientes del área comercial e industrial en Chile.",
  featuredProjectsLinkLabel: "Ver Todos los Proyectos",

  clientsEyebrow: "Confianza y Trayectoria",
  clientsTitle: "Nuestros Clientes",

  ctaTitle: "¿Listo para evaluar un nuevo proyecto?",
  ctaSubtitle:
    "Quedamos disponibles para evaluar nuevos proyectos y oportunidades de colaboración.",
  ctaPrimaryLabel: "Solicitar Cotización",
  ctaPrimaryHref: "/contacto",
  ctaSecondaryLabel: "Ver Proyectos",
  ctaSecondaryHref: "/proyectos",

  contactInfoTitle: `Conoce más sobre ${companyInfo.legalName}`,
  contactInfoDescription: companyDescription.closing,
  contactPhone: companyInfo.phone,
  contactEmail: companyInfo.email,
  contactAddress: companyInfo.address,
  contactHours: companyInfo.hours,

  aboutEyebrow: "Nuestra Empresa",
  aboutTitle: `${companyInfo.legalName} — ${companyInfo.tagline}`,
  aboutHistoryPart1: companyDescription.intro,
  aboutHistoryPart2: companyDescription.sectors,
  aboutHistoryPart3: companyDescription.collaboration,
  aboutHistoryImage: "",
  aboutMission: companyMission,
  aboutVision: companyVision,
  aboutValuesList: companyValues.join("\n"),

  linkedinUrl: "https://linkedin.com/company/katemi",
  instagramUrl: "https://instagram.com/katemi",
  googleMapsUrl: companyInfo.googleMapsUrl,
};

function parseString(raw: string | undefined, fallback: string): string {
  if (raw === undefined) return fallback;
  return raw;
}

function parseStats(raw: string | undefined): LandingStat[] {
  if (!raw) return landingTemplateDefaults.statsItems;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return landingTemplateDefaults.statsItems;
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const stat = item as Record<string, unknown>;
        if (typeof stat.value !== "string" || typeof stat.label !== "string") return null;
        return { value: stat.value, label: stat.label, suffix: typeof stat.suffix === "string" ? stat.suffix : "" } as LandingStat;
      })
      .filter((item): item is LandingStat => item !== null);
  } catch {
    return landingTemplateDefaults.statsItems;
  }
}

function parseServices(raw: string | undefined): LandingServiceItem[] {
  if (!raw) return landingTemplateDefaults.servicesItems;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return landingTemplateDefaults.servicesItems;
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const service = item as Record<string, unknown>;
        if (typeof service.slug !== "string" || typeof service.title !== "string" || typeof service.shortDescription !== "string" || typeof service.icon !== "string") return null;
        return { slug: service.slug, title: service.title, shortDescription: service.shortDescription, icon: service.icon, imageUrl: typeof service.imageUrl === "string" ? service.imageUrl : "" } as LandingServiceItem;
      })
      .filter((item): item is LandingServiceItem => item !== null);
  } catch {
    return landingTemplateDefaults.servicesItems;
  }
}

export function buildLandingTemplateConfig(configMap: Record<string, string>): LandingTemplateConfig {
  return {
    ...landingTemplateDefaults,
    heroEyebrow: parseString(configMap.tpl_heroEyebrow, landingTemplateDefaults.heroEyebrow),
    heroTitleStart: parseString(configMap.tpl_heroTitleStart, landingTemplateDefaults.heroTitleStart),
    heroTitleHighlightOne: parseString(configMap.tpl_heroTitleHighlightOne, landingTemplateDefaults.heroTitleHighlightOne),
    heroTitleConnector: parseString(configMap.tpl_heroTitleConnector, landingTemplateDefaults.heroTitleConnector),
    heroTitleHighlightTwo: parseString(configMap.tpl_heroTitleHighlightTwo, landingTemplateDefaults.heroTitleHighlightTwo),
    heroSubtitle: parseString(configMap.tpl_heroSubtitle, landingTemplateDefaults.heroSubtitle),
    heroPrimaryCtaLabel: parseString(configMap.tpl_heroPrimaryCtaLabel, landingTemplateDefaults.heroPrimaryCtaLabel),
    heroPrimaryCtaHref: parseString(configMap.tpl_heroPrimaryCtaHref, landingTemplateDefaults.heroPrimaryCtaHref),
    heroSecondaryCtaLabel: parseString(configMap.tpl_heroSecondaryCtaLabel, landingTemplateDefaults.heroSecondaryCtaLabel),
    heroSecondaryCtaHref: parseString(configMap.tpl_heroSecondaryCtaHref, landingTemplateDefaults.heroSecondaryCtaHref),
    heroBgImage: parseString(configMap.tpl_heroBgImage, landingTemplateDefaults.heroBgImage),
    primaryColor: parseString(configMap.tpl_primaryColor, landingTemplateDefaults.primaryColor),
    accentColor: parseString(configMap.tpl_accentColor, landingTemplateDefaults.accentColor),
    highlightColor: parseString(configMap.tpl_highlightColor, landingTemplateDefaults.highlightColor),
    statsItems: parseStats(configMap.tpl_statsItems),
    servicesEyebrow: parseString(configMap.tpl_servicesEyebrow, landingTemplateDefaults.servicesEyebrow),
    servicesTitle: parseString(configMap.tpl_servicesTitle, landingTemplateDefaults.servicesTitle),
    servicesSubtitle: parseString(configMap.tpl_servicesSubtitle, landingTemplateDefaults.servicesSubtitle),
    servicesDescription: parseString(configMap.tpl_servicesDescription, landingTemplateDefaults.servicesDescription),
    servicesLinkLabel: parseString(configMap.tpl_servicesLinkLabel, landingTemplateDefaults.servicesLinkLabel),
    servicesItems: parseServices(configMap.tpl_servicesItems),
    featuredProjectsEyebrow: parseString(configMap.tpl_featuredProjectsEyebrow, landingTemplateDefaults.featuredProjectsEyebrow),
    featuredProjectsTitle: parseString(configMap.tpl_featuredProjectsTitle, landingTemplateDefaults.featuredProjectsTitle),
    featuredProjectsSubtitle: parseString(configMap.tpl_featuredProjectsSubtitle, landingTemplateDefaults.featuredProjectsSubtitle),
    featuredProjectsLinkLabel: parseString(configMap.tpl_featuredProjectsLinkLabel, landingTemplateDefaults.featuredProjectsLinkLabel),
    clientsEyebrow: parseString(configMap.tpl_clientsEyebrow, landingTemplateDefaults.clientsEyebrow),
    clientsTitle: parseString(configMap.tpl_clientsTitle, landingTemplateDefaults.clientsTitle),
    ctaTitle: parseString(configMap.tpl_ctaTitle, landingTemplateDefaults.ctaTitle),
    ctaSubtitle: parseString(configMap.tpl_ctaSubtitle, landingTemplateDefaults.ctaSubtitle),
    ctaPrimaryLabel: parseString(configMap.tpl_ctaPrimaryLabel, landingTemplateDefaults.ctaPrimaryLabel),
    ctaPrimaryHref: parseString(configMap.tpl_ctaPrimaryHref, landingTemplateDefaults.ctaPrimaryHref),
    ctaSecondaryLabel: parseString(configMap.tpl_ctaSecondaryLabel, landingTemplateDefaults.ctaSecondaryLabel),
    ctaSecondaryHref: parseString(configMap.tpl_ctaSecondaryHref, landingTemplateDefaults.ctaSecondaryHref),
    contactInfoTitle: parseString(configMap.contactInfoTitle, landingTemplateDefaults.contactInfoTitle),
    contactInfoDescription: parseString(configMap.contactInfoDescription, landingTemplateDefaults.contactInfoDescription),
    contactPhone: parseString(configMap.contactPhone, landingTemplateDefaults.contactPhone),
    contactEmail: parseString(configMap.contactEmail, landingTemplateDefaults.contactEmail),
    contactAddress: parseString(configMap.contactAddress, landingTemplateDefaults.contactAddress),
    contactHours: parseString(configMap.contactHours, landingTemplateDefaults.contactHours),
    aboutEyebrow: parseString(configMap.tpl_aboutEyebrow, landingTemplateDefaults.aboutEyebrow),
    aboutTitle: parseString(configMap.tpl_aboutTitle, landingTemplateDefaults.aboutTitle),
    aboutHistoryPart1: parseString(configMap.tpl_aboutHistoryPart1, landingTemplateDefaults.aboutHistoryPart1),
    aboutHistoryPart2: parseString(configMap.tpl_aboutHistoryPart2, landingTemplateDefaults.aboutHistoryPart2),
    aboutHistoryPart3: parseString(configMap.tpl_aboutHistoryPart3, landingTemplateDefaults.aboutHistoryPart3),
    aboutHistoryImage: parseString(configMap.tpl_aboutHistoryImage, landingTemplateDefaults.aboutHistoryImage),
    aboutMission: parseString(configMap.tpl_aboutMission, landingTemplateDefaults.aboutMission),
    aboutVision: parseString(configMap.tpl_aboutVision, landingTemplateDefaults.aboutVision),
    aboutValuesList: parseString(configMap.tpl_aboutValuesList, landingTemplateDefaults.aboutValuesList),
    linkedinUrl: parseString(configMap.linkedinUrl, landingTemplateDefaults.linkedinUrl),
    instagramUrl: parseString(configMap.instagramUrl, landingTemplateDefaults.instagramUrl),
    googleMapsUrl: parseString(configMap.googleMapsUrl, landingTemplateDefaults.googleMapsUrl),
  };
}

export function toLandingTemplateEntries(config: LandingTemplateConfig): Array<{ key: string; value: string }> {
  return [
    { key: "tpl_heroEyebrow", value: config.heroEyebrow },
    { key: "tpl_heroTitleStart", value: config.heroTitleStart },
    { key: "tpl_heroTitleHighlightOne", value: config.heroTitleHighlightOne },
    { key: "tpl_heroTitleConnector", value: config.heroTitleConnector },
    { key: "tpl_heroTitleHighlightTwo", value: config.heroTitleHighlightTwo },
    { key: "tpl_heroSubtitle", value: config.heroSubtitle },
    { key: "tpl_heroPrimaryCtaLabel", value: config.heroPrimaryCtaLabel },
    { key: "tpl_heroPrimaryCtaHref", value: config.heroPrimaryCtaHref },
    { key: "tpl_heroSecondaryCtaLabel", value: config.heroSecondaryCtaLabel },
    { key: "tpl_heroSecondaryCtaHref", value: config.heroSecondaryCtaHref },
    { key: "tpl_heroBgImage", value: config.heroBgImage },
    { key: "tpl_primaryColor", value: config.primaryColor },
    { key: "tpl_accentColor", value: config.accentColor },
    { key: "tpl_highlightColor", value: config.highlightColor },
    { key: "tpl_statsItems", value: JSON.stringify(config.statsItems) },
    { key: "tpl_servicesEyebrow", value: config.servicesEyebrow },
    { key: "tpl_servicesTitle", value: config.servicesTitle },
    { key: "tpl_servicesSubtitle", value: config.servicesSubtitle },
    { key: "tpl_servicesDescription", value: config.servicesDescription },
    { key: "tpl_servicesLinkLabel", value: config.servicesLinkLabel },
    { key: "tpl_servicesItems", value: JSON.stringify(config.servicesItems) },
    { key: "tpl_featuredProjectsEyebrow", value: config.featuredProjectsEyebrow },
    { key: "tpl_featuredProjectsTitle", value: config.featuredProjectsTitle },
    { key: "tpl_featuredProjectsSubtitle", value: config.featuredProjectsSubtitle },
    { key: "tpl_featuredProjectsLinkLabel", value: config.featuredProjectsLinkLabel },
    { key: "tpl_clientsEyebrow", value: config.clientsEyebrow },
    { key: "tpl_clientsTitle", value: config.clientsTitle },
    { key: "tpl_ctaTitle", value: config.ctaTitle },
    { key: "tpl_ctaSubtitle", value: config.ctaSubtitle },
    { key: "tpl_ctaPrimaryLabel", value: config.ctaPrimaryLabel },
    { key: "tpl_ctaPrimaryHref", value: config.ctaPrimaryHref },
    { key: "tpl_ctaSecondaryLabel", value: config.ctaSecondaryLabel },
    { key: "tpl_ctaSecondaryHref", value: config.ctaSecondaryHref },
    { key: "contactInfoTitle", value: config.contactInfoTitle },
    { key: "contactInfoDescription", value: config.contactInfoDescription },
    { key: "contactPhone", value: config.contactPhone },
    { key: "contactEmail", value: config.contactEmail },
    { key: "contactAddress", value: config.contactAddress },
    { key: "contactHours", value: config.contactHours },
    { key: "tpl_aboutEyebrow", value: config.aboutEyebrow },
    { key: "tpl_aboutTitle", value: config.aboutTitle },
    { key: "tpl_aboutHistoryPart1", value: config.aboutHistoryPart1 },
    { key: "tpl_aboutHistoryPart2", value: config.aboutHistoryPart2 },
    { key: "tpl_aboutHistoryPart3", value: config.aboutHistoryPart3 },
    { key: "tpl_aboutHistoryImage", value: config.aboutHistoryImage },
    { key: "tpl_aboutMission", value: config.aboutMission },
    { key: "tpl_aboutVision", value: config.aboutVision },
    { key: "tpl_aboutValuesList", value: config.aboutValuesList },
    { key: "linkedinUrl", value: config.linkedinUrl },
    { key: "instagramUrl", value: config.instagramUrl },
    { key: "googleMapsUrl", value: config.googleMapsUrl },
  ];
}
