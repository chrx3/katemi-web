"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import type { LandingTemplateConfig } from "@/lib/template-config";
import InlineEditableText from "@/components/template/InlineEditableText";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const serviceLinks = [
  { href: "/servicios#ingenieria", label: "Ingeniería Eléctrica" },
  { href: "/servicios#instalaciones", label: "Instalaciones" },
  { href: "/servicios#control", label: "Automatización y Control" },
  { href: "/servicios#mediciones", label: "Mediciones y Certificaciones" },
];

const empresaLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

function RevealItem({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

type FooterEditableKey =
  | "contactInfoDescription"
  | "contactPhone"
  | "contactEmail"
  | "contactAddress"
  | "linkedinUrl"
  | "instagramUrl"
  | "googleMapsUrl";

interface FooterProps {
  template?: LandingTemplateConfig;
  editable?: boolean;
  onFieldChange?: (key: FooterEditableKey, value: string) => void;
  previewMode?: boolean;
}

export default function Footer({
  template,
  editable = false,
  onFieldChange,
  previewMode = false,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerDescription =
    template?.contactInfoDescription ||
    "Ingeniería y Proyectos Eléctricos. Soluciones integrales para la industria y infraestructura en Chile.";
  const footerPhone = template?.contactPhone || "+56 9 1234 5678";
  const footerEmail = template?.contactEmail || "contacto@katemi.chrsx3.com";
  const footerAddress = template?.contactAddress || "Santiago, Chile";
  const footerLinkedin = template?.linkedinUrl || "footerLinkedin";
  const footerInstagram = template?.instagramUrl || "footerInstagram";
  const footerMapsUrl = template?.googleMapsUrl || "footerMapsUrl";
  const phoneHref = `tel:${footerPhone.replace(/\s+/g, "").replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${footerEmail.trim()}`;

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--deep-blue, #162B4D)" }}
    >
      {/* Dot grid decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle gradient overlay at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
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
                  Katemi
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={footerDescription}
                    onChange={(v) => onFieldChange("contactInfoDescription", v)}
                    multiline
                    className="text-sm leading-relaxed"
                    editingClassName="bg-white/10 text-white border-b-[#00D4FF]"
                  />
                ) : (
                  footerDescription
                )}
              </p>
              {/* Contact Info */}
              <div className="flex flex-col gap-3 mt-1">
                {editable && onFieldChange ? (
                  <div
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <InlineEditableText
                      value={footerPhone}
                      onChange={(v) => onFieldChange("contactPhone", v)}
                      className="text-sm"
                      editingClassName="bg-white/10 text-white border-b-[#00D4FF]"
                    />
                  </div>
                ) : (
                  <a
                    href={phoneHref}
                    className="flex items-center gap-2.5 text-sm hover:text-[#00D4FF] transition-colors"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    {footerPhone}
                  </a>
                )}
                {editable && onFieldChange ? (
                  <div
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <InlineEditableText
                      value={footerEmail}
                      onChange={(v) => onFieldChange("contactEmail", v)}
                      className="text-sm"
                      editingClassName="bg-white/10 text-white border-b-[#00D4FF]"
                    />
                  </div>
                ) : (
                  <a
                    href={emailHref}
                    className="flex items-center gap-2.5 text-sm hover:text-[#00D4FF] transition-colors"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {footerEmail}
                  </a>
                )}
              </div>
            </div>
          </RevealItem>

          {/* Col 2: Empresa */}
          <RevealItem delay={0.1}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Empresa
              </h3>
              {previewMode ? (
              <ul className="flex flex-col gap-2">
                {empresaLinks.map((link) => (
                  <li key={link.href}>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{link.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col gap-2">
                {empresaLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </RevealItem>

          {/* Col 3: Servicios */}
          <RevealItem delay={0.2}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Servicios
              </h3>
              {previewMode ? (
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{link.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </RevealItem>

          {/* Col 4: Contacto */}
          <RevealItem delay={0.3}>
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                Contacto
              </h3>
              <div className="flex flex-col gap-3">
                <div
                  className="flex items-start gap-2.5 text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {editable && onFieldChange ? (
                    <InlineEditableText
                      value={footerAddress}
                      onChange={(v) => onFieldChange("contactAddress", v)}
                      multiline
                      className="text-sm whitespace-pre-line"
                      editingClassName="bg-white/10 text-white border-b-[#00D4FF]"
                    />
                  ) : (
                    <span className="whitespace-pre-line">{footerAddress}</span>
                  )}
                </div>
                {previewMode ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
                  Ver en Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              ) : (
                <a
                  href={footerMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00A896] hover:text-[#00D4FF] transition-colors"
                >
                  Ver en Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-3">
                {previewMode ? (
                  <>
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/30" aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></span>
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/30" aria-label="Instagram"><InstagramIcon className="w-4 h-4" /></span>
                  </>
                ) : (
                  <>
                    <a href={footerLinkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg border hover:border-[#00A896] hover:bg-[#00A896]/10 transition-all duration-200" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }} aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></a>
                    <a href={footerInstagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg border hover:border-[#00A896] hover:bg-[#00A896]/10 transition-all duration-200" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }} aria-label="Instagram"><InstagramIcon className="w-4 h-4" /></a>
                  </>
                )}
              </div>
              {editable && onFieldChange && (
                <div className="mt-2 space-y-1">
                  <InlineEditableText value={footerLinkedin} onChange={(v) => onFieldChange("linkedinUrl", v)} className="text-xs text-white/50" editingClassName="bg-white/10 text-white border-b-[#00D4FF] text-xs" />
                  <InlineEditableText value={footerInstagram} onChange={(v) => onFieldChange("instagramUrl", v)} className="text-xs text-white/50" editingClassName="bg-white/10 text-white border-b-[#00D4FF] text-xs" />
                  <InlineEditableText value={footerMapsUrl} onChange={(v) => onFieldChange("googleMapsUrl", v)} className="text-xs text-white/50" editingClassName="bg-white/10 text-white border-b-[#00D4FF] text-xs" />
                </div>
              )}
            </div>
          </RevealItem>
        </div>

        {/* Bottom Bar */}
        <RevealItem delay={0.4}>
          <div
            className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              © {currentYear} Katemi · Todos los derechos reservados
            </p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00A896]" />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Hecho en Chile
              </span>
            </div>
          </div>
        </RevealItem>
      </div>
    </footer>
  );
}
