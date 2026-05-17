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
}

export const landingTemplateDefaults: LandingTemplateConfig = {
  heroEyebrow: "Ingeniería y Proyectos Eléctricos",
  heroTitleStart: "Potencia tu proyecto con",
  heroTitleHighlightOne: "precisión",
  heroTitleConnector: "y",
  heroTitleHighlightTwo: "experiencia",
  heroSubtitle:
    "Más de 12 años ejecutando proyectos eléctricos en media y alta tensión para las principales empresas de Chile",
  heroPrimaryCtaLabel: "Cotizar Proyecto",
  heroPrimaryCtaHref: "/contacto",
  heroSecondaryCtaLabel: "Ver Nuestros Proyectos",
  heroSecondaryCtaHref: "/proyectos",

  statsItems: [
    { value: "150", label: "Proyectos Entregados", suffix: "+" },
    { value: "12", label: "Años de Experiencia", suffix: "" },
    { value: "8", label: "Clientes Activos", suffix: "+" },
    { value: "50", label: "Especialistas", suffix: "+" },
  ],

  servicesEyebrow: "Qué hacemos",
  servicesTitle: "Nuestros Servicios",
  servicesSubtitle:
    "Soluciones integrales en ingeniería eléctrica para la industria y infraestructura en Chile.",
  servicesDescription:
    "Contamos con un equipo multidisciplinario de ingenieros y técnicos especializados en cada área de la ingeniería eléctrica, aportando soluciones seguras, eficientes y normativas a cada proyecto.",
  servicesLinkLabel: "Ver Todos los Servicios",
  servicesItems: [
    {
      slug: "ingenieria-electrica",
      title: "Ingeniería Eléctrica",
      shortDescription:
        "Diseño y desarrollo de proyectos eléctricos de media y alta tensión, desde la conceptualización hasta la puesta en servicio.",
      icon: "Zap",
      imageUrl: "",
    },
    {
      slug: "instalaciones",
      title: "Instalaciones Eléctricas",
      shortDescription:
        "Ejecución profesional de instalaciones eléctricas industriales y comerciales, con los más altos estándares de seguridad.",
      icon: "Wrench",
      imageUrl: "",
    },
    {
      slug: "automatizacion",
      title: "Automatización y Control",
      shortDescription:
        "Sistemas de automatización, control SCADA y tableros de distribución para optimizar procesos industriales.",
      icon: "Settings",
      imageUrl: "",
    },
    {
      slug: "mediciones",
      title: "Mediciones y Certificaciones",
      shortDescription:
        "Ensayos de puesta en servicio, mediciones de tierra, termografías y certificaciones según normativa chilena.",
      icon: "FileCheck",
      imageUrl: "",
    },
  ],

  featuredProjectsEyebrow: "Portafolio",
  featuredProjectsTitle: "Proyectos Destacados",
  featuredProjectsSubtitle:
    "Conoce algunos de nuestros proyectos más relevantes ejecutados para las principales empresas del sector.",
  featuredProjectsLinkLabel: "Ver Todos los Proyectos",

  clientsEyebrow: "Confianza y Trayectoria",
  clientsTitle: "Nuestros Clientes",

  ctaTitle: "¿Listo para tu próximo proyecto?",
  ctaSubtitle: "Contáctanos hoy y hagamos realidad tu proyecto eléctrico",
  ctaPrimaryLabel: "Solicitar Cotización",
  ctaPrimaryHref: "/contacto",
  ctaSecondaryLabel: "Ver Proyectos",
  ctaSecondaryHref: "/proyectos",

  contactInfoTitle: "Conoce más sobre Katemi",
  contactInfoDescription:
    "Estamos ubicados en Santiago y prestamos servicios en todo Chile. Contáctanos para discutir tu próximo proyecto eléctrico.",
  contactPhone: "+56 9 1234 5678",
  contactEmail: "contacto@katemi.chrsx3.com",
  contactAddress: "Av. Providencia 1650, Of. 501\nSantiago, Chile",
  contactHours: "Lunes a Viernes: 8:30 – 18:30",
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

    const normalized = parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const stat = item as Record<string, unknown>;
        if (typeof stat.value !== "string" || typeof stat.label !== "string")
          return null;
        return {
          value: stat.value,
          label: stat.label,
          suffix: typeof stat.suffix === "string" ? stat.suffix : "",
        } as LandingStat;
      })
      .filter((item): item is LandingStat => item !== null);

    if (normalized.length === 0) return landingTemplateDefaults.statsItems;
    return normalized;
  } catch {
    return landingTemplateDefaults.statsItems;
  }
}

function parseServices(raw: string | undefined): LandingServiceItem[] {
  if (!raw) return landingTemplateDefaults.servicesItems;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return landingTemplateDefaults.servicesItems;

    const normalized = parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const service = item as Record<string, unknown>;
        if (
          typeof service.slug !== "string" ||
          typeof service.title !== "string" ||
          typeof service.shortDescription !== "string" ||
          typeof service.icon !== "string"
        ) {
          return null;
        }

        return {
          slug: service.slug,
          title: service.title,
          shortDescription: service.shortDescription,
          icon: service.icon,
          imageUrl:
            typeof service.imageUrl === "string" ? service.imageUrl : "",
        } as LandingServiceItem;
      })
      .filter((item): item is LandingServiceItem => item !== null);

    if (normalized.length === 0) return landingTemplateDefaults.servicesItems;
    return normalized;
  } catch {
    return landingTemplateDefaults.servicesItems;
  }
}

export function buildLandingTemplateConfig(
  configMap: Record<string, string>,
): LandingTemplateConfig {
  return {
    ...landingTemplateDefaults,
    heroEyebrow: parseString(
      configMap.tpl_heroEyebrow,
      landingTemplateDefaults.heroEyebrow,
    ),
    heroTitleStart: parseString(
      configMap.tpl_heroTitleStart,
      landingTemplateDefaults.heroTitleStart,
    ),
    heroTitleHighlightOne: parseString(
      configMap.tpl_heroTitleHighlightOne,
      landingTemplateDefaults.heroTitleHighlightOne,
    ),
    heroTitleConnector: parseString(
      configMap.tpl_heroTitleConnector,
      landingTemplateDefaults.heroTitleConnector,
    ),
    heroTitleHighlightTwo: parseString(
      configMap.tpl_heroTitleHighlightTwo,
      landingTemplateDefaults.heroTitleHighlightTwo,
    ),
    heroSubtitle: parseString(
      configMap.tpl_heroSubtitle,
      landingTemplateDefaults.heroSubtitle,
    ),
    heroPrimaryCtaLabel: parseString(
      configMap.tpl_heroPrimaryCtaLabel,
      landingTemplateDefaults.heroPrimaryCtaLabel,
    ),
    heroPrimaryCtaHref: parseString(
      configMap.tpl_heroPrimaryCtaHref,
      landingTemplateDefaults.heroPrimaryCtaHref,
    ),
    heroSecondaryCtaLabel: parseString(
      configMap.tpl_heroSecondaryCtaLabel,
      landingTemplateDefaults.heroSecondaryCtaLabel,
    ),
    heroSecondaryCtaHref: parseString(
      configMap.tpl_heroSecondaryCtaHref,
      landingTemplateDefaults.heroSecondaryCtaHref,
    ),

    statsItems: parseStats(configMap.tpl_statsItems),

    servicesEyebrow: parseString(
      configMap.tpl_servicesEyebrow,
      landingTemplateDefaults.servicesEyebrow,
    ),
    servicesTitle: parseString(
      configMap.tpl_servicesTitle,
      landingTemplateDefaults.servicesTitle,
    ),
    servicesSubtitle: parseString(
      configMap.tpl_servicesSubtitle,
      landingTemplateDefaults.servicesSubtitle,
    ),
    servicesDescription: parseString(
      configMap.tpl_servicesDescription,
      landingTemplateDefaults.servicesDescription,
    ),
    servicesLinkLabel: parseString(
      configMap.tpl_servicesLinkLabel,
      landingTemplateDefaults.servicesLinkLabel,
    ),
    servicesItems: parseServices(configMap.tpl_servicesItems),

    featuredProjectsEyebrow: parseString(
      configMap.tpl_featuredProjectsEyebrow,
      landingTemplateDefaults.featuredProjectsEyebrow,
    ),
    featuredProjectsTitle: parseString(
      configMap.tpl_featuredProjectsTitle,
      landingTemplateDefaults.featuredProjectsTitle,
    ),
    featuredProjectsSubtitle: parseString(
      configMap.tpl_featuredProjectsSubtitle,
      landingTemplateDefaults.featuredProjectsSubtitle,
    ),
    featuredProjectsLinkLabel: parseString(
      configMap.tpl_featuredProjectsLinkLabel,
      landingTemplateDefaults.featuredProjectsLinkLabel,
    ),

    clientsEyebrow: parseString(
      configMap.tpl_clientsEyebrow,
      landingTemplateDefaults.clientsEyebrow,
    ),
    clientsTitle: parseString(
      configMap.tpl_clientsTitle,
      landingTemplateDefaults.clientsTitle,
    ),

    ctaTitle: parseString(
      configMap.tpl_ctaTitle,
      landingTemplateDefaults.ctaTitle,
    ),
    ctaSubtitle: parseString(
      configMap.tpl_ctaSubtitle,
      landingTemplateDefaults.ctaSubtitle,
    ),
    ctaPrimaryLabel: parseString(
      configMap.tpl_ctaPrimaryLabel,
      landingTemplateDefaults.ctaPrimaryLabel,
    ),
    ctaPrimaryHref: parseString(
      configMap.tpl_ctaPrimaryHref,
      landingTemplateDefaults.ctaPrimaryHref,
    ),
    ctaSecondaryLabel: parseString(
      configMap.tpl_ctaSecondaryLabel,
      landingTemplateDefaults.ctaSecondaryLabel,
    ),
    ctaSecondaryHref: parseString(
      configMap.tpl_ctaSecondaryHref,
      landingTemplateDefaults.ctaSecondaryHref,
    ),

    contactInfoTitle: parseString(
      configMap.contactInfoTitle,
      landingTemplateDefaults.contactInfoTitle,
    ),
    contactInfoDescription: parseString(
      configMap.contactInfoDescription,
      landingTemplateDefaults.contactInfoDescription,
    ),
    contactPhone: parseString(
      configMap.contactPhone,
      landingTemplateDefaults.contactPhone,
    ),
    contactEmail: parseString(
      configMap.contactEmail,
      landingTemplateDefaults.contactEmail,
    ),
    contactAddress: parseString(
      configMap.contactAddress,
      landingTemplateDefaults.contactAddress,
    ),
    contactHours: parseString(
      configMap.contactHours,
      landingTemplateDefaults.contactHours,
    ),
  };
}

export function toLandingTemplateEntries(
  config: LandingTemplateConfig,
): Array<{ key: string; value: string }> {
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

    { key: "tpl_statsItems", value: JSON.stringify(config.statsItems) },

    { key: "tpl_servicesEyebrow", value: config.servicesEyebrow },
    { key: "tpl_servicesTitle", value: config.servicesTitle },
    { key: "tpl_servicesSubtitle", value: config.servicesSubtitle },
    { key: "tpl_servicesDescription", value: config.servicesDescription },
    { key: "tpl_servicesLinkLabel", value: config.servicesLinkLabel },
    { key: "tpl_servicesItems", value: JSON.stringify(config.servicesItems) },

    {
      key: "tpl_featuredProjectsEyebrow",
      value: config.featuredProjectsEyebrow,
    },
    { key: "tpl_featuredProjectsTitle", value: config.featuredProjectsTitle },
    {
      key: "tpl_featuredProjectsSubtitle",
      value: config.featuredProjectsSubtitle,
    },
    {
      key: "tpl_featuredProjectsLinkLabel",
      value: config.featuredProjectsLinkLabel,
    },

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
  ];
}
