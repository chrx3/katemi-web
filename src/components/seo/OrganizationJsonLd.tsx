import { JsonLd } from "./JsonLd";
import { absoluteUrl, SITE_URL, toE164 } from "@/lib/seo";
import type { LandingTemplateConfig } from "@/lib/template-config";

/**
 * Ficha de la empresa para buscadores.
 *
 * LocalBusiness y no Organization: KATEMI atiende una zona geográfica concreta,
 * y es el tipo que Google usa para el paquete local de resultados —el mapa que
 * aparece al buscar un servicio junto a una comuna.
 *
 * Los datos salen del contenido editable, no de constantes, para que cambiar el
 * teléfono en el panel también actualice lo que ve Google.
 */
export function OrganizationJsonLd({
  template,
}: {
  template: LandingTemplateConfig;
}) {
  const sameAs = [
    template.linkedinUrl,
    template.instagramUrl,
    template.facebookUrl,
  ].filter((url) => typeof url === "string" && url.startsWith("http"));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organizacion`,
    name: template.companyName || "KATEMI E.I.R.L.",
    alternateName: "KATEMI",
    url: SITE_URL,
    logo: absoluteUrl("/brand/katemi-wordmark.png"),
    description: template.defaultMetaDescription || template.heroSubtitle,
    slogan: template.companyTagline,
    areaServed: { "@type": "Country", name: "Chile" },
    knowsAbout: (template.servicesItems ?? []).map((s) => s.title),
  };

  if (template.contactPhone) {
    data.telephone = toE164(template.contactPhone);
    data.contactPoint = [
      {
        "@type": "ContactPoint",
        telephone: toE164(template.contactPhone),
        contactType: "sales",
        areaServed: "CL",
        availableLanguage: ["es"],
      },
    ];
  }

  if (template.contactEmail) data.email = template.contactEmail;
  if (sameAs.length > 0) data.sameAs = sameAs;

  if (template.contactAddress) {
    const [street, ...rest] = template.contactAddress.split("\n");
    data.address = {
      "@type": "PostalAddress",
      streetAddress: street.trim(),
      addressLocality: (template.contactCity || rest.join(", ")).trim(),
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    };
  }

  /**
   * La certificación del representante legal.
   *
   * Para un contratista eléctrico en Chile la Clase A de la SEC es la
   * credencial que habilita a firmar proyectos y declaraciones T1. Declararla
   * en los datos estructurados la hace legible para los buscadores, no solo
   * para quien lee la página.
   */
  if (template.leadName) {
    const person: Record<string, unknown> = {
      "@type": "Person",
      name: template.leadName,
      jobTitle: template.leadRole || undefined,
    };

    if (template.leadCertification) {
      person.hasCredential = {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: template.leadCertification,
        recognizedBy: {
          "@type": "Organization",
          name: "Superintendencia de Electricidad y Combustibles",
          alternateName: "SEC",
        },
      };
    }

    data.employee = person;
    data.founder = { "@type": "Person", name: template.leadName };
  }

  return <JsonLd data={data} />;
}

export default OrganizationJsonLd;
