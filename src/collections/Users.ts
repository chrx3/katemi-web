import type { CollectionConfig } from "payload";

/**
 * Usuarios del panel. Reemplaza el esquema anterior de una sola ADMIN_PASSWORD
 * compartida validada contra una cookie con token estático: ahora hay usuarios
 * reales, con sesión, expiración y contraseñas hasheadas.
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuario", plural: "Usuarios" },
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Sistema",
  },
  fields: [
    {
      name: "name",
      label: "Nombre",
      type: "text",
    },
  ],
};
