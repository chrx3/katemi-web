"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/admin/Header";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  landingTemplateDefaults,
  type LandingTemplateConfig,
  type LandingStat,
} from "@/lib/template-config";
import {
  getLandingTemplateConfig,
  saveLandingTemplateConfig,
} from "@/lib/pb-admin";

type EditableScalarKey = Exclude<
  keyof LandingTemplateConfig,
  "statsItems" | "servicesItems"
>;

function deepCloneTemplate(
  config: LandingTemplateConfig,
): LandingTemplateConfig {
  return {
    ...config,
    statsItems: config.statsItems.map((item) => ({ ...item })),
    servicesItems: config.servicesItems.map((item) => ({ ...item })),
  };
}

export default function PlantillaEditorPage() {
  const [config, setConfig] = useState<LandingTemplateConfig>(
    landingTemplateDefaults,
  );
  const [initialConfig, setInitialConfig] = useState<LandingTemplateConfig>(
    landingTemplateDefaults,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [previewView, setPreviewView] = useState<
    "/" | "/contacto" | "/nosotros" | "/servicios" | "/proyectos"
  >("/");
  const mobilePreviewRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLandingTemplateConfig();
        const normalized = deepCloneTemplate(data);
        setConfig(normalized);
        setInitialConfig(normalized);
      } catch (error) {
        console.error("Error loading template config:", error);
        toast.error("No se pudo cargar el editor de plantilla");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const postMobilePreviewState = () => {
    const win = mobilePreviewRef.current?.contentWindow;
    if (!win) return;

    win.postMessage(
      {
        type: "TEMPLATE_PREVIEW_STATE",
        payload: {
          template: config,
          view: previewView,
        },
      },
      "*",
    );
  };

  useEffect(() => {
    postMobilePreviewState();
  }, [config, previewView, mobileView]);

  const hasChanges = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(initialConfig),
    [config, initialConfig],
  );

  const updateField = (key: EditableScalarKey, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateService = (
    index: number,
    patch: Partial<LandingTemplateConfig["servicesItems"][number]>,
  ) => {
    setConfig((prev) => ({
      ...prev,
      servicesItems: prev.servicesItems.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const updateStat = (index: number, patch: Partial<LandingStat>) => {
    setConfig((prev) => ({
      ...prev,
      statsItems: prev.statsItems.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveLandingTemplateConfig(config);
      const snapshot = deepCloneTemplate(config);
      setInitialConfig(snapshot);
      toast.success(`Plantilla guardada (${result.changed} cambio(s))`);
    } catch (error) {
      console.error("Error saving template config:", error);
      toast.error("No se pudo guardar la plantilla");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(deepCloneTemplate(landingTemplateDefaults));
    toast.message(
      "Se cargaron los valores por defecto (falta guardar para publicar)",
    );
  };

  return (
    <div className="max-w-[1500px] mx-auto">
      <Header title="Editor de plantilla" />

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Editor visual interactivo: haz click directamente en los textos de la
          vista previa para editar.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileView((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
          >
            {mobileView ? <Monitor size={16} /> : <Smartphone size={16} />}
            {mobileView ? "Escritorio" : "Móvil"}
          </button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw size={15} className="mr-2" />
            Reset
          </Button>
          <Button
            onClick={() => {
              if (saving || loading) return;
              handleSave();
            }}
            aria-disabled={saving || loading}
            className={`bg-[#00A896] text-white ${saving || loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#008f7a]"}`}
          >
            <Save size={15} className="mr-2" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1D3A] text-white text-sm hover:bg-[#122645]"
          >
            <ExternalLink size={15} />
            Abrir sitio
          </Link>
        </div>
      </div>

      {hasChanges && (
        <p className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Tienes cambios sin guardar.
        </p>
      )}
      <p className="mb-4 text-xs text-gray-500">
        Verde = editable en este editor · Azul = depende de CRUD (se edita en
        sus módulos).
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0B1D3A]">
            Vista previa real de la landing
          </p>
          <span className="text-xs text-gray-500">
            Incluye header, secciones y footer
          </span>
        </div>

        <div className="bg-slate-200 rounded-xl p-3 min-h-[760px] overflow-auto">
          {mobileView ? (
            <div className="mx-auto max-w-[390px] rounded-lg overflow-hidden shadow-lg bg-white">
              <iframe
                ref={mobilePreviewRef}
                src="/preview/plantilla"
                title="Vista previa móvil real"
                onLoad={postMobilePreviewState}
                className="w-full h-[760px] border-0"
              />
            </div>
          ) : (
            <div className="mx-auto rounded-lg overflow-hidden shadow-lg bg-white transition-all max-w-[1200px]">
              <LandingTemplatePreview
                template={config}
                includeChrome
                editable
                showGuides
                view={previewView}
                onNavigate={(href) => {
                  if (
                    href === "/" ||
                    href === "/contacto" ||
                    href === "/nosotros" ||
                    href === "/servicios" ||
                    href === "/proyectos"
                  ) {
                    setPreviewView(href);
                  }
                }}
                onFieldChange={(key, value) =>
                  updateField(key as EditableScalarKey, value)
                }
                onServiceChange={(index, field, value) => {
                  if (
                    field === "title" ||
                    field === "shortDescription" ||
                    field === "slug" ||
                    field === "icon" ||
                    field === "imageUrl"
                  ) {
                    updateService(index, { [field]: value });
                  }
                }}
                onStatChange={(index, patch) => updateStat(index, patch)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
