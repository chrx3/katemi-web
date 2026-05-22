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
import { Plus, Trash2 } from "lucide-react";

type MutableTemplateKey = Exclude<
  keyof LandingTemplateConfig,
  "statsItems" | "servicesItems"
>;

type PreviewView = "/" | "/contacto" | "/nosotros" | "/servicios" | "/proyectos";

interface LandingTemplatePreviewProps {
  template: LandingTemplateConfig;
  includeChrome?: boolean;
  editable?: boolean;
  showGuides?: boolean;
  view?: PreviewView;
  onNavigate?: (href: string) => void;
  onFieldChange?: (key: MutableTemplateKey, value: string) => void;
  onServiceChange?: (index: number, field: keyof LandingTemplateConfig["servicesItems"][number], value: string) => void;
  onStatChange?: (index: number, patch: Partial<LandingStat>) => void;
  onAddStat?: () => void;
  onRemoveStat?: (index: number) => void;
  onAddService?: () => void;
  onRemoveService?: (index: number) => void;
}

function SectionFrame({ title, mode, show, children }: { title: string; mode: "editable" | "crud"; show: boolean; children: React.ReactNode }) {
  if (!show) return <>{children}</>;
  const isEditable = mode === "editable";
  return (
    <div className={`relative ${isEditable ? "ring-2 ring-[#00A896]/35 shadow-[0_0_0_4px_rgba(0,168,150,0.08)]" : "ring-2 ring-[#3b82f6]/25 ring-dashed"} rounded-xl overflow-hidden`}>
      <div className="absolute top-2 left-2 z-30 max-w-[220px]">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full truncate ${isEditable ? "bg-[#00A896] text-white" : "bg-[#3b82f6] text-white"}`}>
          {isEditable ? "Editable aquí" : "Desde CRUD"} · {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function AboutPreview({ template, editable, showGuides, onFieldChange }: { template: LandingTemplateConfig; editable: boolean; showGuides: boolean; onFieldChange?: (key: MutableTemplateKey, value: string) => void }) {
  const e = editable && onFieldChange;
  return (
    <SectionFrame title="Página Nosotros" mode="editable" show={showGuides}>
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {template.aboutHistoryImage ? (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B1D3A]">
                  <img src={template.aboutHistoryImage} alt="Equipo Katemi" className="w-full h-full object-cover opacity-90" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-[#0B1D3A]/10 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                </div>
              )}
              {e && (
                <div className="mt-2">
                  <label className="text-xs text-gray-400">URL de imagen</label>
                  <input value={template.aboutHistoryImage} onChange={(ev) => onFieldChange!("aboutHistoryImage", ev.target.value)} className="w-full border rounded px-2 py-1 text-xs" placeholder="https://..." />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
                {e ? <InlineEditableText value={template.aboutEyebrow} onChange={(v) => onFieldChange("aboutEyebrow", v)} className="text-xs font-bold uppercase tracking-widest text-[#00A896]" /> : template.aboutEyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1D3A] leading-tight">
                {e ? <InlineEditableText value={template.aboutTitle} onChange={(v) => onFieldChange("aboutTitle", v)} className="text-3xl md:text-4xl font-bold text-[#0B1D3A]" /> : template.aboutTitle}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {e ? <InlineEditableText value={template.aboutHistoryPart1} onChange={(v) => onFieldChange("aboutHistoryPart1", v)} multiline className="text-gray-600 leading-relaxed" /> : <p>{template.aboutHistoryPart1}</p>}
                {e ? <InlineEditableText value={template.aboutHistoryPart2} onChange={(v) => onFieldChange("aboutHistoryPart2", v)} multiline className="text-gray-600 leading-relaxed" /> : <p>{template.aboutHistoryPart2}</p>}
                {e ? <InlineEditableText value={template.aboutHistoryPart3} onChange={(v) => onFieldChange("aboutHistoryPart3", v)} multiline className="text-gray-600 leading-relaxed" /> : <p>{template.aboutHistoryPart3}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">Misión</h3>
              {e ? <InlineEditableText value={template.aboutMission} onChange={(v) => onFieldChange("aboutMission", v)} multiline className="text-gray-600 leading-relaxed" /> : <p className="text-gray-600 leading-relaxed">{template.aboutMission}</p>}
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">Visión</h3>
              {e ? <InlineEditableText value={template.aboutVision} onChange={(v) => onFieldChange("aboutVision", v)} multiline className="text-gray-600 leading-relaxed" /> : <p className="text-gray-600 leading-relaxed">{template.aboutVision}</p>}
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B1D3A] mb-3 uppercase tracking-tight">Valores</h3>
              {e ? <InlineEditableText value={template.aboutValuesList} onChange={(v) => onFieldChange("aboutValuesList", v)} multiline className="text-gray-600 leading-relaxed whitespace-pre-line" /> : <p className="text-gray-600 leading-relaxed whitespace-pre-line">{template.aboutValuesList}</p>}
            </div>
          </div>
        </div>
      </section>
    </SectionFrame>
  );
}

export default function LandingTemplatePreview({
  template, includeChrome = true, editable = false, showGuides = false, view = "/",
  onNavigate, onFieldChange, onServiceChange, onStatChange,
  onAddStat, onRemoveStat, onAddService, onRemoveService,
}: LandingTemplatePreviewProps) {
  return (
    <div className="min-h-screen bg-white">
      {includeChrome && <Navbar editorMode={editable} onEditorNavigate={onNavigate} previewMode={editable} />}
      <main>
        {view === "/" && (
          <>
            <SectionFrame title="Hero" mode="editable" show={showGuides}>
              <HeroSection content={template} editable={editable} onFieldChange={onFieldChange as never} />
            </SectionFrame>

            <SectionFrame title="Métricas" mode="editable" show={showGuides}>
              <StatsBar stats={template.statsItems} editable={editable} onStatChange={onStatChange} />
              {editable && onAddStat && onRemoveStat && (
                <div className="flex items-center gap-2 px-4 pb-4">
                  <button onClick={onAddStat} className="inline-flex items-center gap-1 text-xs bg-[#00A896] text-white px-3 py-1.5 rounded-lg"><Plus size={12} /> Métrica</button>
                </div>
              )}
            </SectionFrame>

            <SectionFrame title="Servicios (presentación)" mode="editable" show={showGuides}>
              <ServicesPreview content={template} editable={editable} onFieldChange={onFieldChange as never} onServiceChange={onServiceChange} />
              {editable && onAddService && onRemoveService && (
                <div className="flex items-center gap-2 px-4 pb-4">
                  <button onClick={onAddService} className="inline-flex items-center gap-1 text-xs bg-[#00A896] text-white px-3 py-1.5 rounded-lg"><Plus size={12} /> Servicio</button>
                </div>
              )}
            </SectionFrame>

            <SectionFrame title="Proyectos" mode="crud" show={showGuides}><FeaturedProjects content={template} previewMode={editable} /></SectionFrame>
            <SectionFrame title="Clientes" mode="crud" show={showGuides}><ClientsMarquee content={template} /></SectionFrame>
            <SectionFrame title="CTA final" mode="editable" show={showGuides}><CTABanner content={template} editable={editable} onFieldChange={onFieldChange as never} /></SectionFrame>
          </>
        )}

        {view === "/contacto" && (
          <SectionFrame title="Contacto" mode="editable" show={showGuides}>
            <section className="py-16 bg-white">
              <div className="container-max max-w-5xl">
                <h1 className="text-4xl font-bold text-[#0B1D3A] mb-6">Contacto</h1>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#0B1D3A]">
                      {editable && onFieldChange ? <InlineEditableText value={template.contactInfoTitle} onChange={(v) => onFieldChange("contactInfoTitle", v)} className="text-2xl font-bold text-[#0B1D3A]" /> : template.contactInfoTitle}
                    </h2>
                    <div className="text-gray-600 whitespace-pre-line">
                      {editable && onFieldChange ? <InlineEditableText value={template.contactInfoDescription} onChange={(v) => onFieldChange("contactInfoDescription", v)} multiline className="text-gray-600" /> : template.contactInfoDescription}
                    </div>
                  </div>
                  <div className="space-y-3 bg-[#F5F5F5] rounded-xl p-4">
                    {(["contactPhone", "contactEmail", "contactAddress", "contactHours"] as const).map((key) => (
                      <div key={key}>
                        <p className="text-xs uppercase text-gray-500">{key === "contactPhone" ? "Teléfono" : key === "contactEmail" ? "Correo" : key === "contactAddress" ? "Dirección" : "Horario"}</p>
                        {editable && onFieldChange ? <InlineEditableText value={template[key]} onChange={(v) => onFieldChange(key, v)} multiline={key === "contactAddress"} className="font-medium text-[#0B1D3A] whitespace-pre-line" /> : <p className="font-medium text-[#0B1D3A] whitespace-pre-line">{template[key]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </SectionFrame>
        )}

        {view === "/nosotros" && <AboutPreview template={template} editable={editable} showGuides={showGuides} onFieldChange={onFieldChange} />}
        {view === "/servicios" && (
          <SectionFrame title="Servicios (vista lista)" mode="editable" show={showGuides}>
            <section className="py-16 bg-white">
              <div className="container-max">
                <p className="text-gray-400 text-sm text-center">La vista de listado de servicios usa el CRUD de servicios. Acá solo se editan los textos de sección.</p>
                <div className="mt-4 space-y-2">
                  <InlineEditableText value={template.servicesEyebrow} onChange={(v) => onFieldChange?.("servicesEyebrow", v)} className="text-xs font-bold uppercase tracking-widest text-[#00A896]" />
                  <InlineEditableText value={template.servicesTitle} onChange={(v) => onFieldChange?.("servicesTitle", v)} className="text-2xl font-bold text-[#0B1D3A]" />
                  <InlineEditableText value={template.servicesDescription} onChange={(v) => onFieldChange?.("servicesDescription", v)} multiline className="text-gray-600" />
                </div>
              </div>
            </section>
          </SectionFrame>
        )}
        {view === "/proyectos" && (
          <SectionFrame title="Proyectos (vista lista)" mode="crud" show={showGuides}>
            <section className="py-16 bg-white">
              <div className="container-max">
                <p className="text-gray-400 text-sm text-center">La vista de listado de proyectos usa el CRUD de proyectos.</p>
                <div className="mt-4 space-y-2">
                  <InlineEditableText value={template.featuredProjectsEyebrow} onChange={(v) => onFieldChange?.("featuredProjectsEyebrow", v)} className="text-xs font-bold uppercase tracking-widest text-[#00A896]" />
                  <InlineEditableText value={template.featuredProjectsTitle} onChange={(v) => onFieldChange?.("featuredProjectsTitle", v)} className="text-2xl font-bold text-[#0B1D3A]" />
                </div>
              </div>
            </section>
          </SectionFrame>
        )}
      </main>

      {includeChrome && (
        <SectionFrame title="Footer" mode="editable" show={showGuides}>
          <Footer template={template} editable={editable} onFieldChange={onFieldChange as never} previewMode={editable} />
        </SectionFrame>
      )}
    </div>
  );
}
