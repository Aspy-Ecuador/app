// Capturas del manual del CLIENTE (paciente / familia). Requiere la BD de demo recién creada (reset.sh).
import { browser, context, login, go, settle, shot as rawShot, mark, sel, ASSETS, WEB, fill } from "./lib.mjs";

const D = "cliente/";
const shot = (p, n, o) => rawShot(p, D + n, o);
const fails = [];
const ONLY = process.env.ONLY?.split(","); const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };

const b = await browser();
const ctx = await context(b);
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && console.log("  consola:", m.text().slice(0, 160)));

try {
  // ── Entrar ──
  await step("landing", async () => {
    await p.goto(WEB + "/"); await settle(p, 2500);
    await mark(p, p.getByRole("link", { name: /^Ingresar/ }).first(), "1");
    await shot(p, "01-landing-ingresar");
  });
  await step("login", async () => {
    await p.goto(WEB + "/login"); await settle(p);
    await p.fill('input[type="email"], input[name="email"]', "sofia.ramirez@gmail.com");
    await p.fill('input[type="password"]', "Aspy2026");
    await mark(p, p.locator('input[type="email"], input[name="email"]'), "1");
    await mark(p, p.locator('input[type="password"]'), "2");
    await mark(p, p.getByRole("button", { name: /Iniciar sesión|Ingresar|Entrar/i }).first(), "3");
    await shot(p, "02-login");
    await mark(p, p.getByRole("link", { name: "Regístrate" }), "");
    await shot(p, "03-login-registro");
    await p.getByRole("button", { name: /Olvidaste tu contraseña/ }).click(); await p.waitForTimeout(400);
    await mark(p, p.locator(".MuiAlert-root").last(), "");
    await shot(p, "03b-login-olvido");
  });

  // ── Panel ──
  await login(p, "sofia.ramirez@gmail.com", "Aspy2026"); await settle(p, 1200);
  await step("panel", async () => {
    await shot(p, "08-panel");
    await mark(p, p.locator(".MuiDrawer-root, nav").first(), "");
    await shot(p, "09-menu-lateral", { clip: { x: 0, y: 0, width: 240, height: 900 } });
  });
  await step("leyenda", async () => {
    const legend = p.getByText("Estado", { exact: true }).first().locator("xpath=..");
    const box = await legend.boundingBox();
    await rawShot(p, D + "10-leyenda", { clip: { x: box.x - 8, y: box.y - 8, width: Math.min(box.width + 16, 900), height: box.height + 16 } });
  });
  await step("cita-detalle", async () => {
    await p.locator(".fc-next-button, button[title*='Next'], button[aria-label*='next' i]").first().click().catch(() => p.locator(".fc-toolbar button").nth(1).click());
    await p.waitForTimeout(800);
    await p.locator(".fc-event").filter({ hasText: "Psicología" }).first().click(); await p.waitForTimeout(700);
    await mark(p, p.getByRole("button", { name: "Cancelar cita" }), "");
    await shot(p, "11-cita-detalle-cancelar");
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  });

  // ── Agendar una cita ──
  await step("agendar", async () => {
    await go(p, "/agendar-cita");
    await sel(p, "Servicio").click(); await p.waitForTimeout(400);
    await shot(p, "12-agendar-servicio");
    await p.getByRole("option", { name: "Psicología" }).click(); await p.waitForTimeout(300);
    await sel(p, "Profesional").click(); await p.waitForTimeout(400);
    await shot(p, "13-agendar-profesional");
    await p.getByRole("option", { name: "Lucía Mendoza" }).click(); await p.waitForTimeout(700);
    await mark(p, p.locator(".MuiDateCalendar-root, .MuiPickersLayout-root").first(), "");
    await shot(p, "14-agendar-dias");
    await p.getByRole("gridcell", { name: "15" }).click(); await p.waitForTimeout(700);
    await p.getByRole("button", { name: /15:00/ }).first().click(); await p.waitForTimeout(400);
    await mark(p, p.getByRole("gridcell", { name: "15" }), "1");
    await mark(p, p.getByRole("button", { name: /15:00/ }).first(), "2");
    await mark(p, p.getByRole("button", { name: "Proceder a pagar" }), "3");
    await shot(p, "15-agendar-hora");
  });
  await step("pagar", async () => {
    await p.getByRole("button", { name: "Proceder a pagar" }).click(); await settle(p);
    await mark(p, p.getByText("Datos de transferencia").locator("xpath=ancestor::div[contains(@class,'MuiPaper') or contains(@class,'MuiBox')][2]"), "1");
    await shot(p, "16-pagar-datos", { fullPage: true });
    await p.locator('input[type="file"]').setInputFiles(ASSETS + "/comprobante.png"); await settle(p, 1500);
    await mark(p, p.getByText("Archivo cargado correctamente").locator("xpath=../.."), "1");
    await mark(p, p.getByRole("button", { name: /Continuar/ }), "2");
    await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300);
    await shot(p, "17-pagar-comprobante");
    await p.getByRole("button", { name: /Continuar/ }).click(); await settle(p);
    await mark(p, p.getByRole("button", { name: /Finalizar reserva/ }), "");
    await shot(p, "18-pagar-revisar");
    await p.getByRole("button", { name: /Finalizar reserva/ }).click(); await settle(p, 1500);
    await shot(p, "19-pagar-listo");
    await p.getByRole("button", { name: "Aceptar" }).click().catch(() => {}); await settle(p, 1000);
  });
  await step("cita-guardada", async () => {
    await go(p, "/dashboard");
    await p.locator(".fc-toolbar button").nth(1).click().catch(() => {}); await p.waitForTimeout(800);
    await p.locator(".fc-event").filter({ hasText: "Psicología" }).last().click(); await p.waitForTimeout(700);
    await shot(p, "20-cita-guardada");
    await p.keyboard.press("Escape");
  });

  // ── Recibos, servicios, reportes ──
  await step("recibos", async () => {
    await go(p, "/recibos");
    await mark(p, p.locator('[data-testid="DownloadRoundedIcon"]').first(), "");
    await shot(p, "21-recibos");
  });
  await step("servicios", async () => { await go(p, "/consultarServicios"); await shot(p, "22-servicios"); });
  await step("reportes", async () => {
    await go(p, "/reportes");
    await mark(p, p.getByText("Ver reporte").first(), "");
    await shot(p, "23-reportes");
    await p.getByText("Ver reporte").first().click(); await settle(p, 2500);
    await shot(p, "24-reporte-abierto");
  });

  // ── Perfil y cuenta ──
  await step("perfil", async () => {
    await go(p, "/perfil");
    await mark(p, p.locator('[data-testid="EditIcon"], [data-testid="EditRoundedIcon"]').first(), "");
    await shot(p, "25-perfil");
    await p.locator('[data-testid="EditIcon"], [data-testid="EditRoundedIcon"]').first().click(); await settle(p);
    await shot(p, "26-perfil-editar");
  });
  await step("menu-usuario", async () => {
    await go(p, "/dashboard");
    await p.locator('[data-testid="MoreVertRoundedIcon"], [data-testid="MoreVertIcon"]').first().click(); await p.waitForTimeout(500);
    await rawShot(p, D + "27-menu-usuario", { clip: { x: 0, y: 560, width: 480, height: 340 } });
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  });
  await step("modo-oscuro", async () => {
    const t = p.getByRole("button", { name: /Cambiar a modo/ }).first();
    await mark(p, t, "");
    await rawShot(p, D + "28-boton-modo", { clip: { x: 0, y: 0, width: 300, height: 110 } });
    await t.click(); await p.waitForTimeout(1200);
    await shot(p, "29-modo-oscuro");
    await p.getByRole("button", { name: /Cambiar a modo/ }).first().click(); await p.waitForTimeout(1200);
  });
} finally {
  await ctx.close();
}

// ── En el celular ──
const m = await context(b, { width: 390, height: 844, mobile: true });
const mp = await m.newPage();
try {
  await step("movil", async () => {
    await login(mp, "sofia.ramirez@gmail.com", "Aspy2026"); await settle(mp, 1200);
    await rawShot(mp, D + "30-movil-panel");
    await mp.locator('[data-testid="MenuRoundedIcon"], [data-testid="MenuIcon"], button[aria-label*="menú" i], button[aria-label*="menu" i]').first().click(); await mp.waitForTimeout(700);
    await rawShot(mp, D + "31-movil-menu");
  });
} finally {
  await m.close();
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
