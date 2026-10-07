// Utilidades comunes para las capturas del manual (backend local de demo en :8002, web en :5180).
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DIR = path.dirname(fileURLToPath(import.meta.url));
export const WEB = process.env.WEB ?? "http://localhost:5180";
export const ASSETS = path.join(DIR, "demo-assets");

export async function browser() {
  return chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
}

const CT = { ".png": "image/png", ".pdf": "application/pdf", ".jpg": "image/jpeg" };

/** Contexto con: modo claro, archivos de demo servidos localmente y subidas a Cloudinary simuladas. */
export async function context(b, { width = 1440, height = 900, mode = "light", mobile = false } = {}) {
  const ctx = await b.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1.5,
    isMobile: mobile,
    hasTouch: mobile,
    locale: "es-EC",
    timezoneId: "America/Guayaquil",
  });
  await ctx.addInitScript((m) => {
    try { if (!sessionStorage.getItem("__init")) { localStorage.setItem("mui-mode", m); sessionStorage.setItem("__init", "1"); } } catch {}
  }, mode);
  await ctx.route("https://demo.aspy.local/**", (route) => {
    const name = route.request().url().split("/").pop();
    let file = path.join(ASSETS, name);
    if (!fs.existsSync(file)) {
      const ext = path.extname(name);
      file = path.join(ASSETS, ext === ".pdf" ? "reporte.pdf" : name.startsWith("firma") ? "firma.png" : "comprobante.png");
    }
    route.fulfill({ status: 200, contentType: CT[path.extname(file)] ?? "application/octet-stream", body: fs.readFileSync(file), headers: { "Access-Control-Allow-Origin": "*" } });
  });
  // Nunca subir nada real a Cloudinary: se responde con una URL de demo
  let n = 100;
  await ctx.route("https://api.cloudinary.com/**", (route) => {
    const id = n++;
    route.fulfill({
      status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ secure_url: `https://demo.aspy.local/subida-${id}.png`, url: `https://demo.aspy.local/subida-${id}.png`, public_id: `demo-${id}` }),
    });
  });
  // Contenido real de Sanity (solo lectura): se agrega el permiso CORS para este puerto de pruebas
  await ctx.route(/^https:\/\/1windn04\.api(cdn)?\.sanity\.io\//, async (route) => {
    const resp = await route.fetch();
    route.fulfill({ response: resp, headers: { ...resp.headers(), "access-control-allow-origin": "*" } });
  });
  return ctx;
}

export async function login(page, email, password) {
  await page.goto(WEB + "/login");
  await page.waitForLoadState("networkidle");
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.keyboard.press("Enter");
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 20000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
}

export const USERS = {
  Admin: ["admin@aspy.com", "ADMIN"],
  Staff: ["recepcion@aspy.com", "Aspy2026"],
  Professional: ["lucia.mendoza@aspy.com", "Aspy2026"],
  Client: ["sofia.ramirez@gmail.com", "Aspy2026"],
};

/** Espera a que no haya indicadores de carga. */
export async function settle(page, extra = 600) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForSelector(".MuiCircularProgress-root", { state: "detached", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(extra);
}

/** Navega dentro de la app sin recargar (como al hacer clic en el menú). */
export async function go(page, path) {
  await page.evaluate((p) => { history.pushState({}, "", p); dispatchEvent(new PopStateEvent("popstate")); }, path);
  await settle(page);
}

/** Resalta elementos en la captura con un recuadro de color y un número. */
export async function mark(page, locator, label = "", color = "#E8578A") {
  const box = await locator.first().boundingBox();
  if (!box) { console.log("  (sin caja para marcar)", label); return; }
  await page.evaluate(({ box, label, color }) => {
    const pad = 5;
    const d = document.createElement("div");
    d.className = "__mark";
    Object.assign(d.style, {
      position: "absolute", left: box.x + scrollX - pad + "px", top: box.y + scrollY - pad + "px", width: box.width + pad * 2 + "px", height: box.height + pad * 2 + "px",
      border: `3px solid ${color}`, borderRadius: "12px", boxShadow: `0 0 0 4px ${color}33`, zIndex: 2147483647, pointerEvents: "none",
    });
    if (label) {
      const b = document.createElement("div");
      b.textContent = label;
      Object.assign(b.style, {
        position: "absolute", top: "-16px", left: "-16px", minWidth: "28px", height: "28px", padding: "0 6px", borderRadius: "14px", background: color, color: "#fff",
        font: "800 15px/28px Inter, Arial, sans-serif", textAlign: "center", boxShadow: "0 2px 6px #0004",
      });
      d.appendChild(b);
    }
    document.body.appendChild(d);
  }, { box, label, color });
}
export async function clearMarks(page) {
  await page.evaluate(() => document.querySelectorAll(".__mark").forEach((e) => e.remove()));
}

/** Captura para el manual (JPEG). clip opcional {x,y,width,height}. */
export async function shot(page, name, opts = {}) {
  const fsPath = path.join(DIR, "out", name + ".jpg");
  fs.mkdirSync(path.dirname(fsPath), { recursive: true });
  await page.screenshot({ path: fsPath, type: "jpeg", quality: 88, ...opts });
  await clearMarks(page);
  console.log("  📸", name);
}

/** Combobox de un Select de MUI por el texto de su etiqueta (la etiqueta va arriba, enlazada con `labelId`). */
export function sel(page, label) {
  return page.getByRole("combobox", { name: new RegExp(`^${label}`) }).first();
}

/** Llena campos por atributo name. Para <select>, el valor es la etiqueta visible. */
export async function fill(page, values) {
  for (const [name, v] of Object.entries(values)) {
    const el = page.locator(`[name="${name}"]`).first();
    const tag = await el.evaluate((e) => e.tagName);
    if (tag === "SELECT") {
      const opts = await el.evaluate((e) => [...e.options].map((o) => [o.value, o.text.trim()]));
      const hit = opts.find(([, t]) => t.toLowerCase().startsWith(String(v).toLowerCase().slice(0, 5))) ?? opts[1];
      await el.selectOption(hit[0]);
    }
    else await el.fill(v);
  }
}
export async function dumpFields(page) {
  return page.evaluate(() => [...document.querySelectorAll("input, select, textarea")].filter((e) => e.offsetParent).map((e) => `${e.tagName}:${e.name || e.id}:${e.type}` + (e.tagName === "SELECT" ? "[" + [...e.options].map((o) => o.text).slice(0, 6).join("|") + "]" : "")));
}
