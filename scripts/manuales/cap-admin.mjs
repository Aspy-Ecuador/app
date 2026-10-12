// Capturas del manual del ADMINISTRADOR. Correr después de cap-profesional.mjs.
import { browser, context, login, go, settle, shot as rawShot, mark } from "./lib.mjs";

const D = "admin/";
const shot = (p, n, o) => rawShot(p, D + n, o);
const fails = [];
const ONLY = process.env.ONLY?.split(",");
const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };
const b = await browser();
const ctx = await context(b);
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && console.log("  consola:", m.text().slice(0, 160)));
const row = (text) => p.locator('[role="row"]').filter({ hasText: text });

try {
  await login(p, "admin@aspy.com", "ADMIN"); await settle(p, 1500);
  await step("panel", async () => {
    await mark(p, p.getByText("Ingresos mensuales", { exact: false }).locator("xpath=ancestor::div[contains(@class,'MuiCard') or contains(@class,'MuiPaper')][1]"), "1");
    await mark(p, p.getByText("Número de citas", { exact: false }).locator("xpath=ancestor::div[contains(@class,'MuiCard') or contains(@class,'MuiPaper')][1]"), "2");
    await mark(p, p.getByText("Agregar Usuario", { exact: true }), "3");
    await shot(p, "01-panel");
  });
  // Avisos: lo que hay por revisar (pagos, horarios por aprobar, datos bancarios sin cargar…)
  await step("avisos", async () => {
    const zona = p.getByRole("region", { name: "Avisos" });
    const c = await zona.boundingBox();
    await shot(p, "01b-por-revisar", { clip: { x: c.x - 28, y: c.y - 28, width: c.width + 56, height: c.height + 56 } });
  });
  await step("usuarios", async () => {
    await go(p, "/usuarios");
    await mark(p, p.getByRole("button", { name: /Agregar usuario/ }), "1");
    await mark(p, p.getByRole("button", { name: /PDF/ }), "2");
    await mark(p, p.getByRole("button", { name: /Excel/ }), "2");
    await mark(p, row("Andrés").first().locator(".MuiSwitch-root"), "3");
    await shot(p, "02-usuarios");
    await row("Lucía").first().click(); await settle(p, 800);
    await mark(p, p.locator('[data-testid="EditIcon"], [data-testid="EditRoundedIcon"]').first(), "");
    await shot(p, "03-usuario-ficha");
    await p.locator('[data-testid="EditIcon"], [data-testid="EditRoundedIcon"]').first().click(); await settle(p);
    await shot(p, "04-usuario-editar");
  });
  await step("nuevo-usuario", async () => {
    await go(p, "/nuevo-usuario");
    await mark(p, p.locator('[name="role_id"]'), "");
    await shot(p, "05-usuario-nuevo");
    const roles = await p.locator('[name="role_id"] option').allTextContents();
    console.log("  roles:", roles.join(" | "));
  });
  await step("servicios", async () => {
    await go(p, "/servicios");
    await mark(p, p.getByRole("button", { name: /Agregar servicio/ }), "1");
    await mark(p, row("Psicología").first().locator('[role="combobox"]'), "2");
    await mark(p, row("Psicología").first().locator(".MuiSwitch-root"), "3");
    await mark(p, row("Psicología").first().locator('[data-testid*="Edit"]'), "4");
    await shot(p, "06-servicios");
  });
  await step("datos-bancarios", async () => {
    await mark(p, p.getByText("Datos bancarios", { exact: true }).first().locator("xpath=ancestor::*[self::button or self::a][1]"), "1");
    await go(p, "/datos-bancarios");
    await mark(p, p.getByRole("button", { name: "Guardar" }).first(), "2");
    await mark(p, p.locator("#plazo-comprobante"), "3");
    await mark(p, p.getByText("Horarios de los profesionales", { exact: true }).locator("xpath=ancestor::div[contains(@class,'MuiPaper')][1]"), "4");
    await shot(p, "09-datos-bancarios", { fullPage: true });
  });
  await step("citas", async () => {
    await go(p, "/citas");
    await shot(p, "07-citas");
    await p.getByRole("button", { name: "Mes", exact: true }).click(); await p.waitForTimeout(800);
    await shot(p, "08-citas-mes");
  });
  // Quien retiró su consentimiento (lo hace cap-cliente, paso "retiro") sale con un escudo rojo junto al interruptor
  await step("horarios", async () => {
    // El Admin también aprueba los horarios de los profesionales y puede crearlos por ellos
    await go(p, "/horarios"); await settle(p, 1000);
    const zona = p.getByRole("region", { name: "Horarios por aprobar" });
    await mark(p, p.getByRole("button", { name: "Horarios", exact: true }).first(), "1");
    await mark(p, zona, "2");
    await shot(p, "11-horarios");
  });
  await step("retiro", async () => {
    await go(p, "/usuarios"); await settle(p, 800);
    const escudo = row("Rosa").first().locator('[data-testid="GppBadOutlinedIcon"]');
    await escudo.scrollIntoViewIfNeeded();
    await escudo.hover(); await p.waitForTimeout(700);
    await mark(p, escudo, "");
    await shot(p, "10-usuario-retiro");
  });
} finally {
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
