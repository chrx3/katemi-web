import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Migas de pan de las páginas de detalle.
 *
 * Hasta ahora la única forma de volver era un enlace al pie de la página, y no
 * había señal de dónde estaba uno dentro del sitio. Además le da a los
 * buscadores la jerarquía de la sección.
 */
export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Ruta de navegación" className="border-b border-gray-100 bg-white">
      <div className="container-max">
        <ol className="flex flex-wrap items-center gap-1.5 py-3 text-sm">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className="size-3.5 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 transition-colors hover:text-[#00796B]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium text-[#0B1D3A]"
                    aria-current={last ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
