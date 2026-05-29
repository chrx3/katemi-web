import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katemi — Ingeniería y Proyectos Eléctricos",
  description:
    "Soluciones integrales en ingeniería eléctrica, instalaciones, automatización y certificaciones para la industria y infraestructura en Chile.",
  keywords: [
    "ingeniería eléctrica",
    "proyectos industriales",
    "Chile",
    "instalaciones eléctricas",
    "automatización",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={spaceGrotesk.variable}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased min-h-screen w-full overflow-x-hidden">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
