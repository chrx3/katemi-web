import "server-only";
import { cookies } from "next/headers";

/**
 * Valida la cookie de sesión del admin contra ADMIN_SESSION_TOKEN.
 *
 * Las Server Actions son endpoints HTTP públicos: cualquiera que conozca el
 * action id puede invocarlas. Toda acción que escriba o lea datos privados
 * debe pasar por requireAdmin() antes de tocar PocketBase.
 */
export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected) return false;

  const token = (await cookies()).get("admin-session")?.value;
  return token === expected;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("No autorizado");
  }
}
