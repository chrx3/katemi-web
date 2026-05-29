'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { IN_VIEW_AMOUNT, IN_VIEW_MARGIN } from '@/lib/motion-viewport';
import Link from 'next/link';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { Target, Eye, Heart, Phone } from 'lucide-react';
import ImageWithFallback from "~/components/shared/ImageWithFallback";
import { PLACEHOLDER_IMAGES } from "@/lib/image-placeholders";
import {
  companyDescription,
  companyInfo,
  companyMission,
  companyStats,
  companyValues,
  companyVision,
  leadership,
} from '@/lib/company-content';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45 }}
      className="text-4xl md:text-5xl font-bold text-[#00A896]"
    >
      {isInView ? target : 0}{suffix}
    </motion.span>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function NosotrosPage() {
  const statsRef = useRef(null);
  useInView(statsRef, { once: true });

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Nosotros"
        subtitle={`Conoce a ${companyInfo.legalName}`}
        eyebrow="Nuestra Empresa"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B1D3A]">
                  <ImageWithFallback
                    src={PLACEHOLDER_IMAGES.about}
                    alt={`Equipo ${companyInfo.brandName} en terreno`}
                    fallbackKind="about"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#00A896]/10 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0B1D3A]/5 rounded-2xl -z-10" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="flex flex-col gap-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                  Nuestra Historia
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D3A] leading-tight">
                  {companyInfo.legalName} — {companyInfo.tagline}
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{companyDescription.intro}</p>
                  <p>{companyDescription.sectors}</p>
                  <p>{companyDescription.collaboration}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-16 bg-[#0B1D3A]">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {companyStats.map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter target={Number(stat.value)} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#00A896]/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#00A896]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Misión
                </h3>
                <p className="text-gray-600 leading-relaxed">{companyMission}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#0B1D3A]/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-[#0B1D3A]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Visión
                </h3>
                <p className="text-gray-600 leading-relaxed">{companyVision}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#F5A623]/10 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">
                  Valores
                </h3>
                <ul className="space-y-2 text-gray-600 leading-relaxed">
                  {companyValues.map((value) => (
                    <li key={value} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Liderazgo
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0B1D3A]">
                Representante legal
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <div className="relative inline-block mb-5">
                <div className="w-28 h-28 rounded-full mx-auto border-4 border-[#F5F5F5] bg-[#0B1D3A] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(leadership.name)}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-[#0B1D3A] text-lg uppercase tracking-tight">
                {leadership.name}
              </h3>
              <p className="text-[#00A896] text-sm font-medium mt-0.5">
                {leadership.role} · {companyInfo.legalName}
              </p>
              <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
                {leadership.bio}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                {leadership.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-[#00A896]">
        <div className="container-max text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {companyDescription.closing}
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
