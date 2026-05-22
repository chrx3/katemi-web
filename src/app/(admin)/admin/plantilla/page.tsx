"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pocketbase";
import {
  Monitor,
  Smartphone,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import Header from "@/components/admin/Header";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  landingTemplateDefaults,
  type LandingTemplateConfig,
  type LandingStat,
  type LandingServiceItem,
} from "@/lib/template-config";
import {
  getLandingTemplateConfig,
  saveLandingTemplateConfig,
} from "@/lib/pb-admin";

type EditableScalarKey = Exclude<
  keyof LandingTemplateConfig,
  "statsItems" | "servicesItems"
>;

type PreviewView = "/" | "/contacto" | "/nosotros" | "/servicios" | "/proyectos";

const VALID_CTA_ROUTES = ["/contacto", "/proyectos", "/servicios", "/", "/nosotros"];

function deepCloneTemplate(config: LandingTemplateConfig): LandingTemplateConfig {
  return {
    ...config,
    statsItems: config.statsItems.map((s) => ({ ...s })),
    servicesItems: config.servicesItems.map((s) => ({ ...s })),
  };
}

export default function PlantillaEditorPage() {
  const [config, setConfig] = useState<LandingTemplateConfig>(landingTemplateDefaults);
  const [initialConfig, setInitialConfig] = useState<LandingTemplateConfig>(landingTemplateDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [previewView, setPreviewView] = useState<PreviewView>("/");
  const [activeTab, setActiveTab] = useState<"visual" | "config">("visual");
  const mobilePreviewRef = useRef<HTMLIFrameElement | null>(null);

  const changedKeys = useRef<Set<string>>(new Set());

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
    win.postMessage({ type: "TEMPLATE_PREVIEW_STATE", payload: { template: config, view: previewView } }, "*");
  };

  useEffect(() => { postMobilePreviewState(); }, [config, previewView, mobileView]);

  const markChanged = useCallback((key: string) => {
    changedKeys.current.add(key);
  }, []);

  const hasChanges = changedKeys.current.size > 0;

  const updateField = (key: EditableScalarKey, value: string) => {
    markChanged(key);
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateStat = (index: number, patch: Partial<LandingStat>) => {
    markChanged("statsItems");
    setConfig((prev) => ({
      ...prev,
      statsItems: prev.statsItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addStat = () => {
    markChanged("statsItems");
    setConfig((prev) => ({
      ...prev,
      statsItems: [...prev.statsItems, { value: "0", label: "Nueva métrica", suffix: "" }],
    }));
  };

  const removeStat = (index: number) => {
    markChanged("statsItems");
    setConfig((prev) => ({
      ...prev,
      statsItems: prev.statsItems.filter((_, i) => i !== index),
    }));
  };

  const updateServiceItem = (index: number, patch: Partial<LandingServiceItem>) => {
    markChanged("servicesItems");
    setConfig((prev) => ({
      ...prev,
      servicesItems: prev.servicesItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addService = () => {
    markChanged("servicesItems");
    const newService: LandingServiceItem = {
      slug: `servicio-${Date.now()}`,
      title: "Nuevo Servicio",
      shortDescription: "Descripción del servicio",
      icon: "Box",
      imageUrl: "",
    };
    setConfig((prev) => ({ ...prev, servicesItems: [...prev.servicesItems, newService] }));
  };

  const removeService = (index: number) => {
    markChanged("servicesItems");
    setConfig((prev) => ({
      ...prev,
      servicesItems: prev.servicesItems.filter((_, i) => i !== index),
    }));
  };

  const validateHrefs = (): boolean => {
    const hrefs = [config.heroPrimaryCtaHref, config.heroSecondaryCtaHref, config.ctaPrimaryHref, config.ctaSecondaryHref];
    for (const href of hrefs) {
      if (href && !href.startsWith("/") && !href.startsWith("http")) {
        toast.error(`La ruta "${href}" no es válida. Debe empezar con / o http`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateHrefs()) return;
    setSaving(true);
    try {
      const result = await saveLandingTemplateConfig(config);
      setInitialConfig(deepCloneTemplate(config));
      changedKeys.current.clear();
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
    changedKeys.current.clear();
    toast.message("Se cargaron los valores por defecto (falta guardar para publicar)");
  };

  return (
    <div className="max-w-[1500px] mx-auto">
      <Header title="Editor de plantilla" />

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === "visual" ? "bg-[#00A896] text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Editor visual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("config")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === "config" ? "bg-[#00A896] text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Configuración
          </button>
        </div>
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
            <RotateCcw size={15} className="mr-2" />Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#00A896] text-white hover:bg-[#008f7a]">
            <Save size={15} className="mr-2" />{saving ? "Guardando..." : "Guardar"}
          </Button>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1D3A] text-white text-sm hover:bg-[#122645]">
            <ExternalLink size={15} />Abrir sitio
          </Link>
        </div>
      </div>

      {hasChanges && (
        <p className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Tienes cambios sin guardar.
        </p>
      )}

      {activeTab === "config" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 space-y-4">
          <h3 className="font-semibold text-[#0B1D3A]">Configuración global</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Color principal</label>
              <div className="flex items-center gap-2">
                <input type="color" value={config.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={config.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Color acento</label>
              <div className="flex items-center gap-2">
                <input type="color" value={config.accentColor} onChange={(e) => updateField("accentColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={config.accentColor} onChange={(e) => updateField("accentColor", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Color resalte</label>
              <div className="flex items-center gap-2">
                <input type="color" value={config.highlightColor} onChange={(e) => updateField("highlightColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={config.highlightColor} onChange={(e) => updateField("highlightColor", e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Imagen de fondo del Hero (URL)</label>
            <Input value={config.heroBgImage} onChange={(e) => updateField("heroBgImage", e.target.value)} placeholder="https://..." />
          </div>

          <h3 className="font-semibold text-[#0B1D3A] pt-2">Métricas ({config.statsItems.length})</h3>
          <div className="space-y-2">
            {config.statsItems.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <Input value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="Valor" className="w-20 text-center" />
                <Input value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="Label" className="flex-1" />
                <Input value={stat.suffix} onChange={(e) => updateStat(i, { suffix: e.target.value })} placeholder="Sufijo" className="w-16" />
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addStat}><Plus size={14} className="mr-1" /> Agregar métrica</Button>
          </div>

          <h3 className="font-semibold text-[#0B1D3A] pt-2">Servicios ({config.servicesItems.length})</h3>
          <div className="space-y-2">
            {config.servicesItems.map((svc, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <Input value={svc.title} onChange={(e) => updateServiceItem(i, { title: e.target.value })} placeholder="Título" className="flex-1" />
                <Input value={svc.slug} onChange={(e) => updateServiceItem(i, { slug: e.target.value.replace(/\s+/g, "-").toLowerCase() })} placeholder="slug" className="w-32" />
                <Input value={svc.icon} onChange={(e) => updateServiceItem(i, { icon: e.target.value })} placeholder="Icono" className="w-24" />
                <button onClick={() => removeService(i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addService}><Plus size={14} className="mr-1" /> Agregar servicio</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0B1D3A]">Vista previa real de la landing</p>
          <span className="text-xs text-gray-500">Incluye header, secciones y footer</span>
        </div>

        <div className="bg-slate-200 rounded-xl p-3 min-h-[760px] overflow-auto">
          {mobileView ? (
            <div className="mx-auto max-w-[390px] rounded-lg overflow-hidden shadow-lg bg-white">
              <iframe ref={mobilePreviewRef} src="/preview/plantilla" title="Vista previa móvil real" onLoad={postMobilePreviewState} className="w-full h-[760px] border-0" />
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
                  const valid = ["/", "/contacto", "/nosotros", "/servicios", "/proyectos"];
                  if (valid.includes(href)) setPreviewView(href as PreviewView);
                }}
                onFieldChange={(key, value) => updateField(key as EditableScalarKey, value)}
                onServiceChange={(index, field, value) => {
                  updateServiceItem(index, { [field]: value });
                }}
                onStatChange={(index, patch) => updateStat(index, patch)}
                onAddStat={addStat}
                onRemoveStat={removeStat}
                onAddService={addService}
                onRemoveService={removeService}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
