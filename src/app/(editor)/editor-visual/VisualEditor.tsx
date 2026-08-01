"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
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

  /** Solo los servicios cuyo texto cambió respecto a lo cargado. */
  const serviceEdits = useMemo(() => {
    return config.servicesItems
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
  }, [config.servicesItems, serviceIdBySlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveVisualTemplate(config, serviceEdits);
      if (result.ok) {
        pristine.current = cloneConfig(config);
        setDirty(false);
        toast.success(
          result.services > 0
            ? `Guardado — también se actualizaron ${result.services} servicio(s)`
            : "Cambios guardados y publicados",
        );
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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm font-semibold text-[#0B1D3A] hover:text-[#00A896]"
            >
              ← Panel
            </a>
            <span className="text-sm font-bold text-[#0B1D3A]">Editor visual</span>
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                Sin guardar
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {VIEWS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setView(v.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  view === v.value
                    ? "bg-[#00A896] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuides((g) => !g)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {showGuides ? "Ocultar guías" : "Mostrar guías"}
            </button>
            <button
              type="button"
              onClick={() => setMobileView((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {mobileView ? <Monitor size={16} /> : <Smartphone size={16} />}
              {mobileView ? "Escritorio" : "Móvil"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              <RotateCcw size={15} />
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00A896] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f7f] disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B1D3A] px-3 py-2 text-sm text-white hover:bg-[#122645]"
            >
              <ExternalLink size={15} />
              Ver sitio
            </a>
          </div>
        </div>
        <p className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
          Haz clic sobre cualquier texto de la vista para editarlo. Las imágenes
          y los servicios nuevos se gestionan desde el panel.
        </p>
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
