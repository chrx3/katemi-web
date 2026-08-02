import { defineConfig, devices } from "@playwright/test";

// Playwright no lee los .env por su cuenta y las credenciales del panel viven
// en .env.local, fuera del control de versiones.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // El archivo puede no existir (por ejemplo en CI, donde van como secretos).
  }
}

const PORT = Number(process.env.E2E_PORT ?? 3001);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  // Payload compila el panel bajo demanda la primera vez y eso tarda bastante.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Reutiliza el servidor si ya está levantado; si no, lo arranca.
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: `npm run dev`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 180_000,
        stdout: "ignore",
        stderr: "pipe",
      },
});
