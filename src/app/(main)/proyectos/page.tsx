import type { Metadata } from 'next';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import ProjectsGrid, { type ProjectItem } from './ProjectsGrid';
import { getProjects, mediaUrl } from '@/lib/content';
import { companyDescription, companyInfo, toStaticProjectList } from '@/lib/company-content';

export const metadata: Metadata = {
  title: `Proyectos — ${companyInfo.legalName}`,
  description: 'Experiencia en proyectos comerciales e industriales en Chile.',
};

export const revalidate = 60;

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let projects: ProjectItem[] = [];

  try {
    projects = (await getProjects()).map((project) => {
      const images = Array.isArray(project.images)
        ? project.images.map((img) => mediaUrl(img)).filter(Boolean)
        : [];

      return {
        id: String(project.id),
        slug: project.slug,
        title: project.title,
        clientName: project.clientName,
        location: project.location ?? '',
        description: project.description,
        category: project.category ?? '',
        year: project.year != null ? String(project.year) : '',
        imageUrl: images[0],
        images,
      };
    });
  } catch (error) {
    console.error('Error cargando proyectos:', error);
  }

  if (projects.length === 0) {
    projects = toStaticProjectList().map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      clientName: project.clientName,
      location: project.location,
      description: project.description,
      category: project.category,
      year: String(project.year ?? ''),
      images: [],
    }));
  }

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      <PageHeader
        title="Proyectos"
        subtitle="Experiencia en proyectos comerciales e industriales"
        eyebrow="Nuestro Trabajo"
      />

      <ProjectsGrid projects={projects} initialCategory={category || 'all'} />

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
