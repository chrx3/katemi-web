import type { Metadata } from "next";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import { getLandingTemplateConfig } from "@/lib/pb-admin";
import { landingTemplateDefaults } from "@/lib/template-config";

export const metadata: Metadata = {
  title: "Katemi — Ingeniería y Proyectos Eléctricos",
  description:
    "Katemi es una empresa líder en ingeniería y proyectos eléctricos en Chile. Más de 12 años ejecutando proyectos en media y alta tensión para las principales empresas del sector.",
};

export default async function HomePage() {
  let template = landingTemplateDefaults;

  try {
    template = await getLandingTemplateConfig();
  } catch (error) {
    console.error("Error loading landing template config:", error);
  }

  return <LandingTemplatePreview template={template} includeChrome={false} />;
}
