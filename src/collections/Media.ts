import type { CollectionConfig } from "payload";

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/**
 * Archivos subidos. Sustituye a los campos file de PocketBase.
 *
 * Se guarda en disco (public/media) porque el VPS ya monta un volumen para la
 * app; si más adelante se agrega MinIO basta con cambiar esto por el plugin de
 * storage S3 sin tocar las colecciones que la referencian.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Archivo", plural: "Archivos" },
  admin: { group: "Sistema" },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 400, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      admin: {
        description:
          "Describe la imagen para lectores de pantalla y para cuando no carga.",
      },
    },
  ],
};
