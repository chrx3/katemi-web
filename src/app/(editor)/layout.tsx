import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import "../globals.css";

/**
 * Layout raíz del editor visual.
 *
 * Vive en su propio route group, separado del sitio público y del panel:
 * necesita los estilos del sitio (Tailwind y globals.css) para que la vista
 * previa se vea igual que la página real, pero sin la barra de navegación ni
 * el pie. Dentro del panel de Payload no serviría, porque ahí Tailwind no está
 * cargado y la previa se renderizaría sin estilos.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Editor visual — KATEMI",
  robots: { index: false, follow: false },
};

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={spaceGrotesk.variable}>
      <body className="antialiased min-h-screen w-full bg-[#F5F5F5]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
