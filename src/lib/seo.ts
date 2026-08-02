/**
 * Constantes de SEO.
 *
 * SITE_URL tiene que ser absoluta y sin barra final: se usa para construir el
 * sitemap, los canonical y las URLs de Open Graph, y una barra de más produce
 * URLs duplicadas que Google indexa por separado.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://katemi.cl"
).replace(/\/+$/, "");

/** Convierte una ruta del sitio en URL absoluta. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** "+56 9 9080 6947" → "+56990806947", el formato E.164 que espera schema.org. */
export function toE164(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}
