// Capturas del manual del PERSONAL ADMINISTRATIVO (staff). Correr después de cap-cliente.mjs.
import { browser, context, login, go, settle, shot as rawShot, mark, sel, WEB, fill } from "./lib.mjs";

const D = "staff/";
const shot = (p, n, o) => rawShot(p, D + n, o);
const fails = [];
const ONLY = process.env.ONLY?.split(","); const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };
const b = await browser();
const ctx = await context(b);
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && console.log("  consola:", m.text().slice(0, 160)));
const row = (text) => p.locator('[role="row"]').filter({ hasText: text });

try {
  await login(p, "recepcion@aspy.com", "Aspy2026"); await settle(p, 1200);
  await step("panel", async () => {
    await mark(p, p.getByText("Acciones rápidas", { exact: false }).locator("xpath=ancestor::div[contains(@class,'MuiPaper')][1]"), "1");
    await mark(p, p.getByText("Filtrar citas", { exact: false }).locator("xpath=ancestor::div[contains(@class,'MuiPaper')][1]"), "2");
    await shot(p, "01-panel");
  });

  // ── Pagos ──
  await step("pagos", async () => {
    await go(p, "/pagos");
    const pend = p.locator('[role="row"]').filter({ has: p.locator('[data-testid*="Schedule"], [data-testid*="Pending"], [data-testid*="AccessTime"]') });
    const n = await pend.count();
    for (let i = 0; i < Math.min(n, 3); i++) await mark(p, pend.nth(i), "");
    await shot(p, "02-pagos-lista");
    await mark(p, row("Sofía").last().locator('[data-testid*="Visibility"]'), "");
    await shot(p, "03-pagos-ver");
  });
  await step("pago-detalle", async () => {
    await row("Sofía").last().locator('[data-testid*="Visibility"]').click(); await settle(p, 1800);
    await mark(p, p.getByRole("button", { name: "Descargar" }), "1");
    await mark(p, p.getByText("Documento adjunto", { exact: false }).locator("xpath=ancestor::div[contains(@class,'MuiPaper')][1]"), "2");
    await mark(p, p.getByText("Recibo de pago").locator("xpath=ancestor::div[contains(@class,'MuiPaper')][1]"), "3");
    await shot(p, "04-pago-detalle");
    await mark(p, p.getByRole("button", { name: "Aprobar comprobante" }), "");
    await mark(p, p.getByRole("button", { name: "No aprobar" }), "", "#3A9AB8");
    await shot(p, "05-pago-botones", { clip: { x: 220, y: 60, width: 560, height: 420 } });
    await p.getByRole("button", { name: "Aprobar comprobante" }).click(); await p.waitForTimeout(500);
    await mark(p, p.getByRole("button", { name: "Sí, aprobar" }), "");
    await shot(p, "06-pago-aprobar-confirmar");
    await p.getByRole("button", { name: "Sí, aprobar" }).click(); await settle(p, 1500);
    await shot(p, "07-pago-aprobado");
  });
  await step("pago-rechazar", async () => {
    await go(p, "/pagos");
    await row("Mateo").last().locator('[data-testid*="Visibility"]').click(); await settle(p, 1500);
    await p.getByRole("button", { name: "No aprobar" }).click(); await p.waitForTimeout(500);
    // El motivo es obligatorio: sin escribirlo, "Sí, rechazar" no se habilita
    await p.locator("#motivo-rechazo").fill("El monto transferido no coincide con el precio del servicio."); await p.waitForTimeout(300);
    await mark(p, p.locator("#motivo-rechazo"), "1");
    await mark(p, p.getByRole("button", { name: "Sí, rechazar" }), "2");
    await shot(p, "08-pago-rechazar-confirmar");
    await p.getByRole("button", { name: "Cancelar" }).click(); await p.waitForTimeout(300);
  });
  // Rechaza de verdad el pago de Mateo (persona ficticia) y muestra cómo queda: el comprobante se
  // conserva un día y la pantalla dice cuándo se borra
  await step("pago-rechazado", async () => {
    await go(p, "/pagos");
    await row("Mateo").last().locator('[data-testid*="Visibility"]').click(); await settle(p, 1500);
    await p.getByRole("button", { name: "No aprobar" }).click(); await p.waitForTimeout(400);
    await p.locator("#motivo-rechazo").fill("El monto transferido no coincide con el precio del servicio.");
    await p.getByRole("button", { name: "Sí, rechazar" }).click(); await settle(p, 1800);
    await p.getByRole("button", { name: /Aceptar/ }).click().catch(() => {}); await settle(p, 800);
    await go(p, "/pagos");
    await row("Mateo").last().locator('[data-testid*="Visibility"]').click(); await settle(p, 1500);
    await mark(p, p.getByRole("note").filter({ hasText: "Pago rechazado" }), "");
    await shot(p, "08b-pago-rechazado");
  });
  // Lo que ve la familia después: el aviso con el motivo, en su panel (cuenta ficticia de Mateo)
  await step("rechazo-paciente", async () => {
    const c2 = await context(b);
    const p2 = await c2.newPage();
    try {
      await login(p2, "mateo.alvarado@gmail.com", "Aspy2026"); await settle(p2, 1500);
      await mark(p2, p2.getByRole("region", { name: "Pagos que no se aprobaron" }), "");
      await rawShot(p2, "cliente/39-pago-rechazado");
    } finally {
      await c2.close();
    }
  });
  await step("pagos-despues", async () => { await go(p, "/pagos"); await mark(p, row("Sofía").last(), ""); await shot(p, "09-pagos-aprobado"); });

  // ── Citas ──
  await step("citas", async () => {
    await go(p, "/citas");
    await p.locator(".fc-toolbar button").nth(1).click(); await p.waitForTimeout(800);
    await shot(p, "10-citas");
    await sel(p, "Profesionales").click(); await p.waitForTimeout(500);
    await shot(p, "11-citas-filtro");
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
    await p.locator(".fc-event").filter({ hasText: "Sofía" }).first().click(); await p.waitForTimeout(700);
    await mark(p, p.getByRole("button", { name: "Cancelar cita" }), "");
    await shot(p, "12-citas-detalle");
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
    await mark(p, p.locator('[data-testid="AddRoundedIcon"], [data-testid="AddIcon"]').first(), "");
    await shot(p, "13-citas-nueva-boton", { clip: { x: 900, y: 0, width: 540, height: 160 } });
  });
  await step("agendar-paciente", async () => {
    await go(p, "/agendar-cita");
    await sel(p, "Servicio").click(); await p.getByRole("option", { name: "Terapia de lenguaje" }).click(); await p.waitForTimeout(300);
    await sel(p, "Profesional").click(); await p.getByRole("option", { name: "Andrés Villacís" }).click(); await p.waitForTimeout(300);
    await sel(p, "Paciente").click(); await p.waitForTimeout(400);
    await shot(p, "14-agendar-paciente");
    await p.getByRole("option", { name: "Carmen Vera" }).click(); await p.waitForTimeout(500);
    await p.getByRole("gridcell", { name: "16" }).click(); await p.waitForTimeout(700);
    await p.getByRole("button", { name: /10:00/ }).first().click(); await p.waitForTimeout(400);
    await mark(p, sel(p, "Paciente"), "1");
    await mark(p, p.getByRole("button", { name: "Proceder a pagar" }), "2");
    await shot(p, "15-agendar-paciente-listo");
  });

  // ── Recibos ──
  await step("recibos", async () => { await go(p, "/recibos"); await mark(p, p.locator('[data-testid="DownloadRoundedIcon"]').first(), ""); await shot(p, "16-recibos"); });

  // ── Pacientes ──
  await step("pacientes", async () => {
    await go(p, "/pacientes");
    await row("Daniel").first().click(); await settle(p, 600);
    await mark(p, row("Daniel").first().locator(".MuiSwitch-root"), "1");
    await mark(p, p.locator('[data-testid="EditIcon"], [data-testid="EditRoundedIcon"]').first(), "2");
    await mark(p, p.locator('[data-testid="AddRoundedIcon"], [data-testid="AddIcon"]').first(), "3");
    await shot(p, "17-pacientes");
    await go(p, "/registrarCliente"); await shot(p, "18-paciente-nuevo");
  });

  // ── Profesionales ──
  await step("profesionales", async () => {
    await go(p, "/profesionales");
    await row("Lucía").first().click(); await settle(p, 600);
    await mark(p, p.locator('[data-testid="AddRoundedIcon"], [data-testid="AddIcon"]').first(), "");
    await shot(p, "19-profesionales");
    await go(p, "/registrarProfesional"); await shot(p, "20-profesional-nuevo");
  });

  // ── Servicios ──
  await step("servicios", async () => {
    await go(p, "/servicios");
    await mark(p, p.locator('[data-testid="AddRoundedIcon"], [data-testid="AddIcon"]').first(), "1");
    await mark(p, p.getByRole("button", { name: /PDF/ }), "2");
    await mark(p, p.getByRole("button", { name: /Excel/ }), "2");
    await mark(p, row("Psicología").first().locator('[role="combobox"]'), "3");
    await mark(p, row("Psicología").first().locator('[data-testid*="Edit"]'), "4");
    await mark(p, row("Psicología").first().locator(".MuiSwitch-root"), "5");
    await shot(p, "21-servicios");
    await row("Psicología").first().locator('[role="combobox"]').click(); await p.waitForTimeout(400);
    await shot(p, "22-servicios-profesional");
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  });
  await step("servicio-nuevo", async () => {
    await go(p, "/crear-servicio");
    const inputs = p.locator("main input, input");
    await inputs.nth(0).fill("Musicoterapia");
    await inputs.nth(1).fill("20");
    await mark(p, p.getByRole("button", { name: /Crear/ }), "");
    await shot(p, "23-servicio-nuevo");
  });
  await step("servicio-editar", async () => {
    await go(p, "/servicios");
    await row("Psicología").first().locator('[data-testid*="Edit"]').click(); await settle(p);
    await shot(p, "24-servicio-editar");
  });
  // Quien retiró su consentimiento (lo hace cap-cliente, paso "retiro") sale con un escudo rojo junto al interruptor
  await step("retiro", async () => {
    await go(p, "/pacientes"); await settle(p, 800);
    const escudo = row("Rosa").first().locator('[data-testid="GppBadOutlinedIcon"]');
    await escudo.scrollIntoViewIfNeeded();
    await escudo.hover(); await p.waitForTimeout(700);
    await mark(p, escudo, "");
    await shot(p, "25-paciente-retiro");
  });
} finally {
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
