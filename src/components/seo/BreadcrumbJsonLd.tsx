import { JsonLd } from "./JsonLd";
import { absoluteUrl } from "@/lib/seo";

/**
 * Ruta de navegación para buscadores.
 *
 * Es lo que hace que Google muestre "katemi.cl › Servicios › Climatización" en
 * lugar de la URL cruda. Debe reflejar las mismas migas que ve el visitante.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}

export default BreadcrumbJsonLd;
