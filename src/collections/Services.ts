import type { CollectionConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Servicio", plural: "Servicios" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "order", "isActive"],
    group: "Contenido",
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "Identificador en la URL: /servicios/mi-servicio",
      },
    },
    {
      name: "shortDescription",
      label: "Descripción corta",
      type: "textarea",
      required: true,
      admin: { description: "La que se ve en las tarjetas del listado." },
    },
    {
      name: "fullDescription",
      label: "Descripción completa",
      type: "textarea",
      required: true,
    },
    {
      name: "features",
      label: "Características",
      type: "array",
      fields: [{ name: "text", label: "Texto", type: "text", required: true }],
    },
    {
      name: "image",
      label: "Imagen",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "icon",
      label: "Icono",
      type: "text",
      defaultValue: "Settings",
      admin: {
        description: "Nombre del icono de lucide-react, por ejemplo: Zap, Wrench, Building2.",
      },
    },
    {
      name: "unitPrice",
      label: "Precio referencial",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Opcional. No se muestra en el sitio público.",
      },
    },
    {
      name: "order",
      label: "Orden",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "isActive",
      label: "Visible en el sitio",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Si lo desmarcas deja de aparecer en la web, sin borrarlo.",
        components: { Cell: "/components/admin/PublishedCell#PublishedCell" },
      },
    },
  ],
};
