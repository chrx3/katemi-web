import type { Metadata } from 'next';
import PageHeader from '~/components/shared/PageHeader';
import ServiceCard from '~/components/shared/ServiceCard';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { getServices, mediaUrl } from '@/lib/content';
import { companyDescription, companyInfo, toStaticServiceList } from '@/lib/company-content';

export const metadata: Metadata = {
  title: `Servicios — ${companyInfo.legalName}`,
  description: companyDescription.sectors,
};

export const revalidate = 60;

interface ServiceCardData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
}

export default async function ServiciosPage() {
  // Se renderiza en el servidor: antes esto se pedía desde el navegador, así
  // que los buscadores nunca veían los servicios y se alcanzaba a ver el
  // contenido de respaldo antes de que llegara el real.
  let services: ServiceCardData[] = [];

  try {
    services = (await getServices()).map((service) => ({
      id: String(service.id),
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      icon: service.icon || 'Box',
      imageUrl: mediaUrl(service.image) || undefined,
    }));
  } catch (error) {
    console.error('Error cargando servicios:', error);
  }

  if (services.length === 0) {
    services = toStaticServiceList().map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      icon: service.icon,
    }));
  }

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