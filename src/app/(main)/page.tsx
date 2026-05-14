import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import StatsBar from '@/components/sections/StatsBar';
import ServicesPreview from '@/components/sections/ServicesPreview';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import ClientsMarquee from '@/components/sections/ClientsMarquee';
import CTABanner from '@/components/sections/CTABanner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'PRE&CON — Ingeniería y Proyectos Eléctricos',
  description:
    'PRE&CON es una empresa líder en ingeniería y proyectos eléctricos en Chile. Más de 12 años ejecutando proyectos en media y alta tensión para las principales empresas del sector.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesPreview />
        <FeaturedProjects />
        <ClientsMarquee />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}