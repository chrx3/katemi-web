import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Calendar, User, Tag, CheckCircle, Phone, Mail } from 'lucide-react';
import ScrollReveal from '~/components/shared/ScrollReveal';
import Breadcrumbs from '~/components/shared/Breadcrumbs';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import * as LucideIcons from 'lucide-react';
import ImageWithFallback from "~/components/shared/ImageWithFallback";
import { resolveProjectImage } from "@/lib/image-placeholders";
import { getProjectBySlug as getPayloadProjectBySlug, mediaUrl } from '@/lib/content';
import { companyInfo, getProjectBySlug } from '@/lib/company-content';
import { categoryLabel } from '@/lib/project-categories';

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

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPayloadProjectBySlug(slug).catch(() => null);
  const title = project?.title ?? getProjectBySlug(slug)?.title;

  if (!title) return { title: 'Proyecto no encontrado', robots: { index: false } };

  const description = project?.description ?? undefined;
  const url = `/proyectos/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function ProyectoDetailPage({ params }: Params) {
  const { slug } = await params;

  let project: Project | null = null;

  try {
    const doc = await getPayloadProjectBySlug(slug);
    if (doc) {
      const images = Array.isArray(doc.images)
        ? doc.images.map((img) => mediaUrl(img)).filter(Boolean)
        : [];

      project = {
        id: String(doc.id),
        slug: doc.slug,
        title: doc.title,
        clientName: doc.clientName,
        location: doc.location ?? '',
        description: doc.description,
        category: doc.category ?? '',
        year: doc.year != null ? String(doc.year) : '',
        // La relación viene resuelta con depth 1, así que se muestran los
        // títulos reales de los servicios en vez de sus slugs.
        servicesProvided: Array.isArray(doc.servicesProvided)
          ? doc.servicesProvided
              .map((s) => (typeof s === 'object' && s !== null ? s.title : ''))
              .filter(Boolean)
          : [],
        imageUrl: images[0],
        images,
      };
    }
  } catch (error) {
    console.error('Error cargando el proyecto:', error);
  }

  if (!project) project = toDetailProject(slug);

  if (!project) notFound();

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
              {categoryLabel(project.category)}
            </span>
            <h1 className="max-w-3xl break-words text-4xl font-bold uppercase leading-tight tracking-tight text-white md:text-5xl">
              {project.title}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Proyectos', href: '/proyectos' },
          { label: project.title },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', path: '/' },
          { name: 'Proyectos', path: '/proyectos' },
          { name: project.title, path: `/proyectos/${project.slug}` },
        ]}
      />

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
              <span className="font-medium">{categoryLabel(project.category)}</span>
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

