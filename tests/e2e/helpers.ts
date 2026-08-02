import type { Page } from "@playwright/test";

export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@katemi.cl";
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

/**
 * Recolecta errores de consola y peticiones fallidas de una página.
 *
 * Existe porque el bug que rompió el panel (dos <html> anidados) no producía
 * ningún fallo de servidor: todas las rutas devolvían 200 y solo se veía en la
 * consola del navegador. Las pruebas tienen que mirar ahí.
 */
export function collectPageProblems(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));
  page.on("requestfailed", (req) => {
    const failure = req.failure()?.errorText ?? "";
    // Las cancelaciones al navegar no son fallos reales.
    if (failure.includes("ERR_ABORTED")) return;
    failedRequests.push(`${req.url()} :: ${failure}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  return { consoleErrors, failedRequests };
}

/** Inicia sesión en el panel de Payload y espera a salir del login. */
export async function loginToAdmin(page: Page) {
  await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);

  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes("/api/users/login") && r.request().method() === "POST",
    ),
    page.click('button[type="submit"]'),
  ]);

  await page.waitForURL((url) => !url.pathname.endsWith("/login"));
}
