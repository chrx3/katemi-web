import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";

/**
 * Cliente de la Local API de Payload.
 *
 * Corre en el mismo proceso que Next: no hay HTTP de por medio, así que las
 * páginas públicas leen contenido directamente desde Postgres sin exponer
 * credenciales ni pagar una llamada de red, que era el problema del enfoque
 * anterior con PocketBase desde el navegador.
 */
export const getPayloadClient = async () => getPayload({ config: configPromise });
