import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import ScrollToTop from '~/components/layout/ScrollToTop';
import LenisProvider from '~/components/providers/LenisProvider';
import { Toaster } from '~/components/ui/sonner';
import { getLandingTemplate } from '@/lib/content';
import { landingTemplateDefaults } from '@/lib/template-config';
import '../globals.css';

/**
 * Layout raíz del sitio público.
 *
 * El <html> y el <body> viven acá y no en un app/layout.tsx global porque
 * Payload monta su propio layout raíz en el grupo (payload). Con un layout
 * global por encima quedaban dos <html> anidados y el panel reventaba con
 * errores de hidratación.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Katemi — Ingeniería y Proyectos Eléctricos',
  description:
    'Soluciones integrales en ingeniería eléctrica, instalaciones, automatización y certificaciones para la industria y infraestructura en Chile.',
  keywords: [
    'ingeniería eléctrica',
    'proyectos industriales',
    'Chile',
    'instalaciones eléctricas',
    'automatización',
  ],
};

// El contenido se sirve estático y se refresca cada minuto. Antes la home se
// horneaba en el build, así que editar en el panel no cambiaba nada hasta
// volver a desplegar.
export const revalidate = 60;

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let template = landingTemplateDefaults;

  try {
    template = await getLandingTemplate();
  } catch (error) {
    console.error('Error loading landing template config for layout:', error);
  }

  return (
    <html
      lang="es-CL"
      className={spaceGrotesk.variable}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased min-h-screen w-full overflow-x-hidden">
        <LenisProvider>
          <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1 w-full min-w-0 overflow-x-hidden">
              {children}
            </main>
            <Footer template={template} />
            <ScrollToTop />
          </div>
        </LenisProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
