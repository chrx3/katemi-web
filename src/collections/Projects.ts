import type { CollectionConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Proyecto", plural: "Proyectos" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "clientName", "category", "year", "isActive"],
    group: "Contenido",
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "-year",
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
    },
    {
      name: "clientName",
      label: "Cliente",
      type: "text",
      required: true,
    },
    {
      name: "location",
      label: "Ubicación",
      type: "text",
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      // Antes era un array de slugs sueltos en un campo JSON, sin garantía de
      // que apuntaran a servicios existentes. Como relación, PocketBase ya no
      // puede quedar con referencias rotas.
      name: "servicesProvided",
      label: "Servicios prestados",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    {
      name: "images",
      label: "Imágenes",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "category",
      label: "Categoría",
      type: "select",
      options: [
        { label: "Retail", value: "retail" },
        { label: "Comercial", value: "commercial" },
        { label: "Industrial", value: "industrial" },
        { label: "Servicios", value: "services" },
      ],
    },
    {
      name: "year",
      label: "Año",
      type: "number",
    },
    {
      name: "isFeatured",
      label: "Destacado en la home",
      type: "checkbox",
      defaultValue: false,
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
