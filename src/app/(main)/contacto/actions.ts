"use server";

import { z } from "zod";
import { getPayloadClient } from "@/lib/payload-client";

/**
 * Recepción del formulario público de contacto.
 *
 * Antes el navegador escribía directo en PocketBase. Ahora pasa por el
 * servidor, que revalida los datos con el mismo esquema del cliente: la
 * validación de front es para la experiencia de usuario, no una garantía —
 * cualquiera puede llamar a esta acción con lo que quiera.
 */
const contactSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phone: z.string().min(6).max(40),
  company: z.string().max(150).optional(),
  email: z.email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(1000),
});

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContact(
  input: unknown,
): Promise<ContactSubmitResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "contacts",
      data: { ...parsed.data, company: parsed.data.company ?? "", status: "new" },
    });
    return { ok: true };
  } catch (error) {
    console.error("Error guardando el mensaje de contacto:", error);
    return {
      ok: false,
      error: "No pudimos enviar el mensaje. Intenta nuevamente.",
    };
  }
}
