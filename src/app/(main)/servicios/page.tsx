'use client';

import { useEffect, useState } from 'react';
import PageHeader from '~/components/shared/PageHeader';
import ServiceCard from '~/components/shared/ServiceCard';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { pb } from '~/lib/pocketbase';
import { companyDescription, companyInfo, toStaticServiceList } from '@/lib/company-content';

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
  order?: number;
}

const staticServices: Service[] = toStaticServiceList();

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const records = await pb
          .collection('services')
          .getFullList({ sort: 'order', filter: 'isActive=true' });
        if (records.length > 0) {
          const mapped: Service[] = records.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            slug: r.slug as string,
            title: r.title as string,
            shortDescription: r.shortDescription as string,
            icon: (r.icon as string) || 'Box',
            imageUrl: r.imageUrl as string | undefined,
            order: r.order as number | undefined,
          }));
          setServices(mapped);
        }
      } catch {
        // Use static fallback
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      <PageHeader
        title="Servicios"
        subtitle={companyInfo.tagline}
        eyebrow="Qué hacemos"
      />

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {companyDescription.sectors}
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={i * 0.1} className="h-full">
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
          )}
        </div>
      </section>

      {/* Diferenciales */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Por qué elegirnos
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0B1D3A]">
                Compromiso con la excelencia
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'ShieldCheck',
                title: 'Seguridad y cumplimiento',
                text: 'Trabajamos bajo los más altos estándares de seguridad y apego a la normativa vigente.',
              },
              {
                icon: 'Clock',
                title: 'Adaptación operacional',
                text: 'Nos ajustamos a los requerimientos técnicos y operacionales de cada proyecto.',
              },
              {
                icon: 'Users',
                title: 'Red de especialistas',
                text: 'Contamos con una red de colaboración con profesionales de distintas áreas.',
              },
              {
                icon: 'Award',
                title: 'Calidad técnica',
                text: 'Entregamos soluciones confiables, seguras y de alto nivel técnico para cada cliente.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-[#F5F5F5] rounded-2xl p-6 hover:bg-[#0B1D3A] group transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#00A896]/10 flex items-center justify-center mb-5 group-hover:bg-[#00A896]/20 transition-colors">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-bold text-[#0B1D3A] group-hover:text-white text-lg mb-2 uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0B1D3A]">
        <div className="container-max text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas una cotización?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Contáctanos y te entregamos una propuesta personalizada para tu proyecto.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-[#00A896] text-white font-bold hover:bg-[#008f7f] transition-colors shadow-lg"
            >
              Solicitar cotización
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}