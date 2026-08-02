import type { CollectionConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Cliente", plural: "Clientes" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "website", "order", "isActive"],
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
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "website",
      label: "Sitio web",
      type: "text",
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
