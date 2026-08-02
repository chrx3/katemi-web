/**
 * Auditoría de contraste del panel y el editor.
 *
 * Recorre cada nodo de texto visible, resuelve el color efectivo del texto y
 * el del fondo (subiendo por los ancestros hasta encontrar uno opaco, y
 * componiendo los semitransparentes por el camino) y calcula la razón de
 * contraste de WCAG. Se ejecuta en tema claro y oscuro porque Payload voltea
 * sus tokens y un color escrito a mano solo falla en uno de los dos.
 *
 *   node scripts/contrast-audit.mjs
 */

import { chromium } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3001";
const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@katemi.cl";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

const PAGES = [
  ["Panel — inicio", "/admin"],
  ["Panel — listado", "/admin/collections/services"],
  ["Panel — ficha", "/admin/collections/services?limit=1"],
  ["Panel — contenido del sitio", "/admin/globals/landing-template"],
  ["Panel — mensajes", "/admin/collections/contacts"],
  ["Panel — cuenta", "/admin/account"],
  ["Editor visual", "/editor-visual"],
];

const AUDIT = () => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  /** Compone los fondos semitransparentes hasta llegar a uno opaco. */
  const effectiveBg = (el) => {
    const stack = [];
    let node = el;
    let gradient = false;
    while (node && node !== document.documentElement.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") gradient = true;
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        stack.push(bg);
        if (bg.a === 1) break;
      }
      node = node.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { bg: base, gradient };
  };

  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent?.trim();
    if (!text) continue;

    const el = node.parentElement;
    if (!el) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (parseFloat(cs.opacity) === 0) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const fg = parse(cs.color);
    if (!fg) continue;

    const { bg, gradient } = effectiveBg(el);
    const composed = fg.a < 1 ? over(fg, bg) : fg;
    const r = ratio(composed, bg);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;

    if (r < required) {
      results.push({
        text: text.slice(0, 48),
        ratio: Math.round(r * 100) / 100,
        required,
        color: cs.color,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        size: Math.round(size),
        gradient,
        selector:
          el.tagName.toLowerCase() +
          (el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
      });
    }
  }
  return results;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });

if (PASSWORD) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded", timeout: 240000 });
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/users/login")),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 60000 }).catch(() => {});
}

let total = 0;
for (const theme of ["light", "dark"]) {
  console.log(`\n${"=".repeat(60)}\nTEMA ${theme.toUpperCase()}\n${"=".repeat(60)}`);

  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 240000 }).catch(() => {});
    await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    await page.waitForTimeout(700);

    const issues = await page.evaluate(AUDIT);
    // Un mismo texto repetido en una tabla produce ruido; se agrupa.
    const seen = new Map();
    for (const i of issues) {
      const key = `${i.selector}|${i.color}|${i.bg}`;
      if (!seen.has(key)) seen.set(key, { ...i, count: 1 });
      else seen.get(key).count++;
    }
    const unique = [...seen.values()].sort((a, b) => a.ratio - b.ratio);
    total += unique.length;

    if (unique.length === 0) {
      console.log(`  OK   ${name}`);
    } else {
      console.log(`  ${unique.length} problema(s)  ${name}`);
      for (const i of unique.slice(0, 6)) {
        console.log(
          `        ${i.ratio}:1 (min ${i.required})  "${i.text}"  ${i.size}px  ${i.color} sobre ${i.bg}  [${i.selector}]${i.count > 1 ? ` x${i.count}` : ""}${i.gradient ? " (con gradiente)" : ""}`,
        );
      }
    }
  }
}

console.log(`\nTotal de problemas de contraste: ${total}`);
await browser.close();
process.exit(total > 0 ? 1 : 0);
