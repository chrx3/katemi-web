"use client";

import Link from "next/link";
import ScrollReveal from "../shared/ScrollReveal";

export default function CTABanner() {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-[#0B1D3A]">
      {/* Diagonal Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255, 255, 255, 0.3) 35px,
            rgba(255, 255, 255, 0.3) 70px
          )`,
        }}
      />

      {/* Subtle Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0, 168, 150, 0.4) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <ScrollReveal>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ¿Listo para tu próximo proyecto?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg md:text-xl text-[#F5F5F5] mb-10 max-w-2xl mx-auto">
            Contáctanos hoy y hagamos realidad tu proyecto eléctrico
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-[#00A896] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#00D4FF] transition-colors duration-300 text-lg"
            >
              Solicitar Cotización
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#0B1D3A] transition-colors duration-300 text-lg"
            >
              Ver Proyectos
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Decorative Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, #00A896, #00D4FF, #00A896)",
        }}
      />
    </section>
  );
}