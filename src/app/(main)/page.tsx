import type { Metadata } from "next";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import { getLandingTemplate } from "@/lib/content";
import { landingTemplateDefaults } from "@/lib/template-config";
import { seoDefaults } from "@/lib/company-content";

export const metadata: Metadata = {
  title: seoDefaults.title,
  description: seoDefaults.description,
};

export const revalidate = 60;

export default async function HomePage() {
  let template = landingTemplateDefaults;

  try {
    template = await getLandingTemplate();
  } catch (error) {
    console.error("Error loading landing template config:", error);
  }

  return <LandingTemplatePreview template={template} includeChrome={false} />;
}
