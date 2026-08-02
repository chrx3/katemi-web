import { BadgeCheck } from "lucide-react";
import type { LandingTemplateConfig } from "@/lib/template-config";

type LeadContent = Pick<
  LandingTemplateConfig,
  | "leadName"
  | "leadRole"
  | "leadTitle"
  | "leadCertification"
  | "leadExperience"
>;

/**
 * Dirección técnica y certificación.
 *
 * La carta de presentación de la empresa declara que su representante legal es
 * Ingeniero Eléctrico en Automatización con certificación SEC Clase A. Para un
 * contratista eléctrico en Chile esa credencial es lo que habilita a firmar
 * proyectos y declaraciones T1, y es lo primero que verifica un cliente
 * corporativo — pero no aparecía en ninguna parte del sitio.
 *
 * Si no hay datos cargados la sección no se muestra: mejor ausente que a medias.
 */
export default function TechnicalLead({ content }: { content: LeadContent }) {
  if (!content.leadName && !content.leadCertification) return null;

  const credentials = [content.leadTitle, content.leadExperience].filter(Boolean);

  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="container-max">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {content.leadCertification && (
            <div className="flex items-center gap-3 rounded-xl bg-[#00796B] px-5 py-3.5 text-white">
              <BadgeCheck className="size-6 shrink-0" aria-hidden="true" />
              <div className="leading-tight">
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-white/80">
                  Certificación
                </p>
                <p className="text-base font-bold">{content.leadCertification}</p>
              </div>
            </div>
          )}

          {content.leadName && (
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#00796B]">
                Dirección técnica
              </p>
              <p className="mt-1 text-lg font-bold text-[#0B1D3A]">
                {content.leadName}
                {content.leadRole && (
                  <span className="font-medium text-gray-500">
                    {" "}
                    · {content.leadRole}
                  </span>
                )}
              </p>
              {credentials.length > 0 && (
                <p className="mt-0.5 text-sm text-gray-600">
                  {credentials.join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
