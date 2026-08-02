import type { CollectionConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Mensajes del formulario público de contacto.
 *
 * create es público (lo envía cualquier visitante) pero read no: son datos
 * personales de terceros. Esa era exactamente la regla que tenía la colección
 * en PocketBase y se mantiene.
 */
export const Contacts: CollectionConfig = {
  slug: "contacts",
  labels: { singular: "Mensaje", plural: "Mensajes" },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "firstName", "lastName", "email", "status", "createdAt"],
    group: "Contacto",
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        { name: "firstName", label: "Nombre", type: "text", required: true },
        { name: "lastName", label: "Apellido", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", label: "Correo", type: "email", required: true },
        { name: "phone", label: "Teléfono", type: "text", required: true },
      ],
    },
    {
      name: "company",
      label: "Empresa",
      type: "text",
    },
    {
      name: "subject",
      label: "Asunto",
      type: "text",
      required: true,
    },
    {
      name: "message",
      label: "Mensaje",
      type: "textarea",
      required: true,
      maxLength: 1000,
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "Nuevo", value: "new" },
        { label: "Leído", value: "read" },
        { label: "Respondido", value: "replied" },
        { label: "Archivado", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
