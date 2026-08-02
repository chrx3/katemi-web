import { companyInfo } from "@/lib/company-content";

/**
 * Acceso directo a WhatsApp.
 *
 * El número ya venía cargado en la configuración desde la migración, pero no
 * se usaba en ninguna parte del sitio. Para un contratista en Chile es el canal
 * por el que llega la mayor parte del trabajo, así que conviene que esté a un
 * toque desde cualquier página.
 *
 * Se ubica sobre el botón de volver arriba, que ocupa la esquina inferior
 * derecha.
 */
export default function WhatsAppButton({ phone }: { phone?: string }) {
  const digits = (phone ?? "").replace(/\D/g, "");
  // Sin número configurado no se muestra nada: mejor ausente que roto.
  if (digits.length < 8) return null;

  const message = encodeURIComponent(
    `Hola ${companyInfo.legalName}, me gustaría cotizar un proyecto.`,
  );

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-40 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg shadow-[#128C7E]/25 transition-colors duration-300 hover:bg-[#0d6d62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D4FF] sm:bottom-24 sm:right-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
      </svg>
    </a>
  );
}
