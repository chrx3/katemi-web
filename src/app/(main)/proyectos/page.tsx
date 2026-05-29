'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '~/components/shared/PageHeader';
import ProjectCard from '~/components/shared/ProjectCard';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { pb } from '~/lib/pocketbase';
import { companyDescription, toStaticProjectList } from '@/lib/company-content';
import { normalizeImageList } from '@/lib/image-placeholders';

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

const staticProjects: Project[] = toStaticProjectList();

const CATEGORIES = ['Todos', 'Retail', 'Comercial', 'Industrial', 'Servicios'];

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
            images: normalizeImageList(r.images),
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
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      <PageHeader
        title="Proyectos"
        subtitle="Experiencia en proyectos comerciales e industriales"
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
              {companyDescription.closing}
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