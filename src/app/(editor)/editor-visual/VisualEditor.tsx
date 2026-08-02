"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChevronLeft,
  ExternalLink,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import type { ClientItem } from "@/components/sections/ClientsMarquee";
import type { FeaturedProjectItem } from "@/components/sections/FeaturedProjects";
import {
  type LandingServiceItem,
  type LandingStat,
  type LandingTemplateConfig,
} from "@/lib/template-config";
import { saveVisualTemplate } from "./actions";

type EditableScalarKey = Exclude<
  keyof LandingTemplateConfig,
  "statsItems" | "servicesItems"
>;

type PreviewView = "/" | "/contacto" | "/nosotros" | "/servicios" | "/proyectos";

const VIEWS: { label: string; value: PreviewView }[] = [
  { label: "Portada", value: "/" },
  { label: "Nosotros", value: "/nosotros" },
  { label: "Servicios", value: "/servicios" },
  { label: "Proyectos", value: "/proyectos" },
  { label: "Contacto", value: "/contacto" },
];

function cloneConfig(config: LandingTemplateConfig): LandingTemplateConfig {
  return {
    ...config,
    statsItems: config.statsItems.map((s) => ({ ...s })),
    servicesItems: config.servicesItems.map((s) => ({ ...s })),
  };
}

export default function VisualEditor({
  initialConfig,
  serviceIdBySlug,
  featuredProjects,
  clients,
}: {
  initialConfig: LandingTemplateConfig;
  /** Permite escribir de vuelta en el documento del servicio, no en una copia. */
  serviceIdBySlug: Record<string, string>;
  featuredProjects: FeaturedProjectItem[];
  clients: ClientItem[];
}) {
  const [config, setConfig] = useState(() => cloneConfig(initialConfig));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [view, setView] = useState<PreviewView>("/");
  const [showGuides, setShowGuides] = useState(true);

  const pristine = useRef(cloneConfig(initialConfig));

  const markDirty = useCallback(() => setDirty(true), []);

  const updateField = useCallback(
    (key: EditableScalarKey, value: string) => {
      markDirty();
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [markDirty],
  );

  const updateStat = useCallback(
    (index: number, patch: Partial<LandingStat>) => {
      markDirty();
      setConfig((prev) => ({
        ...prev,
        statsItems: prev.statsItems.map((s, i) =>
          i === index ? { ...s, ...patch } : s,
        ),
      }));
    },
    [markDirty],
  );

  const addStat = useCallback(() => {
    markDirty();
    setConfig((prev) => ({
      ...prev,
      statsItems: [
        ...prev.statsItems,
        { value: "0", label: "Nueva cifra", suffix: "" },
      ],
    }));
  }, [markDirty]);

  const removeStat = useCallback(
    (index: number) => {
      markDirty();
      setConfig((prev) => ({
        ...prev,
        statsItems: prev.statsItems.filter((_, i) => i !== index),
      }));
    },
    [markDirty],
  );

  const updateServiceItem = useCallback(
    (index: number, field: keyof LandingServiceItem, value: string) => {
      markDirty();
      setConfig((prev) => ({
        ...prev,
        servicesItems: prev.servicesItems.map((s, i) =>
          i === index ? { ...s, [field]: value } : s,
        ),
      }));
    },
    [markDirty],
  );

  /**
   * Solo los servicios cuyo texto cambió respecto a lo cargado.
   *
   * Se calcula al guardar y no en un memo: compararía contra un ref durante el
   * render, y un ref que cambia no vuelve a renderizar, así que el resultado
   * podría quedar desfasado.
   */
  const collectServiceEdits = () =>
    config.servicesItems
      .map((item) => {
        const id = serviceIdBySlug[item.slug];
        if (!id) return null;
        const original = pristine.current.servicesItems.find(
          (s) => s.slug === item.slug,
        );
        const changed =
          !original ||
          original.title !== item.title ||
          original.shortDescription !== item.shortDescription ||
          original.icon !== item.icon;
        if (!changed) return null;
        return {
          id,
          title: item.title,
          shortDescription: item.shortDescription,
          icon: item.icon,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveVisualTemplate(config, collectServiceEdits());
      if (result.ok) {
        pristine.current = cloneConfig(config);
        setDirty(false);
        toast.success("Cambios publicados", {
          description:
            result.services > 0
              ? `Ya están en el sitio. También se actualizaron ${result.services} servicio(s).`
              : "Ya están visibles en el sitio.",
        });
      } else {
        toast.error(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(cloneConfig(pristine.current));
    setDirty(false);
    toast.message("Se descartaron los cambios sin guardar");
  };

  return (
    <div className="min-h-screen">
      {/* Mismo tablero azul que la barra lateral del panel: un solo producto. */}
      <header className="sticky top-0 z-50 bg-[#0B1D3A] text-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Enlace duro a propósito: el panel vive en otro layout raíz, así
                que Next haría una navegación completa igual, y con Link se
                precargaría una página que casi nunca se visita desde aquí. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/admin"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={16} />
              Panel
            </a>
            <span className="h-5 w-px bg-white/15" />
            <span className="text-sm font-bold tracking-tight">Editar el sitio</span>
          </div>

          {/* Control segmentado: una sola pieza, no cinco botones sueltos. */}
          <div
            role="tablist"
            aria-label="Página a editar"
            className="flex items-center rounded-lg bg-white/10 p-0.5"
          >
            {VIEWS.map((v) => (
              <button
                key={v.value}
                type="button"
                role="tab"
                aria-selected={view === v.value}
                onClick={() => setView(v.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  view === v.value
                    ? "bg-white text-[#0B1D3A]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowGuides((g) => !g)}
              aria-pressed={showGuides}
              title="Marca qué secciones se pueden editar"
              className="rounded-md px-2.5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Guías
            </button>
            <button
              type="button"
              onClick={() => setMobileView((v) => !v)}
              aria-pressed={mobileView}
              title={mobileView ? "Ver en escritorio" : "Ver en móvil"}
              className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {mobileView ? <Monitor size={17} /> : <Smartphone size={17} />}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir el sitio publicado"
              className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={17} />
            </a>

            <span className="mx-1 h-5 w-px bg-white/15" />

            <button
              type="button"
              onClick={handleReset}
              disabled={!dirty}
              className="rounded-md px-2.5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <RotateCcw size={15} className="mr-1.5 inline" />
              Descartar
            </button>
            {/* La única acción llena de la barra. El estado sin guardar se
                comunica aquí y no en una etiqueta aparte. */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-md bg-[#00796B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00655A] disabled:bg-white/10 disabled:text-white/40"
            >
              <Save size={15} />
              {saving
                ? "Publicando…"
                : dirty
                  ? "Publicar cambios"
                  : "Todo publicado"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] p-4">
        <div
          className={
            mobileView
              ? "mx-auto w-[390px] overflow-hidden rounded-[2rem] border-8 border-[#0B1D3A] shadow-2xl"
              : "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          }
        >
          <LandingTemplatePreview
            template={config}
            featuredProjects={featuredProjects}
            clients={clients}
            includeChrome
            editable
            showGuides={showGuides}
            view={view}
            onNavigate={(href) => setView(href as PreviewView)}
            onFieldChange={updateField}
            onServiceChange={updateServiceItem}
            onStatChange={updateStat}
            onAddStat={addStat}
            onRemoveStat={removeStat}
          />
        </div>
      </div>
    </div>
  );
}
