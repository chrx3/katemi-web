import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

/**
 * Sin revalidate el sitemap se genera una sola vez en el build: un servicio o
 * proyecto creado desde el panel no aparecería hasta el próximo despliegue.
 */
export const revalidate = 3600;

function staticPages(now: Date): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/servicios`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proyectos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

/** Una fecha inválida en la base no debe tumbar el sitemap entero. */
function safeDate(value: unknown, fallback: Date): Date {
  if (typeof value !== "string") return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Se evalúa en cada regeneración, no al importar el módulo: así la fecha
  // refleja la última generación y no el arranque del proceso.
  const now = new Date();
  const base = staticPages(now);

  try {
    const [services, projects] = await Promise.all([
      getServices(),
      getProjects(),
    ]);

    return [
      ...base,
      ...services.map((s) => ({
        url: `${SITE_URL}/servicios/${s.slug}`,
        lastModified: safeDate(s.updatedAt, now),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...projects.map((p) => ({
        url: `${SITE_URL}/proyectos/${p.slug}`,
        lastModified: safeDate(p.updatedAt, now),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    // Si la base no responde, es preferible publicar las páginas fijas antes
    // que devolver un sitemap vacío o un error.
    console.error("Error generando el sitemap:", error);
    return base;
  }
}
