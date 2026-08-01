import { expect, test } from "@playwright/test";
import { collectPageProblems } from "./helpers";

/**
 * El sitio público tiene que renderizar el contenido en el servidor.
 *
 * Antes de la migración, /servicios y /proyectos pedían los datos a PocketBase
 * desde el navegador: los buscadores no veían nada y se alcanzaba a mostrar el
 * contenido de respaldo. Estas pruebas leen el HTML crudo, sin ejecutar JS,
 * justamente para detectar una regresión a ese comportamiento.
 */

async function rawHtml(request: import("@playwright/test").APIRequestContext, path: string) {
  const res = await request.get(path);
  expect(res.status(), `${path} respondió ${res.status()}`).toBe(200);
  return res.text();
}

test.describe("Sitio público", () => {
  test("la portada renderiza el contenido en el servidor", async ({ request }) => {
    const html = await rawHtml(request, "/");

    expect(html).toContain("Soluciones integrales en");
    // Proyectos y servicios deben venir en el HTML, no cargarse por JS.
    expect(html).toMatch(/\/proyectos\/[a-z0-9-]+/);
    expect(html).toMatch(/\/servicios\/[a-z0-9-]+/);
  });

  test("/servicios lista los servicios activos en el HTML", async ({ request }) => {
    const html = await rawHtml(request, "/servicios");

    const slugs = new Set([...html.matchAll(/\/servicios\/([a-z0-9-]+)/g)].map((m) => m[1]));
    expect(slugs.size).toBeGreaterThanOrEqual(10);

    // Los marcados como inactivos no se publican.
    for (const inactive of ["servicios-electricos", "energia-solar", "baterias-residenciales"]) {
      expect(slugs.has(inactive), `${inactive} está inactivo y no debería aparecer`).toBe(false);
    }
  });

  test("/proyectos lista los proyectos en el HTML", async ({ request }) => {
    const html = await rawHtml(request, "/proyectos");
    const slugs = new Set([...html.matchAll(/\/proyectos\/([a-z0-9-]+)/g)].map((m) => m[1]));
    expect(slugs.size).toBeGreaterThanOrEqual(4);
  });

  test("el detalle de un servicio renderiza en el servidor", async ({ request }) => {
    const html = await rawHtml(request, "/servicios/climatizacion");
    expect(html).toMatch(/Climatizaci/i);
  });

  test("el detalle de un proyecto muestra los servicios relacionados por título", async ({ page }) => {
    await page.goto("/proyectos/falabella-paseo-puente", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "Falabella Paseo Puente" })).toBeVisible();

    // La relación se resuelve con depth 1, así que la lista muestra los
    // títulos de los servicios y no los slugs que guardaba PocketBase.
    const serviciosRealizados = page.locator("section", {
      has: page.getByRole("heading", { name: /servicios realizados/i }),
    });
    const items = serviciosRealizados.locator("li");
    await expect(items.filter({ hasText: /^Instalaciones eléctricas$/ })).toHaveCount(1);
    await expect(items.filter({ hasText: /^Climatización$/ })).toHaveCount(1);
    await expect(items.filter({ hasText: /instalaciones-electricas/ })).toHaveCount(0);
  });

  test("las páginas no lanzan errores de consola", async ({ page }) => {
    for (const path of ["/", "/servicios", "/proyectos", "/nosotros", "/contacto"]) {
      const { consoleErrors, failedRequests } = collectPageProblems(page);
      await page.goto(path, { waitUntil: "networkidle" });

      expect(consoleErrors, `${path} — errores de consola:\n${consoleErrors.join("\n")}`).toHaveLength(0);
      expect(failedRequests, `${path} — peticiones fallidas:\n${failedRequests.join("\n")}`).toHaveLength(0);
    }
  });

  test("el filtro de proyectos por categoría devuelve resultados", async ({ page }) => {
    await page.goto("/proyectos", { waitUntil: "networkidle" });

    const cards = page.locator('a[href^="/proyectos/"]');
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    // Regresión: el filtro comparaba etiquetas ("Retail") contra valores
    // guardados en minúscula ("retail"), así que cualquier categoría vaciaba
    // la grilla.
    await page.getByRole("button", { name: "Retail" }).click();
    await expect(page.getByText("No hay proyectos en esta categoría.")).toBeHidden();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("el formulario de contacto rechaza datos inválidos", async ({ page }) => {
    await page.goto("/contacto", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByText(/al menos 2 caracteres/i).first()).toBeVisible();
  });
});
