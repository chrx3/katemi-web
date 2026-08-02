import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import VisualEditor from "./VisualEditor";
import { getPayloadClient } from "@/lib/payload-client";
import {
  getClientItems,
  getFeaturedProjectItems,
  getLandingTemplate,
  getServices,
} from "@/lib/content";

// El editor siempre trabaja contra el estado actual del contenido.
export const dynamic = "force-dynamic";

export default async function EditorVisualPage() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await nextHeaders() });

  if (!user) {
    redirect("/admin/login?redirect=%2Feditor-visual");
  }

  const [template, services, featuredProjects, clients] = await Promise.all([
    getLandingTemplate(),
    getServices(),
    getFeaturedProjectItems(),
    getClientItems(),
  ]);

  // Los servicios de la portada son documentos reales; el editor necesita su
  // id para escribir de vuelta en ellos en vez de en una copia del global.
  const serviceIdBySlug = Object.fromEntries(
    services.map((service) => [service.slug, String(service.id)]),
  );

  return (
    <VisualEditor
      initialConfig={template}
      serviceIdBySlug={serviceIdBySlug}
      featuredProjects={featuredProjects}
      clients={clients}
    />
  );
}
