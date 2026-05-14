'use client';

import Link from 'next/link';
import SectionHeader from '../shared/SectionHeader';
import ProjectCard from '../shared/ProjectCard';
import ScrollReveal from '../shared/ScrollReveal';

const staticProjects = [
  {
    slug: 'subestacion-cge-central',
    title: 'Subestación 110kV Central',
    clientName: 'CGE',
    location: 'Región Metropolitana',
    description:
      'Diseño y construcción de subestación de transformación 110/23kV con capacidad de 40 MVA para suministro industrial.',
    category: 'Media Tensión',
    year: '2024',
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80',
  },
  {
    slug: 'linea-aerea-220kv',
    title: 'Línea Aérea 220kV',
    clientName: 'Transelec',
    location: 'Región del Biobío',
    description:
      'Instalación de 28 km de línea aérea en 220kV con towers de acero galvanizado, incluyendo tendido de conductores.',
    category: 'Alta Tensión',
    year: '2023',
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  },
  {
    slug: 'sistema-automatizacion-enel',
    title: 'Sistema SCADA Enel',
    clientName: 'Enel',
    location: 'Región de Valparaíso',
    description:
      'Implementación de sistema SCADA para control y monitoreo de redes de distribución en media tensión.',
    category: 'Automatización',
    year: '2023',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-24 bg-[#2A3F5F]">
      <div className="container-max">
        <SectionHeader
          title="Proyectos Destacados"
          subtitle="Conoce algunos de nuestros proyectos más relevantes ejecutados para las principales empresas del sector."
          eyebrow="Portafolio"
          light
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticProjects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.12}>
              <ProjectCard
                slug={project.slug}
                title={project.title}
                clientName={project.clientName}
                location={project.location}
                description={project.description}
                category={project.category}
                year={project.year}
                imageUrl={project.imageUrl}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#00D4FF] transition-colors"
            >
              Ver Todos los Proyectos
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
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}