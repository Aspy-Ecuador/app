// Captura del aviso "Tienes N archivos subidos sin usar" en la pantalla de pago (manual de familias).
// Deja dos comprobantes sin usar en la cuenta de demo de Sofía (si no los tiene) y abre el pago.
// Requiere los servidores de demo y `bash reset.sh` antes (ver README.md). No modifica citas ni pagos.
import fs from "node:fs";
import { browser, context, login, go, settle, shot, mark, ASSETS } from "./lib.mjs";

const API = process.env.API_URL ?? "http://127.0.0.1:8002/api";
const J = { Accept: "application/json" };
const entrar = async (email, password = "Aspy2026") =>
  (await (await fetch(API + "/login", { method: "POST", headers: { ...J, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })).json()).access_token;
const leer = async (ruta, t) => (await fetch(API + ruta, { headers: { ...J, Authorization: "Bearer " + t } })).json();

const sofia = await entrar("sofia.ramirez@gmail.com"), lucia = await entrar("lucia.mendoza@aspy.com");
for (let n = (await leer("/archivos/resumen", sofia)).sin_usar; n < 2; n++) {
  const datos = new FormData();
  datos.append("tipo", "comprobante");
  datos.append("archivo", new Blob([fs.readFileSync(ASSETS + "/comprobante.png")], { type: "image/png" }), "comprobante.png");
  await fetch(API + "/archivos", { method: "POST", headers: { ...J, Authorization: "Bearer " + sofia }, body: datos });
}
const profesional = (await leer("/user", lucia)).person.person_id;
const servicio = (await leer("/service", sofia)).find((s) => s.name === "Psicología").service_id;
const hoy = new Date().toISOString().slice(0, 10);
const turno = (await leer("/worker-schedule", sofia)).find((w) => (w.professional?.person_id ?? w.professional_id) === profesional && w.is_available && String(w.schedule?.date).slice(0, 10) > hoy);

const b = await browser();
try {
  const ctx = await context(b);
  const p = await ctx.newPage();
  await login(p, "sofia.ramirez@gmail.com", "Aspy2026"); await settle(p, 1000);
  await go(p, `/pago/${servicio}/${turno.worker_schedule_id}/${profesional}`); await settle(p, 1200);
  const aviso = p.getByRole("status").filter({ hasText: "sin usar" });
  await aviso.scrollIntoViewIfNeeded();
  await mark(p, aviso, "");
  await shot(p, "cliente/38-aviso-archivos");
} finally {
  await b.close();
}
