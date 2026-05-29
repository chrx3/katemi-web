'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import ImageWithFallback from '~/components/shared/ImageWithFallback';
import ProjectCard from '~/components/shared/ProjectCard';
import * as LucideIcons from 'lucide-react';
import { pb } from '~/lib/pocketbase';
import { companyInfo, getServiceBySlug } from '@/lib/company-content';
import { normalizeImageList } from '@/lib/image-placeholders';

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  imageUrl?: string;
  images?: string[];
}

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

function toDetailService(slug: string): Service | null {
  const service = getServiceBySlug(slug);
  if (!service) return null;
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    description: service.fullDescription,
    icon: service.icon,
    features: service.features,
  };
}

export default function ServicioDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const record = await pb
          .collection('services')
          .getFirstListItem(`slug="${slug}"`);
        const s = record as unknown as Record<string, unknown>;
        setService({
          id: s.id as string,
          slug: s.slug as string,
          title: s.title as string,
          shortDescription: s.shortDescription as string,
          description: s.description as string,
          icon: (s.icon as string) || 'Box',
          features: s.features as string[] || [],
          imageUrl: s.imageUrl as string | undefined,
          images: normalizeImageList(s.images),
        });

        // Fetch related projects
        const projects = await pb
          .collection('projects')
          .getFullList({
            sort: '-year',
            filter: `isActive=true && servicesProvided~"${slug}"`,
          });
        setRelatedProjects(
          projects.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            slug: p.slug as string,
            title: p.title as string,
            clientName: p.clientName as string,
            location: p.location as string,
            description: p.description as string,
            category: p.category as string,
            year: p.year as string,
            imageUrl: p.imageUrl as string | undefined,
            images: normalizeImageList(p.images),
          }))
        );
      } catch {
        const fallback = toDetailService(slug);
        if (fallback) {
          setService(fallback);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Cargando..." />
        <section className="py-24 bg-white">
          <div className="container-max">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Servicio no encontrado" />
        <section className="py-24 bg-white">
          <div className="container-max text-center">
            <p className="text-gray-500 mb-6">
              El servicio que buscas no está disponible.
            </p>
            <Link
              href="/servicios"
              className="inline-flex items-center text-[#00A896] font-medium hover:underline"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver a Servicios
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const IconComponent =
    ((LucideIcons as unknown) as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[
      service.icon
    ] || LucideIcons.Box;

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      {/* Hero */}
      <PageHeader
        title={service.title}
        subtitle={service.shortDescription}
        eyebrow="Servicio"
      />

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid min-w-0 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="min-w-0 space-y-10 lg:col-span-2">
              {/* Icon + Intro */}
              <ScrollReveal>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#00A896] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <IconComponent size={36} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-3">
                      {service.title}
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Full Description */}
              {service.description && (
                <ScrollReveal delay={0.1}>
                  <div className="prose prose-gray max-w-none">
                    {service.description.split('\n\n').map((para, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed mb-4">
                        {para}
                      </p>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div className="bg-[#F5F5F5] rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-6">
                      Características del servicio
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <LucideIcons.CheckCircle
                              size={14}
                              className="text-white"
                            />
                          </div>
                          <span className="text-gray-700 leading-relaxed text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Image Gallery */}
              {service.images && service.images.length > 0 && (
                <ScrollReveal delay={0.3}>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-6">
                      Galería
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.images.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${service.title} - imagen ${i + 1}`}
                            fallbackKind="service"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScrollReveal delay={0.15}>
                <div className="bg-[#0B1D3A] rounded-2xl p-8 text-white sticky top-24">
                  <h3 className="font-bold text-lg mb-4 uppercase tracking-tight">
                    ¿Interesado en este servicio?
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    Contáctanos para recibir una asesoría personalizada y una cotización
                    sin compromiso.
                  </p>
                  <Link
                    href="/contacto"
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#00A896] text-white font-bold hover:bg-[#008f7f] transition-colors"
                  >
                    Solicitar cotización
                  </Link>
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <LucideIcons.Phone className="w-4 h-4" />
                      {companyInfo.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <LucideIcons.Mail className="w-4 h-4" />
                      {companyInfo.email}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Back link */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 pt-8 border-t border-gray-100">
              <Link
                href="/servicios"
                className="inline-flex items-center text-[#00A896] font-medium hover:text-[#0B1D3A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Volver a todos los servicios
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F5F5F5]">
          <div className="container-max">
            <ScrollReveal>
              <div className="mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                  Proyectos relacionados
                </span>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#0B1D3A] uppercase tracking-tight">
                  Proyectos donde hemos aplicado este servicio
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.1}>
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
          </div>
        </section>
      )}
    </div>
  );
}

