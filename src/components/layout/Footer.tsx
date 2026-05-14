'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Phone, Mail, MapPin, Linkedin, Instagram, ExternalLink } from 'lucide-react';

const serviceLinks = [
  { href: '/servicios#ingenieria', label: 'Ingeniería Eléctrica' },
  { href: '/servicios#instalaciones', label: 'Instalaciones' },
  { href: '/servicios#control', label: 'Automatización y Control' },
  { href: '/servicios#mediciones', label: 'Mediciones y Certificaciones' },
];

const empresaLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
];

function RevealItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--deep-blue, #162B4D)' }}>
      {/* Dot grid decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Subtle gradient overlay at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
      />

      <div className="container-max relative z-10 py-16 lg:py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand */}
          <RevealItem delay={0}>
            <div className="flex flex-col gap-5">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#00A896]">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  PRE<span className="text-[#00A896]">&</span>CON
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Ingeniería y Proyectos Eléctricos. Soluciones integrales para la industria y infraestructura en Chile.
              </p>
              {/* Contact Info */}
              <div className="flex flex-col gap-3 mt-1">
                <a
                  href="tel:+56912345678"
                  className="flex items-center gap-2.5 text-sm hover:text-[#00D4FF] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +56 9 1234 5678
                </a>
                <a
                  href="mailto:contacto@precon.cl"
                  className="flex items-center gap-2.5 text-sm hover:text-[#00D4FF] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  contacto@precon.cl
                </a>
              </div>
            </div>
          </RevealItem>

          {/* Col 2: Empresa */}
          <RevealItem delay={0.1}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Empresa
              </h3>
              <ul className="flex flex-col gap-2">
                {empresaLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* Col 3: Servicios */}
          <RevealItem delay={0.2}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Servicios
              </h3>
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* Col 4: Contacto */}
          <RevealItem delay={0.3}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Contacto
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Santiago, Chile</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Santiago+Chile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00A896] hover:text-[#00D4FF] transition-colors"
                >
                  Ver en Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="https://linkedin.com/company/precon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border hover:border-[#00A896] hover:bg-[#00A896]/10 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/precon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border hover:border-[#00A896] hover:bg-[#00A896]/10 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </RevealItem>
        </div>

        {/* Bottom Bar */}
        <RevealItem delay={0.4}>
          <div
            className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © {currentYear} PRE&CON · Todos los derechos reservados
            </p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00A896]" />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Hecho en Chile
              </span>
            </div>
          </div>
        </RevealItem>
      </div>
    </footer>
  );
}