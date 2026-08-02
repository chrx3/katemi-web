import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El panel, el editor y la API no aportan nada a un buscador y el
        // editor además exige sesión: indexarlo solo genera errores de rastreo.
        disallow: ["/admin", "/editor-visual", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
