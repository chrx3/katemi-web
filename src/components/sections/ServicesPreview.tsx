'use client';

import Link from 'next/link';
import SectionHeader from '../shared/SectionHeader';
import ServiceCard from '../shared/ServiceCard';
import ScrollReveal from '../shared/ScrollReveal';
import pb from '@/lib/pocketbase';

const staticServices = [
  {
    slug: 'ingenieria-electrica',
    title: 'Ingeniería Eléctrica',
    shortDescription:
      'Diseño y desarrollo de proyectos eléctricos de media y alta tensión, desde la conceptualización hasta la puesta en servicio.',
    icon: 'Zap',
    imageUrl: '',
  },
  {
    slug: 'instalaciones',
    title: 'Instalaciones Eléctricas',
    shortDescription:
      'Ejecución profesional de instalaciones eléctricas industriales y comerciales, con los más altos estándares de seguridad.',
    icon: 'Wrench',
    imageUrl: '',
  },
  {
    slug: 'automatizacion',
    title: 'Automatización y Control',
    shortDescription:
      'Sistemas de automatización, control SCADA y tableros de distribución para optimizar procesos industriales.',
    icon: 'Settings',
    imageUrl: '',
  },
  {
    slug: 'mediciones',
    title: 'Mediciones y Certificaciones',
    shortDescription:
      'Ensayos de puesta en servicio, mediciones de tierra, termografías y certificaciones según normativa chilena.',
    icon: 'FileCheck',
    imageUrl: '',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="container-max">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left: Header + text */}
          <div className="lg:w-5/12 lg:pt-4">
            <SectionHeader
              title="Nuestros Servicios"
              subtitle="Soluciones integrales en ingeniería eléctrica para la industria y infraestructura en Chile."
              eyebrow="Qué hacemos"
              centered={false}
            />
            <ScrollReveal delay={0.3}>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Contamos con un equipo multidisciplinario de ingenieros y técnicos
                especializados en cada área de la ingeniería eléctrica, aportando
                soluciones seguras, eficientes y normativas a cada proyecto.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <Link
                href="/servicios"
                className="mt-8 inline-flex items-center gap-2 text-[#00A896] font-semibold hover:text-[#0B1D3A] transition-colors"
              >
                Ver Todos los Servicios
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: 2x2 grid of ServiceCards */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {staticServices.map((service, i) => (
              <ScrollReveal key={service.slug} delay={i * 0.1}>
                <ServiceCard
                  slug={service.slug}
                  title={service.title}
                  shortDescription={service.shortDescription}
                  icon={service.icon}
                  imageUrl={service.imageUrl}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}