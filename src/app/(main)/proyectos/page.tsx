'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '~/components/shared/PageHeader';
import ProjectCard from '~/components/shared/ProjectCard';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { pb } from '~/lib/pocketbase';

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  location: string;
  description: string;
  category: string;
  year: string;
  imageUrl?: string;
  images?: string[];
}

const staticProjects: Project[] = [
  {
    id: '1',
    slug: 'se-pampa-norte',
    title: 'Subestación Eléctrica Pampa Norte',
    clientName: 'Minera Spence',
    location: 'Antofagasta, Chile',
    description:
      'Diseño y construcción de subestación eléctrica de 23kV para operaciones mineras en el norte de Chile.',
    category: 'Subestación',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
  },
  {
    id: '2',
    slug: 'lts-norte-grande',
    title: 'Línea de Transmisión Norte Grande',
    clientName: 'ENGIE Chile',
    location: 'Tarapacá, Chile',
    description:
      'Línea de transmisión de 220kV, 85km de extensión conectando zonas de generación renovable.',
    category: 'Transmisión',
    year: '2022',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  },
  {
    id: '3',
    slug: 'sf-planta-solar',
    title: 'Planta Solar Fotovoltaica Los Andes',
    clientName: 'Enel Green Power',
    location: 'Valparaíso, Chile',
    description:
      'Instalación de sistema fotovoltaico de 5MW con inversores de última generación.',
    category: 'Fotovoltaico',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  },
  {
    id: '4',
    slug: 'ind-codelco-radomiro',
    title: 'Sistema Eléctrico Industrial Radomiro Tomic',
    clientName: 'Codelco',
    location: 'Antofagasta, Chile',
    description:
      'Instalación y puesta en marcha de sistemas de distribución eléctrica para expansiones de planta.',
    category: 'Industrial',
    year: '2021',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  },
  {
    id: '5',
    slug: 'dist-sector-industrial',
    title: 'Red de Distribución Sector Industrial',
    clientName: 'Grupo Dreyfus',
    location: 'Biobío, Chile',
    description:
      'Diseño y ejecución de red de distribución en media tensión para parque industrial.',
    category: 'Distribución',
    year: '2022',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80',
  },
  {
    id: '6',
    slug: 'residencial-torres-sur',
    title: 'Instalación Residencial Torres del Sur',
    clientName: 'Inmobiliaria Sur',
    location: 'Santiago, Chile',
    description:
      'Instalación eléctrica completa para complejo residencial de 120 departamentos.',
    category: 'Residencial',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
];

const CATEGORIES = ['Todos', 'Subestación', 'Transmisión', 'Distribución', 'Fotovoltaico', 'Industrial', 'Residencial'];

function ProyectosContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('category') || 'Todos'
  );

  useEffect(() => {
    async function fetchProjects() {
      try {
        const records = await pb
          .collection('projects')
          .getFullList({ sort: '-year', filter: 'isActive=true' });
        if (records.length > 0) {
          const mapped: Project[] = records.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            slug: r.slug as string,
            title: r.title as string,
            clientName: r.clientName as string,
            location: r.location as string,
            description: r.description as string,
            category: r.category as string,
            year: r.year as string,
            imageUrl: r.imageUrl as string | undefined,
            images: r.images as string[] | undefined,
          }));
          setProjects(mapped);
        }
      } catch {
        // Use static fallback
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered =
    activeCategory === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Filter Pills */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30 backdrop-blur-sm bg-white/90">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#00A896] text-white shadow-sm'
                    : 'bg-[#F5F5F5] text-[#2A3F5F] hover:bg-[#0B1D3A] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No hay proyectos en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ScrollReveal key={project.id} delay={(i % 3) * 0.1}>
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    clientName={project.clientName}
                    location={project.location}
                    description={project.description}
                    category={project.category}
                    year={project.year}
                    imageUrl={project.imageUrl}
                    images={project.images}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProyectosPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Proyectos"
        subtitle="Proyectos ejecutados en todo Chile"
        eyebrow="Nuestro Trabajo"
      />

      <Suspense
        fallback={
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ProyectosContent />
      </Suspense>

      {/* CTA */}
      <section className="py-16 bg-[#00A896]">
        <div className="container-max text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Conversemos sobre cómo podemos hacer realidad tu próximo proyecto eléctrico.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-[#00A896] font-bold hover:bg-[#F5F5F5] transition-colors shadow-lg"
            >
              Cotizar proyecto
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}