import type { Metadata } from "next";
import LandingTemplatePreview from "@/components/template/LandingTemplatePreview";
import {
  getClientItems,
  getFeaturedProjectItems,
  getLandingTemplate,
} from "@/lib/content";
import { landingTemplateDefaults } from "@/lib/template-config";
import { seoDefaults } from "@/lib/company-content";

export const metadata: Metadata = {
  title: seoDefaults.title,
  description: seoDefaults.description,
  alternates: { canonical: '/' },
};

export const revalidate = 60;

export default async function HomePage() {
  let template = landingTemplateDefaults;
  let featuredProjects: Awaited<ReturnType<typeof getFeaturedProjectItems>> = [];
  let clients: Awaited<ReturnType<typeof getClientItems>> = [];

  // Las tres lecturas van en paralelo; si alguna falla el resto igual renderiza
  // y la sección afectada cae a su contenido de respaldo.
  const [templateResult, projectsResult, clientsResult] = await Promise.allSettled([
    getLandingTemplate(),
    getFeaturedProjectItems(),
    getClientItems(),
  ]);

  if (templateResult.status === "fulfilled") template = templateResult.value;
  else console.error("Error cargando el contenido del sitio:", templateResult.reason);

  if (projectsResult.status === "fulfilled") featuredProjects = projectsResult.value;
  else console.error("Error cargando proyectos destacados:", projectsResult.reason);

  if (clientsResult.status === "fulfilled") clients = clientsResult.value;
  else console.error("Error cargando clientes:", clientsResult.reason);

  return (
    <LandingTemplatePreview
      template={template}
      featuredProjects={featuredProjects}
      clients={clients}
      includeChrome={false}
    />
  );
}
