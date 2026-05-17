"use client";

import { useEffect, useState } from "react";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import {
  landingTemplateDefaults,
  type LandingTemplateConfig,
} from "@/lib/template-config";

type PreviewView = "/" | "/contacto" | "/nosotros" | "/servicios" | "/proyectos";

const PREVIEW_MESSAGE_TYPE = "TEMPLATE_PREVIEW_STATE";

export default function PublicTemplatePreviewPage() {
  const [template, setTemplate] = useState<LandingTemplateConfig>(
    landingTemplateDefaults,
  );
  const [view, setView] = useState<PreviewView>("/");

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== PREVIEW_MESSAGE_TYPE) return;
      const payload = event.data?.payload;
      if (!payload) return;

      if (payload.template) {
        setTemplate(payload.template as LandingTemplateConfig);
      }

      if (
        payload.view === "/" ||
        payload.view === "/contacto" ||
        payload.view === "/nosotros" ||
        payload.view === "/servicios" ||
        payload.view === "/proyectos"
      ) {
        setView(payload.view as PreviewView);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <LandingTemplatePreview
      template={template}
      includeChrome
      editable={false}
      showGuides={false}
      view={view}
    />
  );
}
