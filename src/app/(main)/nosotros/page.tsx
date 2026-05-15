'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { Target, Eye, Heart, Users, Phone, ExternalLink } from 'lucide-react';

// Static data - in production this would come from PocketBase
const staticTeam = [
  {
    id: '1',
    name: 'Roberto Cádiz',
    role: 'Director General',
    bio: 'Ingeniero eléctrico con más de 25 años de experiencia en proyectos industriales y de infraestructura.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    id: '2',
    name: 'Patricia Valenzuela',
    role: 'Gerenta de Proyectos',
    bio: 'Especialista en gestión de proyectos de transmisión y distribución con certificación PMP.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  {
    id: '3',
    name: 'Marco Hernández',
    role: 'Jefe de Ingeniería',
    bio: 'Ingeniero senior en sistemas de potencia, experto en diseño de subestaciones y líneas de transmisión.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    id: '4',
    name: 'Claudia Sáez',
    role: 'Directora de Operaciones',
    bio: 'Profesional con amplia experiencia en coordinación de instalaciones eléctricas industriales y certificación SEC.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-5xl font-bold text-[#00A896]"
    >
      {isInView ? target : 0}{suffix}
    </motion.span>
  );
}

export default function NosotrosPage() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Nosotros"
        subtitle="Conoce a Katemi"
        eyebrow="Nuestra Empresa"
      />

      {/* Historia Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B1D3A]">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                    alt="Equipo Katemi en terreno"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#00A896]/10 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0B1D3A]/5 rounded-2xl -z-10" />
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="flex flex-col gap-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                  Nuestra Historia
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D3A] leading-tight">
                  Más de 15 años construyendo infraestructura eléctrica en Chile
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Katemi nació en 2009 con una visión clara: convertirse en una empresa líder en 
                    ingeniería y proyectos eléctricos, comprometida con la calidad, la seguridad y 
                    el desarrollo sostenible de Chile.
                  </p>
                  <p>
                    Desde nuestros inicios, hemos participado en proyectos de transmisión y distribución 
                    eléctrica, instalaciones industriales, sistemas fotovoltaicos y automatización de 
                    procesos, consolidando relaciones de largo plazo con empresas del sector minero, 
                    industrial y de servicios.
                  </p>
                  <p>
                    Hoy, nuestro equipo está conformado por profesionales altamente capacitados y 
                    comprometidos, que trabajan día a día para entregar soluciones que contribuyen 
                    al desarrollo energético del país.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 bg-[#0B1D3A]">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <AnimatedCounter target={50} suffix="+" />
              <p className="mt-2 text-sm text-white/60">Proyectos completados</p>
            </div>
            <div>
              <AnimatedCounter target={15} suffix="+" />
              <p className="mt-2 text-sm text-white/60">Años de experiencia</p>
            </div>
            <div>
              <AnimatedCounter target={200} suffix="+" />
              <p className="mt-2 text-sm text-white/60">Proyectos en terreno</p>
            </div>
            <div>
              <AnimatedCounter target={98} suffix="%" />
              <p className="mt-2 text-sm text-white/60">Satisfacción del cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Nuestros Pilares
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0B1D3A]">
                Lo que nos define
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#00A896]/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#00A896]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Misión
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Entregar soluciones integrales en ingeniería eléctrica, contribuyendo al 
                  desarrollo sostenible de la infraestructura energética de Chile con 
                  seguridad, calidad y compromiso environmental.
                </p>
              </div>
            </ScrollReveal>

            {/* Visión */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#0B1D3A]/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-[#0B1D3A]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Visión
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser la empresa de referencia en proyectos eléctricos industriales en Chile, 
                  reconocida por la excelencia técnica, la innovación y la capacidad de 
                  adaptarse a las demandas energéticas del futuro.
                </p>
              </div>
            </ScrollReveal>

            {/* Valores */}
            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#F5A623]/10 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Valores
                </h3>
                <ul className="space-y-2 text-gray-600 leading-relaxed">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                    Seguridad primero, siempre
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                    Compromiso con la calidad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                    Integridad en cada proyecto
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                    Trabajo en equipo
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Nuestro Equipo
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0B1D3A]">
                Profesionales que hacen la diferencia
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staticTeam.map((member, i) => (
              <ScrollReveal key={member.id} delay={i * 0.1}>
                <div className="text-center group">
                  {/* Avatar */}
                  <div className="relative inline-block mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border-4 border-[#F5F5F5] group-hover:border-[#00A896] transition-colors">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* LinkedIn icon on hover */}
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#0B1D3A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0B1D3A] text-lg uppercase tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-[#00A896] text-sm font-medium mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#00A896]">
        <div className="container-max text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Contáctanos y descubre cómo podemos ayudarte a hacer realidad tu próximo proyecto eléctrico.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-[#00A896] font-bold hover:bg-[#F5F5F5] transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contactar ahora
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}