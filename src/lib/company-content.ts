export interface CompanyService {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  icon: string;
  order: number;
}

export interface CompanyProject {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  location: string;
  description: string;
  category: string;
  year: string;
  servicesProvided: string[];
  isFeatured: boolean;
}

export interface CompanyClient {
  name: string;
  website: string;
  order: number;
  logoUrl: string;
}

export interface CompanyStat {
  value: string;
  label: string;
  suffix: string;
}

export interface CompanyLeader {
  name: string;
  role: string;
  bio: string;
  credentials: string[];
}

export const companyInfo = {
  legalName: "KATEMI E.I.R.L.",
  brandName: "Katemi",
  tagline: "Ingeniería y Construcción",
  address: "Av. Vicuña Mackenna #7611\nComuna de Renca, Santiago, Chile",
  addressLine: "Av. Vicuña Mackenna #7611, Comuna de Renca, Santiago, Chile",
  phone: "+56 9 9080 6947",
  email: "decoraelectro@gmail.com",
  hours: "Lunes a Viernes: 8:30 – 18:30",
  googleMapsUrl:
    "https://maps.google.com/?q=Av.+Vicu%C3%B1a+Mackenna+7611,+Renca,+Santiago,+Chile",
};

export const companyDescription = {
  intro:
    "KATEMI E.I.R.L. es una empresa dedicada al desarrollo y ejecución de proyectos de ingeniería, construcción e instalaciones, entregando soluciones integrales con foco en la calidad, seguridad y cumplimiento técnico.",
  sectors:
    "Participamos en proyectos del sector comercial, industrial y de servicios, desarrollando trabajos de ejecución, mantención, remodelación, normalización e integración de especialidades, adaptándonos a los requerimientos técnicos y operacionales de cada proyecto.",
  collaboration:
    "Para el desarrollo de proyectos especializados, KATEMI E.I.R.L. trabaja mediante una red de colaboración con profesionales y especialistas de distintas áreas, permitiéndonos complementar capacidades técnicas y entregar soluciones integrales según el alcance y necesidades de cada cliente, incorporando cuando corresponde servicios tecnológicos e informáticos.",
  closing:
    "En KATEMI E.I.R.L. trabajamos bajo los más altos estándares de seguridad, calidad y cumplimiento, manteniendo estricto apego a la normativa vigente y buenas prácticas de ingeniería, con el objetivo de entregar soluciones confiables, seguras y de alto nivel técnico para cada cliente.",
};

export const companyMission =
  "Entregar soluciones integrales en ingeniería, construcción e instalaciones, con foco en calidad, seguridad y cumplimiento técnico para clientes del sector comercial, industrial y de servicios.";

export const companyVision =
  "Ser un referente en proyectos de ingeniería y construcción en Chile, reconocidos por la excelencia técnica, la confiabilidad operacional y la capacidad de integrar especialidades según las necesidades de cada cliente.";

export const companyValues = [
  "Seguridad y cumplimiento normativo",
  "Calidad en cada entrega",
  "Integridad y transparencia",
  "Adaptación a los requerimientos del cliente",
];

export const leadership: CompanyLeader = {
  name: "Kevin Ignacio Acosta Torres",
  role: "Gerente General",
  bio: "Ingeniero Eléctrico en Automatización, certificado SEC Clase A, con más de 8 años de experiencia en desarrollo, ejecución y supervisión de proyectos, manteniendo altos estándares técnicos y operativos en cada servicio entregado.",
  credentials: [
    "Ingeniero Eléctrico en Automatización",
    "Certificación SEC Clase A",
    "Más de 8 años de experiencia",
  ],
};

export const companyStats: CompanyStat[] = [
  { value: "8", label: "Años de Experiencia", suffix: "+" },
  { value: "4", label: "Proyectos Destacados", suffix: "" },
  { value: "3", label: "Sectores Atendidos", suffix: "" },
  { value: "15", label: "Servicios Especializados", suffix: "" },
];

export const seoDefaults = {
  title: "KATEMI E.I.R.L. — Ingeniería y Construcción",
  description:
    "KATEMI E.I.R.L. desarrolla y ejecuta proyectos de ingeniería, construcción e instalaciones para sectores comercial, industrial y de servicios en Chile. Calidad, seguridad y cumplimiento técnico.",
};

export const services: CompanyService[] = [
  {
    id: "1",
    slug: "instalaciones-electricas",
    title: "Instalaciones eléctricas",
    shortDescription:
      "Ejecución de instalaciones eléctricas con estándares de seguridad y cumplimiento normativo.",
    fullDescription:
      "Desarrollamos e implementamos instalaciones eléctricas para proyectos comerciales, industriales y de servicios, asegurando calidad constructiva, continuidad operacional y apego a la normativa vigente.",
    features: [
      "Instalaciones comerciales e industriales",
      "Cableado y canalizaciones",
      "Puesta en servicio y pruebas",
      "Cumplimiento normativo SEC",
    ],
    icon: "Zap",
    order: 1,
  },
  {
    id: "2",
    slug: "montaje-industrial-electrico",
    title: "Montaje industrial eléctrico",
    shortDescription:
      "Montaje de equipos y sistemas eléctricos para entornos industriales exigentes.",
    fullDescription:
      "Ejecutamos montaje industrial eléctrico en terreno, coordinando especialidades y asegurando la correcta instalación de equipos, canalizaciones y sistemas de distribución.",
    features: [
      "Montaje de equipos eléctricos",
      "Canalizaciones y bandejas",
      "Conexionado y pruebas",
      "Supervisión técnica en terreno",
    ],
    icon: "Wrench",
    order: 2,
  },
  {
    id: "3",
    slug: "proyectos-declaraciones-t1",
    title: "Proyectos y declaraciones T1",
    shortDescription:
      "Elaboración de proyectos eléctricos y gestión de declaraciones T1 conforme a normativa.",
    fullDescription:
      "Preparamos proyectos eléctricos y gestionamos declaraciones T1, acompañando al cliente desde la ingeniería hasta la aprobación y puesta en servicio.",
    features: [
      "Ingeniería de proyectos eléctricos",
      "Declaraciones T1",
      "Planos y memorias técnicas",
      "Gestión ante organismos competentes",
    ],
    icon: "FileCheck",
    order: 3,
  },
  {
    id: "4",
    slug: "mallas-a-tierra",
    title: "Construcción y medición de mallas a tierra",
    shortDescription:
      "Diseño, construcción y medición de sistemas de puesta a tierra.",
    fullDescription:
      "Construimos mallas a tierra y realizamos mediciones de resistencia de puesta a tierra, garantizando la seguridad de personas e instalaciones.",
    features: [
      "Diseño de mallas a tierra",
      "Construcción e instalación",
      "Mediciones y certificación",
      "Informes técnicos",
    ],
    icon: "Activity",
    order: 4,
  },
  {
    id: "5",
    slug: "banco-ductos-electricos",
    title: "Construcción de banco ductos eléctricos",
    shortDescription:
      "Construcción de banco ductos para canalización segura de líneas eléctricas.",
    fullDescription:
      "Ejecutamos obras de banco ductos eléctricos para proyectos que requieren canalización subterránea segura y durable.",
    features: [
      "Excavación y obra civil",
      "Instalación de ductos",
      "Canalizaciones eléctricas",
      "Control de calidad en terreno",
    ],
    icon: "Layers",
    order: 5,
  },
  {
    id: "6",
    slug: "climatizacion",
    title: "Climatización",
    shortDescription:
      "Instalación y mantención de sistemas de climatización para espacios comerciales e industriales.",
    fullDescription:
      "Implementamos soluciones de climatización adaptadas a cada proyecto, integrando equipamiento, ductería y puesta en marcha.",
    features: [
      "Sistemas de climatización",
      "Instalación de equipos",
      "Mantención preventiva",
      "Ajuste y puesta en servicio",
    ],
    icon: "Wind",
    order: 6,
  },
  {
    id: "7",
    slug: "mantencion-tableros-electricos",
    title: "Mantención y normalización de tableros eléctricos",
    shortDescription:
      "Mantención, reparación y normalización de tableros eléctricos.",
    fullDescription:
      "Realizamos mantención y normalización de tableros eléctricos para asegurar continuidad operacional, seguridad y cumplimiento técnico.",
    features: [
      "Diagnóstico de tableros",
      "Normalización eléctrica",
      "Reparación y repotenciación",
      "Pruebas de funcionamiento",
    ],
    icon: "LayoutGrid",
    order: 7,
  },
  {
    id: "8",
    slug: "automatizacion-integracion",
    title: "Automatización e integración de sistemas",
    shortDescription:
      "Automatización e integración de sistemas para optimizar procesos operacionales.",
    fullDescription:
      "Desarrollamos e integramos sistemas de automatización que permiten controlar, supervisar y optimizar procesos en proyectos comerciales, industriales y de servicios.",
    features: [
      "Integración de sistemas",
      "Automatización de procesos",
      "Supervisión y control",
      "Puesta en marcha",
    ],
    icon: "Settings",
    order: 8,
  },
  {
    id: "9",
    slug: "soluciones-informaticas",
    title: "Desarrollo e implementación de soluciones informáticas y tecnológicas",
    shortDescription:
      "Soluciones tecnológicas e informáticas complementarias para proyectos especializados.",
    fullDescription:
      "Incorporamos servicios tecnológicos e informáticos cuando el proyecto lo requiere, complementando capacidades técnicas con soluciones digitales e integración de sistemas.",
    features: [
      "Soluciones informáticas a medida",
      "Integración tecnológica",
      "Soporte a automatización",
      "Implementación en terreno",
    ],
    icon: "Cpu",
    order: 9,
  },
  {
    id: "10",
    slug: "construcciones-remodelaciones",
    title: "Construcciones menores y remodelaciones",
    shortDescription:
      "Construcciones menores y remodelaciones adaptadas a cada requerimiento operacional.",
    fullDescription:
      "Ejecutamos construcciones menores y remodelaciones en proyectos comerciales e industriales, coordinando especialidades y plazos de entrega.",
    features: [
      "Remodelaciones comerciales",
      "Obras menores",
      "Coordinación de especialidades",
      "Entrega llave en mano",
    ],
    icon: "Hammer",
    order: 10,
  },
  {
    id: "11",
    slug: "pintura-terminaciones",
    title: "Pintura y terminaciones",
    shortDescription:
      "Servicios de pintura y terminaciones para espacios comerciales e industriales.",
    fullDescription:
      "Realizamos trabajos de pintura y terminaciones con estándares de calidad acordes a entornos operacionales exigentes.",
    features: [
      "Pintura interior y exterior",
      "Terminaciones finales",
      "Preparación de superficies",
      "Control de calidad",
    ],
    icon: "Paintbrush",
    order: 11,
  },
  {
    id: "12",
    slug: "instalacion-ceramica",
    title: "Instalación de cerámica",
    shortDescription:
      "Instalación profesional de cerámica en proyectos comerciales y de servicios.",
    fullDescription:
      "Ejecutamos instalación de cerámica con precisión técnica y acabados de calidad para espacios comerciales e industriales.",
    features: [
      "Instalación de cerámica",
      "Nivelación y acabados",
      "Trabajos en áreas operativas",
      "Control de terminaciones",
    ],
    icon: "Grid3x3",
    order: 12,
  },
  {
    id: "13",
    slug: "trabajos-yeso",
    title: "Trabajos en yeso",
    shortDescription:
      "Trabajos en yeso para terminaciones, reparaciones y adecuaciones de espacios.",
    fullDescription:
      "Desarrollamos trabajos en yeso para remodelaciones, reparaciones y terminaciones en proyectos comerciales e industriales.",
    features: [
      "Tabiques y cielos",
      "Reparaciones en yeso",
      "Terminaciones",
      "Adecuación de espacios",
    ],
    icon: "Square",
    order: 13,
  },
  {
    id: "14",
    slug: "estructuras-metalicas",
    title: "Fabricación y montaje de estructuras metálicas",
    shortDescription:
      "Fabricación y montaje de estructuras metálicas para proyectos de construcción e industrial.",
    fullDescription:
      "Fabricamos y montamos estructuras metálicas para proyectos que requieren soluciones robustas, seguras y adaptadas a condiciones de terreno.",
    features: [
      "Fabricación de estructuras",
      "Montaje en terreno",
      "Soldadura y ensamblaje",
      "Control estructural",
    ],
    icon: "Factory",
    order: 14,
  },
  {
    id: "15",
    slug: "mantencion-general",
    title: "Servicios generales de mantención",
    shortDescription:
      "Servicios generales de mantención para continuidad operacional de instalaciones.",
    fullDescription:
      "Brindamos servicios generales de mantención para asegurar la operación continua y segura de instalaciones comerciales, industriales y de servicios.",
    features: [
      "Mantención preventiva",
      "Mantención correctiva",
      "Atención de urgencias",
      "Soporte operacional",
    ],
    icon: "ShieldCheck",
    order: 15,
  },
];

export const featuredProjects: CompanyProject[] = [
  {
    id: "1",
    slug: "falabella-paseo-puente",
    title: "Falabella Paseo Puente",
    clientName: "Falabella",
    location: "Santiago, Chile",
    description:
      "Ejecución de instalaciones de luminarias, pintura, trabajos en yeso, reparación de techumbres, obras sanitarias, climatización, reparaciones eléctricas y estructuras metálicas.",
    category: "Retail",
    year: "2024",
    servicesProvided: [
      "instalaciones-electricas",
      "climatizacion",
      "pintura-terminaciones",
      "trabajos-yeso",
      "estructuras-metalicas",
    ],
    isFeatured: true,
  },
  {
    id: "2",
    slug: "falabella-ahumada-locales",
    title: "Falabella Ahumada — Locales 165 y 25",
    clientName: "Falabella",
    location: "Santiago, Chile",
    description:
      "Ejecución de trabajos de mantención, remodelación e instalaciones en locales comerciales.",
    category: "Comercial",
    year: "2024",
    servicesProvided: [
      "construcciones-remodelaciones",
      "mantencion-general",
      "instalaciones-electricas",
    ],
    isFeatured: true,
  },
  {
    id: "3",
    slug: "autoplaza-proyecto-electrico",
    title: "Autoplaza — Proyecto eléctrico integral",
    clientName: "Autoplaza",
    location: "Santiago, Chile",
    description:
      "Desarrollo integral de proyecto eléctrico, incluyendo ingeniería, elaboración de planos y ejecución en terreno.",
    category: "Industrial",
    year: "2024",
    servicesProvided: [
      "proyectos-declaraciones-t1",
      "instalaciones-electricas",
      "montaje-industrial-electrico",
    ],
    isFeatured: true,
  },
  {
    id: "4",
    slug: "aguas-andinas-automatizacion",
    title: "Aguas Andinas — Automatización e integración",
    clientName: "Aguas Andinas",
    location: "Santiago, Chile",
    description:
      "Participación en proyecto de automatización e integración de sistemas para operaciones de servicios.",
    category: "Servicios",
    year: "2024",
    servicesProvided: ["automatizacion-integracion", "soluciones-informaticas"],
    isFeatured: true,
  },
];

export const FALABELLA_LOGO_URL = "/clients/falabella.png";

export const clients: CompanyClient[] = [
  {
    name: "Falabella",
    website: "https://www.falabella.com",
    order: 1,
    logoUrl: FALABELLA_LOGO_URL,
  },
  {
    name: "Autoplaza",
    website: "https://www.mallplaza.com/cl/vespucio/autoplaza",
    order: 2,
    logoUrl: "/clients/autoplaza.svg",
  },
  {
    name: "Aguas Andinas",
    website: "https://www.aguasandinas.cl",
    order: 3,
    logoUrl: "/clients/aguas-andinas.png",
  },
];

export const contactFormSubjects = [
  "Instalaciones eléctricas",
  "Proyectos y declaraciones T1",
  "Climatización",
  "Automatización e integración",
  "Construcción y remodelación",
  "Mantención general",
  "Cotización",
  "Consulta general",
];

export function getServiceBySlug(slug: string): CompanyService | undefined {
  return services.find((service) => service.slug === slug);
}

export function getProjectBySlug(slug: string): CompanyProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}

export function toStaticServiceList() {
  return services.map(({ id, slug, title, shortDescription, icon, order }) => ({
    id,
    slug,
    title,
    shortDescription,
    icon,
    order,
  }));
}

export function toStaticProjectList() {
  return featuredProjects.map(
    ({ id, slug, title, clientName, location, description, category, year }) => ({
      id,
      slug,
      title,
      clientName,
      location,
      description,
      category,
      year,
    }),
  );
}

export function toLandingServiceItems(limit = 6) {
  return services.slice(0, limit).map(({ slug, title, shortDescription, icon }) => ({
    slug,
    title,
    shortDescription,
    icon,
    imageUrl: "",
  }));
}

export function getClientLogoUrl(name: string): string {
  if (name.trim().toLowerCase() === "falabella") return FALABELLA_LOGO_URL;
  return clients.find((client) => client.name === name)?.logoUrl ?? "";
}

export function toClientFallback() {
  return clients.map(({ name, website, logoUrl }) => ({
    name,
    logoUrl,
    website,
  }));
}

export function toFeaturedProjectFallback() {
  return featuredProjects.map(
    ({ slug, title, clientName, location, description, category, year }) => ({
      slug,
      title,
      clientName,
      location,
      description,
      category,
      year,
    }),
  );
}

export function toFooterServiceLinks(limit = 6) {
  return services.slice(0, limit).map(({ slug, title }) => ({
    href: `/servicios/${slug}`,
    label: title,
  }));
}
