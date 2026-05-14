import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from '~/components/ui/sonner';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import LenisProvider from '~/components/providers/LenisProvider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Katemi — Ingeniería y Proyectos Eléctricos',
  description: 'Soluciones integrales en ingeniería eléctrica, instalaciones, automatización y certificaciones para la industria y infraestructura en Chile.',
  keywords: ['ingeniería eléctrica', 'proyectos industriales', 'Chile', 'instalaciones eléctricas', 'automatización'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={spaceGrotesk.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <LenisProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}