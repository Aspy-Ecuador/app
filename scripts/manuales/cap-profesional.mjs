// Capturas del manual del PROFESIONAL (terapeuta). Correr después de cap-staff.mjs.
import { browser, context, login, go, settle, shot as rawShot, mark, ASSETS, ventanaCita, recorteCita, cerrarCita, citasDe, esFutura, abrirCitaEnMes } from "./lib.mjs";

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
  // Avisos: alguien reservó, se confirmó o se canceló una cita, aprobaron un horario…
  await step("avisos", async () => {
    const zona = p.getByRole("region", { name: "Avisos" });
    await mark(p, zona.getByRole("list", { name: "Por revisar" }), "1");
    await mark(p, zona.getByRole("list", { name: "Avisos sin leer" }), "2");
    const c = await zona.boundingBox();
    await shot(p, "01b-avisos-panel", { fullPage: true, clip: { x: c.x - 28, y: c.y - 28, width: c.width + 56, height: c.height + 56 } });
    await go(p, "/avisos"); await settle(p, 900);
    await mark(p, p.getByRole("button", { name: /^Avisos/ }).first(), "1");
    await mark(p, p.getByRole("button", { name: "Marcar todos como leídos" }), "2");
    await shot(p, "01c-avisos");
    await go(p, "/dashboard"); await settle(p, 900);
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
  // Citas virtuales: pegar el enlace de la reunión (en una cita presencial) y cómo queda una cita virtual
  await step("cita-virtual", async () => {
    // Una cita agendada y virtual de Lucía (ella eligió la modalidad al crear el horario): entra a la reunión y edita el enlace
    const cita = (await citasDe("lucia.mendoza@aspy.com")).find((c) => c.appointment_status?.appointment_status_id === 2 && c.es_virtual && c.enlace_virtual && esFutura(c));
    await go(p, "/citas");
    await abrirCitaEnMes(p, cita);
    await mark(p, ventanaCita(p).getByRole("link", { name: "Entrar a la reunión" }), "");
    await shot(p, "17-cita-virtual", { clip: await recorteCita(p) });
    await p.getByRole("button", { name: "Cambiar el enlace" }).click(); await p.waitForTimeout(400);
    await mark(p, p.locator("#cita-enlace-virtual"), "1");
    await mark(p, p.getByRole("button", { name: "Guardar enlace" }), "2");
    await shot(p, "16-cita-enlace", { clip: await recorteCita(p) });
    await p.getByRole("button", { name: "Cancelar", exact: true }).click(); await p.waitForTimeout(300);
    await cerrarCita(p);
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
    // La modalidad no viene elegida; si es virtual se puede poner el enlace de una vez
    await p.locator("#horario-modalidad-virtual").click();
    await p.locator("#horario-enlace").fill("https://meet.google.com/abc-defg-hij");
    await mark(p, date, "1");
    await mark(p, times.nth(0), "2");
    await mark(p, times.nth(1), "3");
    await mark(p, p.getByRole("radiogroup"), "4");
    await mark(p, p.locator("#horario-enlace"), "5");
    await mark(p, p.getByRole("button", { name: /Guardar horario/ }), "6");
    await shot(p, "13-horario-nuevo");
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await settle(p, 1500);
    await shot(p, "14-horario-guardado");
    await p.getByRole("button", { name: /Aceptar|Cerrar|OK/i }).click().catch(() => {}); await settle(p, 600);
    await mark(p, p.getByRole("button", { name: /^Quitar el horario/ }).first(), "1");
    await mark(p, p.getByRole("button", { name: /^Cambiar la modalidad o el enlace/ }).first(), "2");
    await mark(p, p.getByText("Ocupado").first().locator("xpath=ancestor::div[2]"), "3", "#3A9AB8");
    await shot(p, "15-horarios-lista");
    // El horario recién creado está "por aprobar": se abre su editor (modalidad y enlace)
    const fila = p.getByText("Por aprobar").last().locator("xpath=ancestor::div[2]");
    await fila.scrollIntoViewIfNeeded();
    await fila.getByRole("button", { name: /^Cambiar la modalidad o el enlace/ }).click(); await p.waitForTimeout(400);
    await p.evaluate(() => scrollBy(0, 200)); await p.waitForTimeout(300);
    const caja = await fila.boundingBox();
    await mark(p, fila.getByText("Por aprobar"), "1");
    await mark(p, fila.getByRole("radiogroup"), "2");
    await shot(p, "15b-horario-editar", { clip: { x: Math.max(0, caja.x - 20), y: Math.max(0, caja.y - 60), width: Math.min(1440 - Math.max(0, caja.x - 20), caja.width + 40), height: Math.min(900 - Math.max(0, caja.y - 60), caja.height + 90) } });
    await fila.getByRole("button", { name: "Cancelar", exact: true }).click();
  });
} finally {
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
