import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import ScrollToTop from '~/components/layout/ScrollToTop';
import WhatsAppButton from '~/components/layout/WhatsAppButton';
import LenisProvider from '~/components/providers/LenisProvider';
import { Toaster } from '~/components/ui/sonner';
import { getLandingTemplate } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import { GoogleAnalytics } from '@next/third-parties/google';
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

// Medicion de audiencia. Va solo en el sitio publico: el panel y el editor no
// se miden, no aportan nada y son uso interno.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  // metadataBase resuelve las URLs relativas de Open Graph y canonical. Sin
  // esto Next emite rutas relativas, que las redes sociales no saben resolver.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KATEMI E.I.R.L. — Ingeniería y Construcción',
    template: '%s | KATEMI E.I.R.L.',
  },
  description:
    'Desarrollo y ejecución de proyectos de ingeniería, construcción e instalaciones para los sectores comercial, industrial y de servicios en Chile.',
  keywords: [
    'instalaciones eléctricas',
    'montaje industrial eléctrico',
    'declaraciones T1',
    'mallas a tierra',
    'climatización',
    'contratista eléctrico Santiago',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'KATEMI E.I.R.L.',
    title: 'KATEMI E.I.R.L. — Ingeniería y Construcción',
    description:
      'Proyectos de ingeniería, construcción e instalaciones con foco en calidad, seguridad y cumplimiento técnico.',
    url: '/',
    images: [{ url: '/brand/katemi-wordmark.png', width: 770, height: 285, alt: 'KATEMI E.I.R.L.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KATEMI E.I.R.L. — Ingeniería y Construcción',
    description:
      'Proyectos de ingeniería, construcción e instalaciones en Chile.',
    images: ['/brand/katemi-wordmark.png'],
  },
  robots: { index: true, follow: true },
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
      {/* clip y no hidden: hidden crea un contenedor de scroll y eso anula
          el position:sticky de la barra de navegacion, que se iba de pantalla
          al bajar. clip recorta igual sin crear ese contenedor. */}
      <body className="antialiased min-h-screen w-full overflow-x-clip">
        <OrganizationJsonLd template={template} />
        <LenisProvider>
          <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-clip">
            <Navbar />
            <main className="flex-1 w-full min-w-0 overflow-x-clip">
              {children}
            </main>
            <Footer template={template} />
            <WhatsAppButton phone={template.whatsapp} />
            <ScrollToTop />
          </div>
        </LenisProvider>
        <Toaster position="top-right" richColors />
        {/* Solo se carga donde la variable esta definida. Sin esa condicion,
            cada recarga en desarrollo y cada visita a staging contarian como
            trafico real y ensuciarian los informes. */}
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
