import { expect, test } from "@playwright/test";
import { ADMIN_PASSWORD, collectPageProblems, loginToAdmin } from "./helpers";

/**
 * Editor visual: edición inline haciendo clic sobre el texto en la vista.
 *
 * Es la funcionalidad que existía en el panel anterior y que se perdió al
 * migrar a Payload. Estas pruebas la cubren de punta a punta —clic, escribir,
 * guardar, recargar— porque su valor está justamente en que persista, no en
 * que se vea bien.
 */
/** El botón cambia de texto según el estado; se ubica por sus variantes. */
const guardarBtn = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /publicar cambios|publicando|todo publicado/i });

test.describe("Editor visual", () => {
  test.skip(!ADMIN_PASSWORD, "Define E2E_ADMIN_PASSWORD.");

  test("exige sesión", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/editor-visual", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("el panel enlaza al editor visual", async ({ page }) => {
    await loginToAdmin(page);
    await expect(page.getByRole("link", { name: /editar el sitio/i })).toBeVisible();
  });

  test("carga la vista previa con el contenido real y sin errores", async ({ page }) => {
    await loginToAdmin(page);
    const { consoleErrors, failedRequests } = collectPageProblems(page);

    await page.goto("/editor-visual", { waitUntil: "networkidle" });

    await expect(page.getByText("Editar el sitio").first()).toBeVisible();
    await expect(page.getByText("Soluciones integrales en")).toBeVisible();
    // Los textos editables son botones con este title.
    expect(await page.locator('[title="Click para editar"]').count()).toBeGreaterThan(5);

    expect(consoleErrors, consoleErrors.join("\n")).toHaveLength(0);
    expect(failedRequests, failedRequests.join("\n")).toHaveLength(0);
  });

  test("permite cambiar la vista entre páginas", async ({ page }) => {
    await loginToAdmin(page);
    await page.goto("/editor-visual", { waitUntil: "networkidle" });

    await page.getByRole("tab", { name: "Nosotros" }).click();
    await expect(page.getByText(/Nuestra Empresa|Misión/i).first()).toBeVisible();
  });

  test("editar un texto y guardar lo persiste, y se puede revertir", async ({ page }) => {
    await loginToAdmin(page);
    await page.goto("/editor-visual", { waitUntil: "networkidle" });

    const original = "Soluciones integrales en";
    const edited = `Soluciones E2E ${Date.now()}`;

    const target = page.locator('[title="Click para editar"]', { hasText: original }).first();
    await expect(target).toBeVisible();

    // Clic sobre el texto → se convierte en input → escribir → Enter confirma.
    await target.click();
    const input = page.locator("input:focus");
    await input.fill(edited);
    await input.press("Enter");

    await expect(guardarBtn(page)).toBeEnabled();

    await guardarBtn(page).click();
    await expect(page.getByText(/publicad/i).first()).toBeVisible();

    // Se recarga desde el servidor: si no persistió, vuelve el valor viejo.
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(edited)).toBeVisible();

    // Y se restaura, para que la suite pueda correrse las veces que sea.
    const revert = page.locator('[title="Click para editar"]', { hasText: edited }).first();
    await revert.click();
    const revertInput = page.locator("input:focus");
    await revertInput.fill(original);
    await revertInput.press("Enter");
    await guardarBtn(page).click();
    await expect(page.getByText(/publicad/i).first()).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(original)).toBeVisible();
  });

  test("el guardado publica el cambio en el sitio público", async ({ page, request }) => {
    await loginToAdmin(page);
    await page.goto("/editor-visual", { waitUntil: "networkidle" });

    const original = "Nuestros Servicios";
    const edited = `Servicios E2E ${Date.now()}`;

    const target = page.locator('[title="Click para editar"]', { hasText: original }).first();
    await target.click();
    const input = page.locator("input:focus");
    await input.fill(edited);
    await input.press("Enter");
    await guardarBtn(page).click();
    await expect(page.getByText(/publicad/i).first()).toBeVisible();

    // La acción de guardado revalida las rutas públicas, así que el cambio
    // aparece de inmediato en vez de esperar los 60s de revalidate.
    const html = await (await request.get("/")).text();
    expect(html).toContain(edited);

    // Restaurar.
    const revert = page.locator('[title="Click para editar"]', { hasText: edited }).first();
    await revert.click();
    const revertInput = page.locator("input:focus");
    await revertInput.fill(original);
    await revertInput.press("Enter");
    await guardarBtn(page).click();
    await expect(page.getByText(/publicad/i).first()).toBeVisible();
  });
});
