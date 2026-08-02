import { expect, test } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers";

/**
 * Contrato de la API de Payload y control de acceso.
 *
 * Los conteos son los que dejó la migración desde PocketBase; si alguno baja,
 * algo se perdió por el camino.
 */

test.describe("API de contenido", () => {
  test("las colecciones públicas se leen sin autenticación", async ({ request }) => {
    // 15 y no 18: tres servicios cargados eran de HM INOVA (energía solar,
    // baterías residenciales) y no figuran en la carta de presentación de
    // KATEMI, así que se eliminaron.
    const expected: Record<string, number> = {
      services: 15,
      projects: 4,
      clients: 4,
      media: 4,
    };

    for (const [collection, min] of Object.entries(expected)) {
      const res = await request.get(`/api/${collection}?limit=0`);
      expect(res.status(), `${collection} respondió ${res.status()}`).toBe(200);
      const body = await res.json();
      expect(body.totalDocs, `${collection} tiene ${body.totalDocs}, se esperaban ${min}`).toBeGreaterThanOrEqual(min);
    }
  });

  test("el contenido del sitio expone los campos migrados", async ({ request }) => {
    const res = await request.get("/api/globals/landing-template");
    expect(res.status()).toBe(200);
    const global = await res.json();

    expect(global.heroTitleStart).toBe("Soluciones integrales en");
    expect(global.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Array.isArray(global.statsItems)).toBe(true);
    expect(global.statsItems.length).toBeGreaterThan(0);

    // Claves rescatadas de siteConfig que si no se habrían perdido.
    expect(global.companyName).toBeTruthy();
    expect(global.whatsapp).toBeTruthy();
    expect(global.defaultMetaTitle).toBeTruthy();
  });

  test("los mensajes de contacto no son legibles sin sesión", async ({ request }) => {
    const res = await request.get("/api/contacts?limit=1");
    // Datos personales de terceros: la lectura exige autenticación.
    expect([401, 403]).toContain(res.status());
  });

  test("no se puede crear contenido sin sesión", async ({ request }) => {
    const res = await request.post("/api/services", {
      data: { slug: "intruso", title: "Intruso", shortDescription: "x", fullDescription: "x" },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("el formulario público sí puede enviar un mensaje", async ({ request }) => {
    test.skip(!ADMIN_PASSWORD, "Se necesita sesión para limpiar el mensaje.");

    const res = await request.post("/api/contacts", {
      data: {
        firstName: "Prueba",
        lastName: "Automatizada",
        email: "prueba@example.com",
        phone: "+56900000000",
        subject: `E2E ${Date.now()}`,
        message: "Mensaje generado por la suite de pruebas automatizadas.",
      },
    });
    expect(res.status(), await res.text()).toBeLessThan(400);

    // La prueba borra lo que crea: si no, cada corrida deja un mensaje falso
    // en la bandeja y el panel termina lleno de ruido.
    const created = (await res.json())?.doc?.id;
    expect(created, "no se pudo leer el id del mensaje creado").toBeTruthy();

    await request.post("/api/users/login", {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    const cleanup = await request.delete(`/api/contacts/${created}`);
    expect(cleanup.status(), "quedó un mensaje de prueba sin borrar").toBe(200);
  });

  test("con sesión sí se leen los mensajes", async ({ request }) => {
    test.skip(!ADMIN_PASSWORD, "Define E2E_ADMIN_PASSWORD.");

    const login = await request.post("/api/users/login", {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    expect(login.status()).toBe(200);

    const res = await request.get("/api/contacts?limit=1");
    expect(res.status()).toBe(200);
    expect((await res.json()).totalDocs).toBeGreaterThan(0);
  });

  test("las relaciones de proyectos vienen resueltas", async ({ request }) => {
    const res = await request.get("/api/projects?limit=1&depth=1");
    const { docs } = await res.json();
    expect(docs.length).toBe(1);

    const services = docs[0].servicesProvided;
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    // Objetos completos, no ids sueltos: confirma que la relación existe.
    expect(typeof services[0]).toBe("object");
    expect(services[0].title).toBeTruthy();
  });
});
