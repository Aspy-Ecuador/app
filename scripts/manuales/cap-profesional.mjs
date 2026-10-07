// Capturas del manual del PROFESIONAL (terapeuta). Correr después de cap-staff.mjs.
import { browser, context, login, go, settle, shot as rawShot, mark, ASSETS } from "./lib.mjs";

const D = "profesional/";
const shot = (p, n, o) => rawShot(p, D + n, o);
const fails = [];
const ONLY = process.env.ONLY?.split(",");
const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };
const b = await browser();
const ctx = await context(b);
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && console.log("  consola:", m.text().slice(0, 160)));
const row = (text) => p.locator('[role="row"]').filter({ hasText: text });
// Próximo día hábil a N días
const weekday = (n) => { const d = new Date(Date.now() + n * 864e5); while ([0, 6].includes(d.getDay())) d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };

try {
  await login(p, "lucia.mendoza@aspy.com", "Aspy2026"); await settle(p, 1200);
  await step("panel", async () => {
    await mark(p, p.getByText("Citas sin marcar", { exact: false }), "1");
    await mark(p, p.getByText("Citas sin reportar", { exact: false }), "2");
    await shot(p, "01-panel", { fullPage: true });
  });
  await step("asistencia", async () => {
    // Marca los botones de la tarjeta de Daniel (la tarjeta es el ancestro que contiene "Paciente")
    await p.evaluate(() => { for (const b of document.querySelectorAll("button")) { let e = b; while (e && !e.textContent.includes("Paciente")) e = e.parentElement; if (e?.textContent.includes("Daniel Cedeño")) b.dataset.manual = b.textContent.trim(); } });
    const yes = p.locator('button[data-manual="Asistió"]'), no = p.locator('button[data-manual="No asistió"]');
    await mark(p, yes, "1");
    await mark(p, no, "2", "#3A9AB8");
    await shot(p, "02-asistencia-botones");
    await yes.click(); await p.waitForTimeout(600);
    await mark(p, p.getByRole("button", { name: "Sí, asistió" }), "");
    await shot(p, "03-asistencia-confirmar");
    await p.getByRole("button", { name: "Sí, asistió" }).click(); await settle(p, 2000);
    await p.getByRole("button", { name: /Aceptar/ }).click({ timeout: 1500 }).catch(() => {}); await settle(p, 1000);
    await shot(p, "04-asistencia-lista", { fullPage: true });
  });
  await step("reporte", async () => {
    await go(p, "/dashboard");
    await p.evaluate(() => { for (const b of document.querySelectorAll("button")) { let e = b; while (e && !e.textContent.includes("Paciente")) e = e.parentElement; if (e?.textContent.includes("Valeria Paredes") && b.textContent.includes("Nuevo Reporte")) b.dataset.manual = "reporte"; } });
    const rep = p.locator('button[data-manual="reporte"]');
    await mark(p, rep, "");
    await shot(p, "05-reporte-boton", { fullPage: true });
    await rep.click(); await settle(p, 1000);
    await mark(p, p.getByText("Subir reporte", { exact: true }), "");
    await shot(p, "06-reporte-vacio");
    await p.locator('input[type="file"]').setInputFiles(ASSETS + "/reporte.pdf"); await settle(p, 2500);
    await mark(p, p.getByRole("button", { name: /Enviar/ }), "");
    await shot(p, "07-reporte-cargado");
    await p.getByRole("button", { name: /Enviar/ }).click(); await settle(p, 2000);
    await shot(p, "08-reporte-enviado");
    await p.getByRole("button", { name: /Aceptar/ }).click().catch(() => {}); await settle(p);
  });
  await step("citas", async () => {
    await go(p, "/citas");
    await shot(p, "09-citas");
  });
  await step("pacientes", async () => {
    await go(p, "/pacientes");
    await row("Sofía").first().click(); await settle(p, 600);
    await mark(p, p.getByRole("button", { name: /Ver información completa/ }), "");
    await shot(p, "10-pacientes");
    await p.getByRole("button", { name: /Ver información completa/ }).click(); await settle(p, 1200);
    await mark(p, p.getByRole("button", { name: /Ver detalles/ }).last(), "");
    await shot(p, "11-historial");
    await p.getByRole("button", { name: /Ver detalles/ }).last().click(); await settle(p, 2500);
    await shot(p, "12-detalle-cita");
  });
  await step("horarios", async () => {
    await go(p, "/seleccionar-horario");
    // La fecha es el calendario propio (CampoFecha): se escribe como DD/MM/AAAA
    const date = p.locator('[id="horario-fecha"]');
    await date.fill(weekday(21).split("-").reverse().join("/"));
    const times = p.locator('input[type="time"]');
    await times.nth(0).fill("08:00");
    await times.nth(1).fill("09:00");
    await mark(p, date, "1");
    await mark(p, times.nth(0), "2");
    await mark(p, times.nth(1), "3");
    await mark(p, p.getByRole("button", { name: /Guardar horario/ }), "4");
    await shot(p, "13-horario-nuevo");
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await settle(p, 1500);
    await shot(p, "14-horario-guardado");
    await p.getByRole("button", { name: /Aceptar|Cerrar|OK/i }).click().catch(() => {}); await settle(p, 600);
    await mark(p, p.locator('[data-testid*="Delete"]').first(), "");
    await mark(p, p.getByText("Ocupado").first().locator("xpath=ancestor::div[2]"), "", "#3A9AB8");
    await shot(p, "15-horarios-lista");
  });
} finally {
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
