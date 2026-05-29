'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, User, Tag, CheckCircle, Phone, Mail } from 'lucide-react';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import * as LucideIcons from 'lucide-react';
import { pb } from '~/lib/pocketbase';
import ImageWithFallback from "~/components/shared/ImageWithFallback";
import { resolveProjectImage, normalizeImageList } from "@/lib/image-placeholders";
import { companyInfo, getProjectBySlug } from '@/lib/company-content';

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  location: string;
  description: string;
  category: string;
  year: string;
  servicesProvided?: string[];
  imageUrl?: string;
  images?: string[];
}

interface AllProjectsResult {
  id: string;
  slug: string;
}

function toDetailProject(slug: string): Project | null {
  const project = getProjectBySlug(slug);
  if (!project) return null;
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    clientName: project.clientName,
    location: project.location,
    description: project.description,
    category: project.category,
    year: project.year,
    servicesProvided: project.servicesProvided,
  };
}

export default function ProyectoDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const record = await pb
          .collection('projects')
          .getFirstListItem(`slug="${slug}"`);
        const p = record as unknown as Record<string, unknown>;
        setProject({
          id: p.id as string,
          slug: p.slug as string,
          title: p.title as string,
          clientName: p.clientName as string,
          location: p.location as string,
          description: p.description as string,
          category: p.category as string,
          year: p.year as string,
          servicesProvided: p.servicesProvided as string[] | undefined,
          imageUrl: p.imageUrl as string | undefined,
          images: normalizeImageList(p.images),
        });
      } catch {
        const fallback = toDetailProject(slug);
        if (fallback) {
          setProject(fallback);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Cargando..." />
        <section className="py-24 bg-white">
          <div className="container-max">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="Proyecto no encontrado" />
        <section className="py-24 bg-white">
          <div className="container-max text-center">
            <p className="text-gray-500 mb-6">
              El proyecto que buscas no está disponible.
            </p>
            <Link
              href="/proyectos"
              className="inline-flex items-center text-[#00A896] font-medium hover:underline"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver a Proyectos
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const heroImage = resolveProjectImage(project.imageUrl, project.images);

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      {/* Hero with bg image */}
      <section
        className="relative flex min-h-[50svh] items-end overflow-hidden sm:min-h-[60svh]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/90 via-[#0B1D3A]/40 to-transparent" />

        <div className="container-max relative z-10 pb-16 pt-32">
          <ScrollReveal>
            <span className="inline-block bg-[#F5A623] text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
              {project.category}
            </span>
            <h1 className="max-w-3xl break-words text-4xl font-bold uppercase leading-tight tracking-tight text-white md:text-5xl">
              {project.title}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Info Row */}
      <section className="bg-[#0B1D3A]">
        <div className="container-max py-6">
          <div className="flex flex-wrap gap-6 md:gap-12 text-white text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#00A896]" />
              <span className="text-white/60 mr-1.5">Cliente:</span>
              <span className="font-medium">{project.clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00A896]" />
              <span className="text-white/60 mr-1.5">Ubicación:</span>
              <span className="font-medium">{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00A896]" />
              <span className="text-white/60 mr-1.5">Año:</span>
              <span className="font-medium">{project.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#00A896]" />
              <span className="text-white/60 mr-1.5">Categoría:</span>
              <span className="font-medium">{project.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <ScrollReveal>
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-6">
                    Descripción del proyecto
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    {project.description.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Services provided */}
              {project.servicesProvided && project.servicesProvided.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div className="bg-[#F5F5F5] rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-6">
                      Servicios realizados
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {project.servicesProvided.map((service, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle size={14} className="text-white" />
                          </div>
                          <span className="text-gray-700 leading-relaxed text-sm">
                            {service}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}

              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-6">
                      Galería del proyecto
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.images.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${project.title} - imagen ${i + 1}`}
                            fallbackKind="project"
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
                    ¿Tienes un proyecto similar?
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    Contáctanos y te entregamos una asesoría personalizada sin compromiso.
                  </p>
                  <Link
                    href="/contacto"
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#00A896] text-white font-bold hover:bg-[#008f7f] transition-colors"
                  >
                    Solicitar cotización
                  </Link>
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Phone className="w-4 h-4" />
                      {companyInfo.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Mail className="w-4 h-4" />
                      {companyInfo.email}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Back + Prev/Next */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 pt-8 border-t border-gray-100">
              <Link
                href="/proyectos"
                className="inline-flex items-center text-[#00A896] font-medium hover:text-[#0B1D3A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Volver a todos los proyectos
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

