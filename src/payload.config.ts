import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Clients } from "@/collections/Clients";
import { Contacts } from "@/collections/Contacts";
import { Media } from "@/collections/Media";
import { Projects } from "@/collections/Projects";
import { Services } from "@/collections/Services";
import { Users } from "@/collections/Users";
import { LandingTemplate } from "@/globals/LandingTemplate";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "— KATEMI",
    },
    components: {
      // Acceso al editor visual desde el menú lateral del panel.
      beforeNavLinks: ["/components/admin/VisualEditorLink#VisualEditorLink"],
    },
  },
  collections: [Services, Projects, Clients, Contacts, Media, Users],
  globals: [LandingTemplate],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
  // El panel queda en español: lo usa el equipo de KATEMI, no desarrolladores.
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: "es",
  },
});
