import type { GlobalConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Contenido editable del sitio.
 *
 * Reemplaza los ~50 pares key/value planos que vivían en la colección
 * siteConfig de PocketBase (tpl_heroEyebrow, tpl_ctaTitle, ...), donde todo
 * era string y los listados se guardaban como JSON serializado dentro de un
 * campo de texto. Acá cada campo tiene su tipo real y queda agrupado por
 * sección del sitio.
 */
export const LandingTemplate: GlobalConfig = {
  slug: "landing-template",
  label: "Contenido del sitio",
  admin: {
    group: "Contenido",
    description:
      "Textos, colores e imágenes de las secciones públicas. Los cambios se publican al guardar.",
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  versions: { drafts: false, max: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Portada",
          description: "La primera pantalla que ve el visitante.",
          fields: [
            { name: "heroEyebrow", label: "Antetítulo", type: "text" },
            {
              type: "row",
              fields: [
                { name: "heroTitleStart", label: "Título — inicio", type: "text" },
                {
                  name: "heroTitleHighlightOne",
                  label: "Título — destacado 1",
                  type: "text",
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "heroTitleConnector",
                  label: "Título — conector",
                  type: "text",
                },
                {
                  name: "heroTitleHighlightTwo",
                  label: "Título — destacado 2",
                  type: "text",
                },
              ],
            },
            { name: "heroSubtitle", label: "Subtítulo", type: "textarea" },
            {
              type: "row",
              fields: [
                {
                  name: "heroPrimaryCtaLabel",
                  label: "Botón principal — texto",
                  type: "text",
                },
                {
                  name: "heroPrimaryCtaHref",
                  label: "Botón principal — enlace",
                  type: "text",
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "heroSecondaryCtaLabel",
                  label: "Botón secundario — texto",
                  type: "text",
                },
                {
                  name: "heroSecondaryCtaHref",
                  label: "Botón secundario — enlace",
                  type: "text",
                },
              ],
            },
            {
              name: "heroBgImage",
              label: "Imagen de fondo",
              type: "upload",
              relationTo: "media",
            },
          ],
        },
        {
          label: "Marca",
          description: "Colores base del sitio.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "primaryColor",
                  label: "Color primario",
                  type: "text",
                  admin: { description: "Hex, por ejemplo #0B1D3A" },
                },
                { name: "accentColor", label: "Color de acento", type: "text" },
                { name: "highlightColor", label: "Color de realce", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Cifras",
          fields: [
            {
              name: "statsItems",
              label: "Cifras destacadas",
              type: "array",
              admin: { initCollapsed: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", label: "Valor", type: "text", required: true },
                    { name: "suffix", label: "Sufijo", type: "text" },
                  ],
                },
                { name: "label", label: "Etiqueta", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Servicios",
          fields: [
            { name: "servicesEyebrow", label: "Antetítulo", type: "text" },
            { name: "servicesTitle", label: "Título", type: "text" },
            { name: "servicesSubtitle", label: "Subtítulo", type: "textarea" },
            { name: "servicesDescription", label: "Descripción", type: "textarea" },
            { name: "servicesLinkLabel", label: "Texto del enlace", type: "text" },
            {
              // Antes la home guardaba una copia congelada de los servicios en
              // JSON, así que editar un servicio no cambiaba la portada. Ahora
              // apunta a la colección real: una sola fuente de verdad.
              name: "servicesItems",
              label: "Servicios a mostrar",
              type: "relationship",
              relationTo: "services",
              hasMany: true,
              admin: {
                description:
                  "Se muestran en este orden. Si lo dejas vacío se usan los primeros servicios activos.",
              },
            },
          ],
        },
        {
          label: "Proyectos",
          fields: [
            { name: "featuredProjectsEyebrow", label: "Antetítulo", type: "text" },
            { name: "featuredProjectsTitle", label: "Título", type: "text" },
            {
              name: "featuredProjectsSubtitle",
              label: "Subtítulo",
              type: "textarea",
            },
            {
              name: "featuredProjectsLinkLabel",
              label: "Texto del enlace",
              type: "text",
            },
          ],
        },
        {
          label: "Clientes",
          fields: [
            { name: "clientsEyebrow", label: "Antetítulo", type: "text" },
            { name: "clientsTitle", label: "Título", type: "text" },
          ],
        },
        {
          label: "Llamado final",
          fields: [
            { name: "ctaTitle", label: "Título", type: "text" },
            { name: "ctaSubtitle", label: "Subtítulo", type: "textarea" },
            {
              type: "row",
              fields: [
                { name: "ctaPrimaryLabel", label: "Botón principal — texto", type: "text" },
                { name: "ctaPrimaryHref", label: "Botón principal — enlace", type: "text" },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "ctaSecondaryLabel",
                  label: "Botón secundario — texto",
                  type: "text",
                },
                {
                  name: "ctaSecondaryHref",
                  label: "Botón secundario — enlace",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          label: "Contacto",
          fields: [
            { name: "contactInfoTitle", label: "Título", type: "text" },
            {
              name: "contactInfoDescription",
              label: "Descripción",
              type: "textarea",
            },
            {
              type: "row",
              fields: [
                { name: "contactPhone", label: "Teléfono", type: "text" },
                { name: "contactEmail", label: "Correo", type: "text" },
              ],
            },
            { name: "contactAddress", label: "Dirección", type: "text" },
            { name: "contactCity", label: "Ciudad / comuna", type: "text" },
            { name: "contactHours", label: "Horario", type: "text" },
          ],
        },
        {
          label: "Nosotros",
          fields: [
            { name: "aboutEyebrow", label: "Antetítulo", type: "text" },
            { name: "aboutTitle", label: "Título", type: "text" },
            { name: "aboutHistoryPart1", label: "Historia — párrafo 1", type: "textarea" },
            { name: "aboutHistoryPart2", label: "Historia — párrafo 2", type: "textarea" },
            { name: "aboutHistoryPart3", label: "Historia — párrafo 3", type: "textarea" },
            {
              name: "aboutHistoryImage",
              label: "Imagen",
              type: "upload",
              relationTo: "media",
            },
            { name: "aboutMission", label: "Misión", type: "textarea" },
            { name: "aboutVision", label: "Visión", type: "textarea" },
            {
              name: "aboutValuesList",
              label: "Valores",
              type: "array",
              admin: {
                description: "Antes era un textarea con un valor por línea.",
                initCollapsed: true,
              },
              fields: [
                { name: "text", label: "Valor", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Redes",
          fields: [
            { name: "linkedinUrl", label: "LinkedIn", type: "text" },
            { name: "instagramUrl", label: "Instagram", type: "text" },
            { name: "facebookUrl", label: "Facebook", type: "text" },
            {
              name: "whatsapp",
              label: "WhatsApp",
              type: "text",
              admin: { description: "Solo números, con código de país. Ej: 56912345678" },
            },
            { name: "googleMapsUrl", label: "Google Maps", type: "text" },
          ],
        },
        {
          label: "Empresa y SEO",
          description: "Identidad de la empresa y metadatos para buscadores.",
          fields: [
            { name: "companyName", label: "Razón social", type: "text" },
            { name: "companyTagline", label: "Bajada", type: "text" },
            {
              name: "defaultMetaTitle",
              label: "Título por defecto",
              type: "text",
              admin: { description: "El que aparece en la pestaña del navegador y en Google." },
            },
            {
              name: "defaultMetaDescription",
              label: "Descripción por defecto",
              type: "textarea",
              maxLength: 160,
              admin: { description: "Lo que Google muestra bajo el título. Máximo 160 caracteres." },
            },
          ],
        },
      ],
    },
  ],
};
