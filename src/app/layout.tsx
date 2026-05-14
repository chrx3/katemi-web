import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from '~/components/ui/sonner';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PRE&CON Ingenieria',
  description: 'Ingeniería de proyectos industriales y construcción en Chile',
  keywords: ['ingeniería', 'construcción', 'Chile', 'proyectos industriales'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={spaceGrotesk.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
