"use server";

import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayloadClient } from "@/lib/payload-client";
import type { LandingTemplateConfig } from "@/lib/template-config";

/**
 * Guardado del editor visual.
 *
 * Es una Server Action, o sea un endpoint público: verifica la sesión de
 * Payload antes de escribir nada. La validación del navegador no cuenta.
 */
async function requirePayloadUser() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) throw new Error("No autorizado");
  return payload;
}

type ServiceEdit = {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
};

export type SaveResult =
  | { ok: true; services: number }
  | { ok: false; error: string };

/** Campos del global que el editor visual puede tocar. */
const EDITABLE_KEYS = [
  "heroEyebrow", "heroTitleStart", "heroTitleHighlightOne", "heroTitleConnector",
  "heroTitleHighlightTwo", "heroSubtitle", "heroPrimaryCtaLabel", "heroPrimaryCtaHref",
  "heroSecondaryCtaLabel", "heroSecondaryCtaHref",
  "primaryColor", "accentColor", "highlightColor",
  "servicesEyebrow", "servicesTitle", "servicesSubtitle", "servicesDescription",
  "servicesLinkLabel",
  "featuredProjectsEyebrow", "featuredProjectsTitle", "featuredProjectsSubtitle",
  "featuredProjectsLinkLabel",
  "clientsEyebrow", "clientsTitle",
  "ctaTitle", "ctaSubtitle", "ctaPrimaryLabel", "ctaPrimaryHref",
  "ctaSecondaryLabel", "ctaSecondaryHref",
  "contactInfoTitle", "contactInfoDescription", "contactPhone", "contactEmail",
  "contactAddress", "contactHours",
  "aboutEyebrow", "aboutTitle", "aboutHistoryPart1", "aboutHistoryPart2",
  "aboutHistoryPart3", "aboutMission", "aboutVision",
  "linkedinUrl", "instagramUrl", "googleMapsUrl",
] as const satisfies readonly (keyof LandingTemplateConfig)[];

function isValidHref(value: string) {
  return !value || value.startsWith("/") || value.startsWith("http");
}

export async function saveVisualTemplate(
  config: LandingTemplateConfig,
  serviceEdits: ServiceEdit[],
): Promise<SaveResult> {
  let payload;
  try {
    payload = await requirePayloadUser();
  } catch {
    return { ok: false, error: "Tu sesión expiró. Vuelve a entrar al panel." };
  }

  const badHref = [
    config.heroPrimaryCtaHref,
    config.heroSecondaryCtaHref,
    config.ctaPrimaryHref,
    config.ctaSecondaryHref,
  ].find((href) => !isValidHref(href));

  if (badHref) {
    return { ok: false, error: `La ruta "${badHref}" debe empezar con / o http` };
  }

  try {
    const data: Record<string, unknown> = {};
    for (const key of EDITABLE_KEYS) data[key] = config[key];

    data.statsItems = config.statsItems.map((s) => ({
      value: s.value,
      label: s.label,
      suffix: s.suffix,
    }));

    data.aboutValuesList = config.aboutValuesList
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((text) => ({ text }));

    await payload.updateGlobal({ slug: "landing-template", data: data as never });

    // Los servicios de la portada ahora son documentos reales, no una copia
    // dentro del global: editar una tarjeta actualiza el servicio en sí.
    for (const edit of serviceEdits) {
      await payload.update({
        collection: "services",
        id: edit.id,
        data: {
          title: edit.title,
          shortDescription: edit.shortDescription,
          icon: edit.icon,
        },
      });
    }

    // El sitio público se sirve estático con revalidate de 60s; esto publica
    // los cambios de inmediato en vez de esperar a que expire.
    for (const path of ["/", "/servicios", "/proyectos", "/nosotros", "/contacto"]) {
      revalidatePath(path);
    }

    return { ok: true, services: serviceEdits.length };
  } catch (error) {
    console.error("Error guardando el editor visual:", error);
    return { ok: false, error: "No se pudo guardar. Intenta nuevamente." };
  }
}
