"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import ServicesPreview from "@/components/sections/ServicesPreview";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import CTABanner from "@/components/sections/CTABanner";
import InlineEditableText from "@/components/template/InlineEditableText";
import type { LandingTemplateConfig, LandingStat } from "@/lib/template-config";

type MutableTemplateKey = Exclude<
  keyof LandingTemplateConfig,
  "statsItems" | "servicesItems"
>;

type PreviewView =
  | "/"
  | "/contacto"
  | "/nosotros"
  | "/servicios"
  | "/proyectos";

interface LandingTemplatePreviewProps {
  template: LandingTemplateConfig;
  includeChrome?: boolean;
  editable?: boolean;
  showGuides?: boolean;
  view?: PreviewView;
  onNavigate?: (href: string) => void;
  onFieldChange?: (key: MutableTemplateKey, value: string) => void;
  onServiceChange?: (
    index: number,
    field: keyof LandingTemplateConfig["servicesItems"][number],
    value: string,
  ) => void;
  onStatChange?: (index: number, patch: Partial<LandingStat>) => void;
}

function SectionFrame({
  title,
  mode,
  show,
  children,
}: {
  title: string;
  mode: "editable" | "crud";
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return <>{children}</>;
  const isEditable = mode === "editable";

  return (
    <div
      className={`relative ${isEditable ? "ring-2 ring-[#00A896]/35 shadow-[0_0_0_4px_rgba(0,168,150,0.08)]" : "ring-2 ring-[#3b82f6]/25 ring-dashed"} rounded-xl overflow-hidden`}
    >
      <div className="absolute top-2 left-2 z-30">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${isEditable ? "bg-[#00A896] text-white" : "bg-[#3b82f6] text-white"}`}
        >
          {isEditable ? "Editable aquí" : "Desde CRUD"} · {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function ContactPreview({
  template,
  editable,
  showGuides,
  onFieldChange,
}: {
  template: LandingTemplateConfig;
  editable: boolean;
  showGuides: boolean;
  onFieldChange?: (key: MutableTemplateKey, value: string) => void;
}) {
  return (
    <SectionFrame title="Página Contacto" mode="editable" show={showGuides}>
      <section className="py-16 bg-white">
        <div className="container-max max-w-5xl">
          <h1 className="text-4xl font-bold text-[#0B1D3A] mb-6">Contacto</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0B1D3A]">
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactInfoTitle}
                    onChange={(v) => onFieldChange("contactInfoTitle", v)}
                    className="text-2xl font-bold text-[#0B1D3A]"
                  />
                ) : (
                  template.contactInfoTitle
                )}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactInfoDescription}
                    onChange={(v) => onFieldChange("contactInfoDescription", v)}
                    multiline
                    className="text-gray-600"
                  />
                ) : (
                  template.contactInfoDescription
                )}
              </div>
            </div>
            <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Teléfono</p>
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactPhone}
                    onChange={(v) => onFieldChange("contactPhone", v)}
                    className="font-medium text-[#0B1D3A]"
                  />
                ) : (
                  <p className="font-medium text-[#0B1D3A]">
                    {template.contactPhone}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Correo</p>
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactEmail}
                    onChange={(v) => onFieldChange("contactEmail", v)}
                    className="font-medium text-[#0B1D3A]"
                  />
                ) : (
                  <p className="font-medium text-[#0B1D3A]">
                    {template.contactEmail}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Dirección</p>
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactAddress}
                    onChange={(v) => onFieldChange("contactAddress", v)}
                    multiline
                    className="font-medium text-[#0B1D3A] whitespace-pre-line"
                  />
                ) : (
                  <p className="font-medium text-[#0B1D3A] whitespace-pre-line">
                    {template.contactAddress}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Horario</p>
                {editable && onFieldChange ? (
                  <InlineEditableText
                    value={template.contactHours}
                    onChange={(v) => onFieldChange("contactHours", v)}
                    className="font-medium text-[#0B1D3A]"
                  />
                ) : (
                  <p className="font-medium text-[#0B1D3A]">
                    {template.contactHours}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionFrame>
  );
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <section className="py-20 bg-white">
      <div className="container-max max-w-4xl">
        <div className="rounded-xl border border-dashed border-[#3b82f6]/40 bg-[#eff6ff] p-8 text-center">
          <p className="text-sm text-[#1e40af]">
            Vista {label} activa dentro del editor
          </p>
          <p className="text-xs text-[#1e3a8a] mt-2">
            Aquí puedes navegar sin salir del editor. La edición visual de esta
            página va en el siguiente bloque.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LandingTemplatePreview({
  template,
  includeChrome = true,
  editable = false,
  showGuides = false,
  view = "/",
  onNavigate,
  onFieldChange,
  onServiceChange,
  onStatChange,
}: LandingTemplatePreviewProps) {
  return (
    <div className="min-h-screen bg-white">
      {includeChrome && (
        <Navbar editorMode={editable} onEditorNavigate={onNavigate} />
      )}
      <main>
        {view === "/" && (
          <>
            <SectionFrame title="Hero" mode="editable" show={showGuides}>
              <HeroSection
                content={template}
                editable={editable}
                onFieldChange={onFieldChange as never}
              />
            </SectionFrame>

            <SectionFrame title="Métricas" mode="editable" show={showGuides}>
              <StatsBar
                stats={template.statsItems}
                editable={editable}
                onStatChange={onStatChange}
              />
            </SectionFrame>

            <SectionFrame
              title="Servicios (presentación)"
              mode="editable"
              show={showGuides}
            >
              <ServicesPreview
                content={template}
                editable={editable}
                onFieldChange={onFieldChange as never}
                onServiceChange={onServiceChange}
              />
            </SectionFrame>

            <SectionFrame title="Proyectos" mode="crud" show={showGuides}>
              <FeaturedProjects content={template} />
            </SectionFrame>

            <SectionFrame title="Clientes" mode="crud" show={showGuides}>
              <ClientsMarquee content={template} />
            </SectionFrame>

            <SectionFrame title="CTA final" mode="editable" show={showGuides}>
              <CTABanner
                content={template}
                editable={editable}
                onFieldChange={onFieldChange as never}
              />
            </SectionFrame>
          </>
        )}

        {view === "/contacto" && (
          <ContactPreview
            template={template}
            editable={editable}
            showGuides={showGuides}
            onFieldChange={onFieldChange}
          />
        )}

        {view === "/nosotros" && <PlaceholderPage label="Nosotros" />}
        {view === "/servicios" && <PlaceholderPage label="Servicios" />}
        {view === "/proyectos" && <PlaceholderPage label="Proyectos" />}
      </main>

      {includeChrome && (
        <SectionFrame title="Footer" mode="editable" show={showGuides}>
          <Footer
            template={template}
            editable={editable}
            onFieldChange={onFieldChange as never}
          />
        </SectionFrame>
      )}
    </div>
  );
}
