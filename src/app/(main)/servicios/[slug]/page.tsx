import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import ImageWithFallback from '~/components/shared/ImageWithFallback';
import ProjectCard from '~/components/shared/ProjectCard';
import Breadcrumbs from '~/components/shared/Breadcrumbs';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import * as LucideIcons from 'lucide-react';
import {
  getProjectsByServiceSlug,
  getServiceBySlug as getPayloadServiceBySlug,
  mediaUrl,
} from '@/lib/content';
import { companyInfo, getServiceBySlug } from '@/lib/company-content';

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

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPayloadServiceBySlug(slug).catch(() => null);
  const title = service?.title ?? getServiceBySlug(slug)?.title;

  if (!title) return { title: 'Servicio no encontrado' };

  const description = service?.shortDescription ?? undefined;
  const url = `/servicios/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function ServicioDetailPage({ params }: Params) {
  const { slug } = await params;

  let service: Service | null = null;
  let relatedProjects: Project[] = [];

  try {
    const doc = await getPayloadServiceBySlug(slug);
    if (doc) {
      service = {
        id: String(doc.id),
        slug: doc.slug,
        title: doc.title,
        shortDescription: doc.shortDescription,
        description: doc.fullDescription,
        icon: doc.icon || 'Box',
        features: Array.isArray(doc.features)
          ? doc.features.map((f) => f.text).filter(Boolean)
          : [],
        imageUrl: mediaUrl(doc.image) || undefined,
      };

      relatedProjects = (await getProjectsByServiceSlug(slug)).map((p) => {
        const images = Array.isArray(p.images)
          ? p.images.map((img) => mediaUrl(img)).filter(Boolean)
          : [];
        return {
          id: String(p.id),
          slug: p.slug,
          title: p.title,
          clientName: p.clientName,
          location: p.location ?? '',
          description: p.description,
          category: p.category ?? '',
          year: p.year != null ? String(p.year) : '',
          imageUrl: images[0],
          images,
        };
      });
    }
  } catch (error) {
    console.error('Error cargando el servicio:', error);
  }

  if (!service) service = toDetailService(slug);

  if (!service) {
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

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
          { label: service.title },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', path: '/' },
          { name: 'Servicios', path: '/servicios' },
          { name: service.title, path: `/servicios/${service.slug}` },
        ]}
      />

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid min-w-0 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="min-w-0 space-y-10 lg:col-span-2">
              {/* El titulo y el subtitulo ya estan en el encabezado de la
                  pagina; repetirlos aqui era decir lo mismo dos veces seguidas.
                  Queda solo el icono como ancla visual de la seccion. */}
              <ScrollReveal>
                <div className="flex size-16 items-center justify-center rounded-2xl bg-[#00A896] shadow-lg">
                  <IconComponent size={30} className="text-white" />
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

