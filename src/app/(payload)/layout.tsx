import type { ServerFunctionClient } from "payload";

import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { Space_Grotesk } from "next/font/google";
import React from "react";

// RootLayout no trae sus propios estilos: la hoja del panel se expone por este
// export aparte. Sin esta línea el admin se renderiza completamente sin CSS.
import "@payloadcms/next/css";
// Va después para poder sobrescribir los tokens de Payload.
import "./custom.scss";

import { importMap } from "./admin/importMap.js";

// La misma familia del sitio, para que el panel no se lea como otro producto.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

/**
 * Layout del panel de Payload. Vive en su propio route group para no heredar
 * los estilos ni el chrome del sitio público.
 */
const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
    htmlProps={{ className: spaceGrotesk.variable }}
  >
    {children}
  </RootLayout>
);

export default Layout;
