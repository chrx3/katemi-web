'use client';

import { useState } from 'react';
import ProjectCard from '~/components/shared/ProjectCard';
import ScrollReveal from '~/components/shared/ScrollReveal';

export interface ProjectItem {
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

/**
 * Las etiquetas se muestran, los valores se comparan.
 *
 * Antes el filtro comparaba contra las etiquetas capitalizadas ("Retail")
 * mientras la base guarda los valores en minúscula ("retail"), así que elegir
 * cualquier categoría dejaba la grilla vacía.
 */
const CATEGORIES = [
  { label: 'Todos', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Comercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Servicios', value: 'services' },
];

export default function ProjectsGrid({
  projects,
  initialCategory = 'all',
}: {
  projects: ProjectItem[];
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30 backdrop-blur-sm bg-white/90">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                aria-pressed={activeCategory === cat.value}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-[#00A896] text-white shadow-sm'
                    : 'bg-[#F5F5F5] text-[#2A3F5F] hover:bg-[#0B1D3A] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          {filtered.length === 0 ? (
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
