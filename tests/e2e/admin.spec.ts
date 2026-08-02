import { expect, test } from "@playwright/test";
import { ADMIN_PASSWORD, collectPageProblems, loginToAdmin } from "./helpers";

test.describe("Panel de Payload", () => {
  test.skip(
    !ADMIN_PASSWORD,
    "Define E2E_ADMIN_PASSWORD para correr las pruebas del panel.",
  );

  test("el login carga con estilos y sin errores de consola", async ({ page }) => {
    const { consoleErrors, failedRequests } = collectPageProblems(page);

    await page.goto("/admin/login", { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(/KATEMI/);
    await expect(page.locator('input[name="email"]')).toBeVisible();

    // Regresión: el RootLayout de Payload no importa su hoja de estilos, hay
    // que hacerlo a mano con "@payloadcms/next/css". Sin ella el panel se
    // renderiza en HTML plano, que es exactamente lo que pasó. Estas variables
    // solo existen si la hoja llegó.
    const themeVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-elevation-0")
        .trim(),
    );
    expect(themeVar, "no cargó la hoja de estilos del panel").not.toBe("");

    expect(consoleErrors, `errores de consola:\n${consoleErrors.join("\n")}`).toHaveLength(0);
    expect(failedRequests, `peticiones fallidas:\n${failedRequests.join("\n")}`).toHaveLength(0);
  });

  test("se puede iniciar sesión y llegar al panel", async ({ page }) => {
    await loginToAdmin(page);
    await expect(page).toHaveURL(/\/admin(\/|$)/);
    await expect(page.getByRole("link", { name: "Servicios" }).first()).toBeVisible();
  });

  test("las colecciones cargan sin errores de hidratación", async ({ page }) => {
    await loginToAdmin(page);
    const { consoleErrors, failedRequests } = collectPageProblems(page);

    for (const slug of ["services", "projects", "clients", "contacts", "media"]) {
      await page.goto(`/admin/collections/${slug}`, { waitUntil: "networkidle" });
      await expect(page.locator(`.collection-list--${slug}`)).toBeVisible();
      await expect(page.locator(".list-header__title")).toBeVisible();
    }

    // Regresión del <html> anidado: producía "cannot be a child of" y
    // "Hydration failed" sin que ninguna ruta devolviera error.
    const hydration = consoleErrors.filter(
      (e) => /hydrat/i.test(e) || /cannot be a child of/i.test(e),
    );
    expect(hydration, `errores de hidratación:\n${hydration.join("\n")}`).toHaveLength(0);
    expect(consoleErrors, `errores de consola:\n${consoleErrors.join("\n")}`).toHaveLength(0);
    expect(failedRequests, `peticiones fallidas:\n${failedRequests.join("\n")}`).toHaveLength(0);
  });

  test("el editor de contenido muestra las pestañas y los datos migrados", async ({ page }) => {
    await loginToAdmin(page);
    const { consoleErrors } = collectPageProblems(page);

    await page.goto("/admin/globals/landing-template", { waitUntil: "networkidle" });

    // Se acota al contenedor de pestañas: "Servicios" también es una entrada
    // del menú lateral y sin acotar el selector resuelve a ese enlace.
    const tabs = page.locator(".tabs-field__tab-button");
    const tabLabels = (await tabs.allTextContents()).map((t) => t.trim());

    for (const tab of ["Portada", "Marca", "Cifras", "Servicios", "Contacto", "Empresa y SEO"]) {
      expect(tabLabels, `falta la pestaña ${tab}`).toContain(tab);
    }

    // Valor concreto que viene de la migración, no un placeholder.
    await expect(page.locator('input[name="heroTitleStart"]')).toHaveValue(
      "Soluciones integrales en",
    );

    expect(consoleErrors, `errores de consola:\n${consoleErrors.join("\n")}`).toHaveLength(0);
  });

  test("el panel exige autenticación", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/collections/contacts", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
