'use client';

import { useEffect, useState } from 'react';
import PageHeader from '~/components/shared/PageHeader';
import ServiceCard from '~/components/shared/ServiceCard';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { pb } from '~/lib/pocketbase';

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
  order?: number;
}

const staticServices: Service[] = [
  {
    id: '1',
    slug: 'ingenieria-y-diseno',
    title: 'Ingeniería y Diseño',
    shortDescription:
      'Diseño de proyectos eléctricos industriales, sistemas de potencia, subestaciones y líneas de transmisión. Estudios técnicos y memorias de cálculo.',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
  },
  {
    id: '2',
    slug: 'instalaciones-electricas',
    title: 'Instalaciones Eléctricas',
    shortDescription:
      'Ejecución de instalaciones eléctricas en media y baja tensión, tableros de distribución, cableado estructurado y sistemas de puesta a tierra.',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80',
  },
  {
    id: '3',
    slug: 'automatizacion-y-control',
    title: 'Automatización y Control',
    shortDescription:
      'Sistemas de automatización industrial, PLCs, variadores de frecuencia, control SCADA y supervisión remota de procesos eléctricos.',
    icon: 'Settings',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  },
  {
    id: '4',
    slug: 'mediciones-y-certificaciones',
    title: 'Mediciones y Certificaciones',
    shortDescription:
      'Certificaciones SEC, mediciones de tierra, termografías, análisis de calidad de energía y auditorías eléctricas conforme a normativa vigente.',
    icon: 'ClipboardCheck',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  },
];

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
    <div className="flex flex-col">
      <PageHeader
        title="Servicios"
        subtitle="Soluciones integrales en ingeniería eléctrica"
        eyebrow="Qué hacemos"
      />

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Ofrecemos un portafolio completo de servicios eléctricos para la industria, 
                infraestructura y el sector energético chileno.
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={i * 0.1}>
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
                title: 'Certificación SEC',
                text: 'Técnicos certificados ante la Superintendencia de Electricidad y Combustibles.',
              },
              {
                icon: 'Clock',
                title: 'Entrega en plazo',
                text: 'Compromiso firme con los cronogramas acordados sin comprometer la calidad.',
              },
              {
                icon: 'Users',
                title: 'Equipo especializado',
                text: 'Ingenieros y técnicos con amplia experiencia en terreno.',
              },
              {
                icon: 'Award',
                title: 'Alta calidad',
                text: 'Materiales de primeras marcas y estándares internacionales en cada proyecto.',
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