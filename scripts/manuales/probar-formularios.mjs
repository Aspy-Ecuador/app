// Prueba de punta a punta de los formularios del panel: los llena como una persona, los envía y
// comprueba en el API que se guardó exactamente lo escrito. SOLO contra la BD de demo (SQLite).
// Uso (servidores de demo arriba y `bash reset.sh` antes; ver README.md):
//   WEB=http://localhost:5173 node probar-formularios.mjs
// Escribe datos de prueba: después corre `bash reset.sh` antes de rehacer capturas.
import fs from "node:fs";
import path from "node:path";
import { browser, context, login, settle, go, ventanaCita, USERS, WEB, DIR } from "./lib.mjs";

const API = process.env.API_URL ?? "http://127.0.0.1:8002/api";
if (!/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(API) || !/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(WEB)) {
  console.error("Esta prueba escribe datos: solo corre contra servidores locales de demo.");
  process.exit(1);
}
const OUT = path.join(DIR, "out", "formularios");
fs.mkdirSync(OUT, { recursive: true });

const resultados = [];
const ok = (nombre, cond, detalle = "") => { resultados.push({ nombre, ok: !!cond, detalle }); console.log(`${cond ? "✔" : "✖"} ${nombre}${cond || !detalle ? "" : " → " + detalle}`); };
const sufijo = String(Date.now()).slice(-6);

// ── API ──
const tokens = {};
async function token(email, password) {
  const r = await fetch(API + "/login", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, password }) });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, token: j.access_token };
}
async function api(rol, ruta) {
  tokens[rol] ??= (await token(...USERS[rol])).token;
  const r = await fetch(API + ruta, { headers: { Authorization: `Bearer ${tokens[rol]}`, Accept: "application/json" } });
  return r.json();
}
async function apiPut(rol, ruta, cuerpo) {
  tokens[rol] ??= (await token(...USERS[rol])).token;
  const r = await fetch(API + ruta, { method: "PUT", headers: { Authorization: `Bearer ${tokens[rol]}`, Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
  return r.json();
}
const lista = (j) => (Array.isArray(j) ? j : j.data ?? []);
/** "AAAA-MM-DD" → "DD/MM/AAAA", como se escribe en el campo de fecha. */
const comoSeEscribe = (iso) => iso.split("-").reverse().join("/");
/** Suma días a una fecha "AAAA-MM-DD". */
const masDias = (iso, n) => { const [a, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10); };
/** Abre en la agenda (vista Mes) la cita de ese día cuyo texto contiene `texto`. */
async function abrirCita(p, fecha, texto) {
  await p.getByRole("button", { name: "Mes", exact: true }).click(); await p.waitForTimeout(600);
  const cita = p.locator(`.fc-daygrid-day[data-date="${fecha}"] .fc-event`).filter({ hasText: texto }).first();
  for (let i = 0; i < 3 && !(await cita.isVisible().catch(() => false)); i++) { await p.locator(".fc-next-button").click(); await p.waitForTimeout(500); }
  await cita.click(); await p.waitForTimeout(600);
}
const personaPorCorreo = async (correo) => lista(await api("Admin", "/person")).find((x) => x.user_account?.email === correo);

// ── Navegador ──
const b = await browser();
/** Sesión de un rol; anota las respuestas del API a las escrituras (POST/PUT/PATCH/DELETE). */
async function sesion(rol, opciones) {
  const ctx = await context(b, opciones);
  const p = await ctx.newPage();
  const escrituras = [];
  p.on("response", (r) => { const m = r.request().method(); if (m !== "GET" && m !== "OPTIONS" && r.url().startsWith(API)) escrituras.push({ m, url: r.url().replace(API, ""), status: r.status(), cuerpo: r.request().postData() }); });
  p.escrituras = escrituras;
  await login(p, ...USERS[rol]);
  return { ctx, p, escrituras };
}

/** Llena los campos visibles del paso actual con `valores` (por atributo name). Devuelve los nombres que vio. */
async function llenarPaso(p, valores) {
  const campos = await p.evaluate(() => [...document.querySelectorAll("form input, form select")].filter((e) => e.offsetParent && !e.disabled && e.type !== "file").map((e) => ({ tag: e.tagName, name: e.name || e.id })));
  for (const c of campos) {
    const v = valores[c.name];
    if (v === undefined) continue;
    const el = p.locator(`form [name="${c.name}"], form [id="${c.name}"]`).first();
    if (c.tag === "SELECT") await el.selectOption({ label: v });
    else await el.fill(v);
    await p.waitForTimeout(80);
  }
  return campos.map((c) => c.name);
}
/** Valores visibles del paso actual (en listas, el texto de la opción elegida). */
const leerPaso = (p) => p.evaluate(() => Object.fromEntries([...document.querySelectorAll("form input, form select")].filter((e) => e.offsetParent).map((e) => [e.name || e.id, e.tagName === "SELECT" ? e.options[e.selectedIndex]?.text ?? "" : e.value])));
/** Recorre los 3 pasos del formulario de usuario y lo envía. */
async function formularioUsuario(p, valores, foto) {
  const vistos = [];
  for (let paso = 0; paso < 3; paso++) {
    vistos.push(...(await llenarPaso(p, valores)));
    if (paso === 0 && foto) await p.screenshot({ path: path.join(OUT, foto + ".jpg"), type: "jpeg", quality: 70, fullPage: true });
    const boton = p.getByRole("button", { name: /^(Siguiente|Crear|Guardar)$/ });
    const ultimo = /Crear|Guardar/.test(await boton.innerText());
    await boton.click();
    if (ultimo) break;
    await p.waitForTimeout(500);
    const errores = await p.locator('form [role="alert"]').allInnerTexts();
    if (errores.length) throw new Error(`validación en el paso ${paso + 1}: ${errores.join(" | ")}`);
  }
  try { await p.getByRole("dialog").waitFor({ timeout: 20000 }); }
  catch {
    await p.screenshot({ path: path.join(OUT, "fallo-" + (foto ?? "formulario") + ".jpg"), type: "jpeg", quality: 70, fullPage: true });
    const alertas = await p.locator('form [role="alert"]').allInnerTexts();
    throw new Error(`no apareció la confirmación (${foto}). Validaciones: ${alertas.join(" | ") || "ninguna"}. Vistos: ${vistos.join(",")}. Últimas escrituras: ${JSON.stringify((p.escrituras ?? []).slice(-2))}`);
  }
  const mensaje = (await p.getByRole("dialog").innerText()).split("\n")[0];
  await p.getByRole("dialog").getByRole("button").first().click();
  await settle(p, 500);
  return { vistos, mensaje };
}

const persona = (rol, n) => ({
  first_name: "Prueba" + n,
  last_name: "Formulario",
  birthdate: "15/03/1990",
  role_id: rol,
  gender_id: "Femenino",
  occupation_id: "Docente",
  marital_status_id: "Casado/a",
  education_id: "Universitario",
  "identification.type": "Cédula",
  "identification.number": "09" + sufijo + n + "7",
  "phone.type": "Móvil",
  "phone.number": "0991" + sufijo,
  "address.type": "Casa",
  "address.country_id": "Ecuador",
  "address.state_id": "Guayas",
  "address.city_id": "Guayaquil",
  "address.primary_address": "Av. de Prueba 123",
  "address.secondary_address": "y Calle Demo",
  title: "Psicóloga clínica",
  specialty: "Terapia infantil",
  email: `prueba${n}.${sufijo}@demo.aspy`,
  password: "Prueba2026",
  password_confirmation: "Prueba2026",
});
/** Compara lo guardado con lo escrito. */
function comprobarPersona(nombre, guardada, v, roleId) {
  if (!guardada) return ok(nombre, false, "no aparece en el API");
  const esperado = {
    first_name: v.first_name, last_name: v.last_name, birthdate: "1990-03-15", gender_id: 2, occupation_id: 5, marital_status_id: 2, education_id: 5,
    "identification.number": v["identification.number"], "identification.type": "cedula", "phone.number": v["phone.number"], "phone.type": "movil",
    "address.state_id": 10, "address.city_id": 46, "address.primary_address": v["address.primary_address"], "user_account.role_id": roleId,
  };
  const leer = (o, ruta) => ruta.split(".").reduce((x, k) => x?.[k], o);
  const malos = Object.entries(esperado).filter(([k, e]) => String(leer(guardada, k) ?? "").slice(0, String(e).length) !== String(e)).map(([k, e]) => `${k}: esperado ${e}, guardado ${leer(guardada, k)}`);
  ok(nombre, malos.length === 0, malos.join("; "));
}

try {
  // ═══ ADMIN ═══
  {
    const { ctx, p, escrituras } = await sesion("Admin");
    // 1) Crear un profesional (usa todos los campos, incluidos título y especialidad)
    const v = persona("Profesional", 1);
    await go(p, "/nuevo-usuario");
    const { vistos, mensaje } = await formularioUsuario(p, v, "admin-nuevo-usuario");
    ok("Admin · crear usuario: el formulario mostró todos los campos", Object.keys(v).every((k) => vistos.includes(k)), "faltaron: " + Object.keys(v).filter((k) => !vistos.includes(k)).join(", "));
    ok("Admin · crear usuario: el servidor aceptó el envío", escrituras.some((e) => e.url.includes("/user-account") && e.status < 300), JSON.stringify(escrituras.slice(-2)));
    let guardada = await personaPorCorreo(v.email);
    comprobarPersona("Admin · crear usuario: se guardó lo escrito", guardada, v, 2);
    ok("Admin · crear usuario: título y especialidad", guardada?.professional?.title === v.title && guardada?.professional?.specialty === v.specialty, JSON.stringify(guardada?.professional));
    ok("Admin · crear usuario: la contraseña escrita sirve para entrar", (await token(v.email, v.password)).status === 200);
    console.log("   mensaje:", mensaje);

    // 2) Editarlo: los campos llegan cargados; se cambia solo el teléfono y la contraseña se deja vacía
    if (guardada) {
      await go(p, `/editarProfesional/${guardada.person_id}`);
      await settle(p, 800);
      const cargados = await leerPaso(p);
      ok("Admin · editar usuario: los datos llegan cargados (incluida la fecha)", cargados.first_name === v.first_name && cargados.birthdate === "15/03/1990" && cargados.gender_id === "Femenino", JSON.stringify(cargados));
      await formularioUsuario(p, { "phone.number": "0987654321" }, "admin-editar-usuario");
      const despues = await personaPorCorreo(v.email);
      ok("Admin · editar usuario: cambió solo el teléfono", despues?.phone?.number === "0987654321", despues?.phone?.number);
      comprobarPersona("Admin · editar usuario: el resto quedó igual", despues, { ...v, "phone.number": "0987654321" }, 2);
      ok("Admin · editar usuario: contraseña vacía = se conserva", (await token(v.email, v.password)).status === 200);
    }

    // 3) Servicio: crear y editar
    const servicio = "Servicio de prueba " + sufijo;
    await go(p, "/nuevo-servicio");
    await llenarPaso(p, { name: servicio, price: "37.5" });
    await p.screenshot({ path: path.join(OUT, "admin-nuevo-servicio.jpg"), type: "jpeg", quality: 70 });
    await p.getByRole("button", { name: "Crear" }).click();
    await p.getByRole("dialog").waitFor({ timeout: 20000 });
    await p.getByRole("dialog").getByRole("button").first().click(); await settle(p, 500);
    let s = lista(await api("Admin", "/service")).find((x) => x.name === servicio);
    ok("Admin · crear servicio: nombre y precio guardados", s && Number(s.price) === 37.5, JSON.stringify(s));
    if (s) {
      await go(p, `/servicios/${s.service_id}`); await settle(p, 600);
      const cargado = await leerPaso(p);
      ok("Admin · editar servicio: llega cargado", cargado.name === servicio, JSON.stringify(cargado));
      await llenarPaso(p, { price: "42" });
      await p.getByRole("button", { name: "Guardar" }).click();
      await p.getByRole("dialog").waitFor({ timeout: 20000 });
      await p.getByRole("dialog").getByRole("button").first().click(); await settle(p, 500);
      s = lista(await api("Admin", "/service")).find((x) => x.name === servicio);
      ok("Admin · editar servicio: precio actualizado", Number(s?.price) === 42, JSON.stringify(s));
    }

    // 4) Datos bancarios: cambiar, comprobar y restaurar
    const antes = await api("Admin", "/bank-account");
    const cuenta0 = antes.data ?? antes;
    await go(p, "/datos-bancarios");
    const guardarCuenta = async (c) => {
      for (const k of ["bank_name", "account_number", "holder_name", "holder_id"]) await p.locator(`[id="${k}"]`).fill(c[k]);
      await p.getByRole("combobox", { name: /Tipo de cuenta/ }).click();
      await p.getByRole("option", { name: c.account_type, exact: true }).click();
      await p.getByRole("button", { name: "Guardar" }).first().click(); // el segundo "Guardar" es del ajuste de comprobantes rechazados
      await p.getByText("Datos bancarios guardados").waitFor({ timeout: 15000 });
    };
    const nueva = { bank_name: "Banco de Prueba", account_type: "Ahorros", account_number: "22" + sufijo, holder_name: "Titular de Prueba", holder_id: "0999" + sufijo };
    await guardarCuenta(nueva);
    await p.screenshot({ path: path.join(OUT, "admin-datos-bancarios.jpg"), type: "jpeg", quality: 70 });
    const d = await api("Admin", "/bank-account");
    const cuenta1 = d.data ?? d;
    ok("Admin · datos bancarios: se guardó lo escrito", Object.keys(nueva).every((k) => cuenta1[k] === nueva[k]), JSON.stringify(cuenta1));
    await guardarCuenta(cuenta0);
    const r = await api("Admin", "/bank-account");
    ok("Admin · datos bancarios: restaurados", (r.data ?? r).account_number === cuenta0.account_number);
    // Ajuste: cuánto se conservan los comprobantes de pagos rechazados (misma pantalla, su propia tarjeta)
    const plazo = p.locator("#plazo-comprobante");
    const tarjetaPlazo = p.locator("form").filter({ has: plazo });
    const guardarPlazo = async (dias) => {
      await plazo.selectOption(dias);
      await tarjetaPlazo.getByRole("button", { name: "Guardar" }).click();
      await tarjetaPlazo.getByText("Ajuste guardado").waitFor({ timeout: 15000 });
      await p.waitForTimeout(300);
    };
    await guardarPlazo("7");
    const a1 = await api("Admin", "/ajustes");
    ok("Admin · comprobantes rechazados: se guardó el plazo elegido (7 días)", (a1.data ?? a1).comprobante_rechazado_dias === 7, JSON.stringify(a1));
    await guardarPlazo("1");
    const a2 = await api("Admin", "/ajustes");
    ok("Admin · comprobantes rechazados: plazo restaurado (1 día)", (a2.data ?? a2).comprobante_rechazado_dias === 1, JSON.stringify(a2));

    // Ajuste: hasta cuándo se crean horarios y si Secretaría puede crearlos (tercera tarjeta)
    const alcance = p.locator("#alcance-horarios");
    const tarjetaHorarios = p.locator("form").filter({ has: alcance });
    const interruptor = p.locator("#horarios-secretaria");
    const guardarHorarios = async () => {
      await tarjetaHorarios.getByRole("button", { name: "Guardar" }).click();
      await tarjetaHorarios.getByText("Ajuste guardado").waitFor({ timeout: 15000 });
      await p.waitForTimeout(300);
    };
    await alcance.selectOption("semana");
    await interruptor.check();
    await p.screenshot({ path: path.join(OUT, "admin-ajuste-horarios.jpg"), type: "jpeg", quality: 70, fullPage: true });
    await guardarHorarios();
    const h1 = await api("Admin", "/ajustes");
    ok("Admin · horarios: se guardó el alcance elegido (la semana en curso)", h1.horario_alcance === "semana", JSON.stringify(h1));
    ok("Admin · horarios: Secretaría quedó habilitada", h1.horario_secretaria === true, JSON.stringify(h1));
    ok("Admin · horarios: guardar este ajuste no tocó el de los comprobantes", h1.comprobante_rechazado_dias === 1, JSON.stringify(h1));
    // La demo trabaja con "el mes en curso y el siguiente"; Secretaría sigue habilitada para la prueba de abajo
    await alcance.selectOption("dos_meses");
    await guardarHorarios();
    const h2 = await api("Admin", "/ajustes");
    ok("Admin · horarios: alcance restaurado (el mes en curso y el siguiente)", h2.horario_alcance === "dos_meses" && h2.horario_secretaria === true, JSON.stringify(h2));
    ok("Admin · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }

  // ═══ SECRETARÍA ═══
  {
    const { ctx, p, escrituras } = await sesion("Staff");
    const v = persona(undefined, 2);
    delete v.role_id; delete v.title; delete v.specialty;
    await go(p, "/registrarCliente");
    await formularioUsuario(p, v, "staff-registrar-paciente");
    const guardada = await personaPorCorreo(v.email);
    comprobarPersona("Secretaría · registrar paciente: se guardó lo escrito", guardada, v, 3);
    ok("Secretaría · registrar paciente: puede entrar con su contraseña", (await token(v.email, v.password)).status === 200);

    // Primer ingreso de esa cuenta: nadie aceptó la política por ella, así que se le muestra y no puede seguir sin aceptarla
    {
      const c2 = await context(b);
      const p2 = await c2.newPage();
      await login(p2, v.email, v.password); await settle(p2, 800);
      const ventana = p2.getByRole("dialog");
      await ventana.waitFor({ timeout: 15000 });
      ok("Primer ingreso · aparece la política y no se puede aceptar sin leerla", await ventana.getByRole("button", { name: /Desliza para leerla/ }).isDisabled());
      await p2.keyboard.press("Escape"); await p2.waitForTimeout(400);
      ok("Primer ingreso · no se cierra con Escape", await ventana.isVisible());
      await ventana.locator(".MuiDialogContent-root").evaluate((el) => el.scrollTo(0, el.scrollHeight)); await p2.waitForTimeout(500);
      await p2.screenshot({ path: path.join(OUT, "primer-ingreso-politica.jpg"), type: "jpeg", quality: 70 });
      ok("Primer ingreso · leerla no basta: hay que marcar las casillas", await ventana.getByRole("button", { name: /Marca las casillas/ }).isDisabled());
      const casillas = ventana.locator('input[type="checkbox"]');
      for (let i = 0; i < (await casillas.count()); i++) await casillas.nth(i).check();
      await ventana.getByRole("button", { name: "Acepto", exact: true }).click();
      await ventana.waitFor({ state: "hidden", timeout: 15000 });
      const t = (await token(v.email, v.password)).token;
      const estado = await (await fetch(API + "/consentimiento", { headers: { Authorization: `Bearer ${t}`, Accept: "application/json" } })).json();
      ok("Primer ingreso · la aceptación quedó registrada", estado.pendiente === false, JSON.stringify(estado));
      await p2.reload(); await settle(p2, 1500);
      ok("Primer ingreso · no vuelve a pedirla", !(await p2.getByRole("dialog").isVisible().catch(() => false)));
      await c2.close();
    }

    const servicio = "Servicio staff " + sufijo;
    await go(p, "/crear-servicio");
    await llenarPaso(p, { name: servicio, price: "20" });
    await p.getByRole("button", { name: "Crear" }).click();
    await p.getByRole("dialog").waitFor({ timeout: 20000 });
    await p.getByRole("dialog").getByRole("button").first().click(); await settle(p, 500);
    const s = lista(await api("Admin", "/service")).find((x) => x.name === servicio);
    ok("Secretaría · crear servicio", s && Number(s.price) === 20, JSON.stringify(s));

    // Filtro de citas del panel: fecha (calendario propio), profesional y servicio
    await go(p, "/dashboard"); await settle(p, 600);
    // Cada tarjeta de cita muestra su fecha (AAAA-MM-DD)
    const FECHA = /^\s*\d{4}-\d{2}-\d{2}\s*$/;
    const fechas = async () => (await p.getByText(FECHA).allInnerTexts()).map((f) => f.trim());
    await p.getByText(FECHA).first().waitFor({ timeout: 15000 }).catch(() => {});
    const todas = await fechas();
    const total = todas.length;
    const tarjetas = async () => (await fechas()).length;
    const fecha = todas[0];
    if (fecha) {
      const [a, m, dd] = fecha.split("-");
      await p.locator('[id="filtro-fecha"]').fill(`${dd}/${m}/${a}`); await p.waitForTimeout(500);
      const conFecha = await fechas();
      const esperadas = todas.filter((f) => f === fecha).length;
      ok("Secretaría · filtro por fecha", conFecha.length === esperadas && conFecha.every((f) => f === fecha), `mostró ${conFecha.length}, esperadas ${esperadas} de ${total}`);
      await p.screenshot({ path: path.join(OUT, "staff-filtro.jpg"), type: "jpeg", quality: 70 });
      await p.getByRole("button", { name: "Borrar la fecha" }).click(); await p.waitForTimeout(400);
      ok("Secretaría · borrar la fecha del filtro", (await tarjetas()) === total);
    }
    await p.getByRole("combobox", { name: /^Profesional/ }).click();
    await p.getByRole("option").nth(1).click(); await p.waitForTimeout(400);
    const conPro = await tarjetas();
    ok("Secretaría · filtro por profesional", conPro > 0 && conPro <= total, `${conPro} de ${total}`);
    // Horarios de profesionales (el Admin lo habilitó arriba): aparece en el menú y se crea un turno para Lucía
    await p.reload(); await settle(p, 1200);
    ok("Secretaría · con el permiso del Admin, «Horarios» aparece en el menú", await p.getByRole("button", { name: "Horarios", exact: true }).first().isVisible().catch(() => false));
    const reglasSec = await api("Staff", "/professional/horario-reglas");
    await go(p, "/horarios"); await settle(p, 800);
    // Horarios por aprobar: los crearon los profesionales (la demo deja tres) y no se ofrecen hasta aprobarlos
    {
      const porAprobar = () => api("Staff", "/worker-schedule").then((r) => lista(r).filter((w) => w.aprobado === false));
      const pendientes = await porAprobar();
      const zona = p.getByRole("region", { name: "Horarios por aprobar" });
      ok("Secretaría · horarios por aprobar: la pantalla lista los que esperan revisión", pendientes.length >= 3 && (await zona.getByText(`${pendientes.length} por aprobar`).isVisible().catch(() => false)), `API: ${pendientes.length}`);
      const presencial = pendientes.find((w) => w.modalidad === "presencial");
      await zona.getByRole("button", { name: /^Aprobar el horario de Andrés/ }).first().click(); await settle(p, 1200);
      ok("Secretaría · horarios por aprobar: «Aprobar» lo publica", lista(await api("Staff", "/worker-schedule")).find((w) => w.worker_schedule_id === presencial?.worker_schedule_id)?.aprobado === true && (await porAprobar()).length === pendientes.length - 1);
      // Cambiar la modalidad antes de aprobar: el virtual que todavía no tiene enlace pasa a presencial
      const sinEnlace = pendientes.find((w) => w.modalidad === "virtual" && !w.enlace_virtual);
      await zona.getByRole("button", { name: /^Cambiar la modalidad o el enlace del horario de Gabriela/ }).first().click(); await p.waitForTimeout(300);
      await zona.getByRole("radio", { name: "Presencial" }).click();
      await p.screenshot({ path: path.join(OUT, "staff-por-aprobar.jpg"), type: "jpeg", quality: 70 });
      await zona.getByRole("button", { name: "Guardar", exact: true }).click(); await settle(p, 1200);
      const cambiado = lista(await api("Staff", "/worker-schedule")).find((w) => w.worker_schedule_id === sinEnlace?.worker_schedule_id);
      ok("Secretaría · horarios por aprobar: cambia la modalidad sin aprobarlo todavía", cambiado?.modalidad === "presencial" && cambiado?.aprobado === false, JSON.stringify({ m: cambiado?.modalidad, a: cambiado?.aprobado }));
    }
    await p.getByRole("combobox", { name: /^Profesional/ }).click();
    await p.getByRole("option", { name: "Lucía Mendoza" }).click(); await settle(p, 1200);
    await p.locator('[id="horario-fecha"]').fill(comoSeEscribe(reglasSec.hasta));
    await p.locator('[id="horario-inicio"]').fill("06:00");
    await p.locator('[id="horario-fin"]').fill("07:00");
    await p.locator("#horario-modalidad-presencial").click();
    await p.screenshot({ path: path.join(OUT, "staff-horarios.jpg"), type: "jpeg", quality: 70 });
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await settle(p, 1200);
    const lucia = lista(await api("Admin", "/person")).find((x) => x.user_account?.email === USERS.Professional[0]);
    const delDia = lista(await api("Staff", "/worker-schedule")).filter((w) => w.professional?.person_id === lucia?.person_id && w.schedule?.date?.startsWith(reglasSec.hasta));
    ok("Secretaría · horario de una profesional: quedó guardado 06:00–07:00 a su nombre", delDia.some((w) => w.schedule.start_time.startsWith("06:00") && w.schedule.end_time.startsWith("07:00")), JSON.stringify(delDia.map((w) => w.schedule)));

    // Filtros de las tablas: buscar, elegir de una lista y limpiar
    await go(p, "/pagos"); await settle(p, 600);
    const pagos = lista(await api("Staff", "/payment"));
    const filas = () => p.locator('.MuiDataGrid-row').count();
    await p.locator("#pagos-buscar").fill("ramirez sofia"); await p.waitForTimeout(400);
    const deSofia = pagos.filter((x) => `${x.client?.first_name} ${x.client?.last_name}` === "Sofía Ramírez").length;
    ok("Secretaría · filtro de pagos: busca por nombre sin tildes y en cualquier orden", deSofia > 0 && (await filas()) === deSofia && (await p.getByText(`Mostrando ${deSofia} de ${pagos.length}`).isVisible()), `filas ${await filas()}, esperadas ${deSofia} de ${pagos.length}`);
    {
      // Con el filtro puesto, el archivo trae solo las filas que se ven
      const bajar = async (boton) => { const [d] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: boton }).click()]); const ruta = path.join(OUT, d.suggestedFilename()); await d.saveAs(ruta); return { nombre: d.suggestedFilename(), bytes: fs.readFileSync(ruta) }; };
      const excel = await bajar(/Excel/);
      const filasDelExcel = excel.bytes.toString("latin1").split("<row r=").length - 1;
      ok("Secretaría · pagos: «Excel» descarga un .xlsx con las filas filtradas", /^pagos-aspy-[0-9-]+[.]xlsx$/.test(excel.nombre) && excel.bytes.subarray(0, 2).toString() === "PK" && filasDelExcel === deSofia + 1, `${excel.nombre} · filas ${filasDelExcel} (esperadas ${deSofia + 1})`);
      const pdf = await bajar(/PDF/);
      ok("Secretaría · pagos: «PDF» descarga el reporte", /^pagos-aspy-[0-9-]+[.]pdf$/.test(pdf.nombre) && pdf.bytes.subarray(0, 4).toString() === "%PDF", pdf.nombre);
    }
    await p.getByRole("combobox", { name: /^Aprobación/ }).click();
    await p.getByRole("option", { name: "Pendiente" }).click(); await p.waitForTimeout(400);
    const pendientes = pagos.filter((x) => `${x.client?.first_name} ${x.client?.last_name}` === "Sofía Ramírez" && x.payment_status_id === 2).length;
    ok("Secretaría · filtro de pagos: nombre + estado de aprobación", (await filas()) === pendientes, `filas ${await filas()}, esperadas ${pendientes}`);
    await p.screenshot({ path: path.join(OUT, "staff-pagos-filtros.jpg"), type: "jpeg", quality: 70 });
    await p.getByRole("button", { name: "Limpiar filtros" }).click(); await p.waitForTimeout(400);
    ok("Secretaría · filtro de pagos: «Limpiar filtros» vuelve a mostrar todos", (await p.getByText(new RegExp(`^${pagos.length} pagos$`)).isVisible().catch(() => false)) && (await p.locator("#pagos-buscar").inputValue()) === "");
    await p.getByRole("button", { name: "Hoy", exact: true }).click(); await p.waitForTimeout(400);
    const hoyEc = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
    const deHoy = pagos.filter((x) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date(x.creation_date)) === hoyEc).length;
    ok("Secretaría · filtro de pagos: «Hoy» deja los pagos de hoy (hora de Ecuador)", (await p.getByText(`Mostrando ${deHoy} de ${pagos.length}`).isVisible().catch(() => false)) && (await p.locator("#pagos-desde").inputValue()) === comoSeEscribe(hoyEc), `de hoy ${deHoy} de ${pagos.length}`);

    // Modalidad de una cita desde la agenda: Secretaría la pasa a virtual, le pone el enlace y la devuelve a presencial
    {
      const MEET = "https://meet.google.com/abc-defg-hij";
      const hoyEc = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
      const cita = lista(await api("Staff", "/appointment")).find((c) => c.appointment_status?.appointment_status_id === 2 && !c.es_virtual && c.worker_schedule?.schedule?.date?.slice(0, 10) > hoyEc);
      if (!cita) ok("Secretaría · modalidad de una cita: hay una cita agendada y presencial para probar", false);
      else {
        const enApi = async () => lista(await api("Staff", "/appointment")).find((c) => c.appointment_id === cita.appointment_id);
        await go(p, "/citas"); await settle(p, 800);
        await abrirCita(p, cita.worker_schedule.schedule.date.slice(0, 10), cita.client.first_name);
        await p.getByRole("button", { name: "Cambiar a virtual" }).click(); await p.waitForTimeout(300);
        await p.getByRole("button", { name: "Pasar a virtual" }).click();
        await p.getByRole("button", { name: "Poner el enlace" }).waitFor({ timeout: 15000 });
        let v = await enApi();
        ok("Secretaría · modalidad de una cita: la pasa a virtual (el enlace puede ponerse después)", v?.es_virtual === true && v?.enlace_virtual === null, JSON.stringify({ v: v?.es_virtual, e: v?.enlace_virtual }));
        await p.getByRole("button", { name: "Poner el enlace" }).click(); await p.waitForTimeout(300);
        await p.locator("#cita-enlace-virtual").fill(MEET);
        await p.getByRole("button", { name: "Guardar enlace" }).click();
        await p.getByRole("link", { name: "Entrar a la reunión" }).waitFor({ timeout: 15000 });
        ok("Secretaría · modalidad de una cita: le pone el enlace de la reunión", (await enApi())?.enlace_virtual === MEET);
        await p.getByRole("button", { name: "Cambiar el enlace" }).click(); await p.waitForTimeout(300);
        await p.getByRole("button", { name: "Pasar a presencial" }).click();
        await p.getByRole("button", { name: "Cambiar a virtual" }).waitFor({ timeout: 15000 });
        v = await enApi();
        ok("Secretaría · modalidad de una cita: la devuelve a presencial y el enlace se borra", v?.es_virtual === false && v?.enlace_virtual === null, JSON.stringify({ v: v?.es_virtual, e: v?.enlace_virtual }));
      }
    }

    // Se devuelve el permiso a como estaba (apagado): «Horarios» sigue en el menú para aprobar, pero ya no deja crear
    await apiPut("Admin", "/ajustes", { horario_secretaria: false });
    await p.reload(); await settle(p, 1200);
    ok("Secretaría · sin el permiso de crear, «Horarios» sigue en el menú (para aprobar)", (await p.getByRole("button", { name: "Horarios", exact: true }).first().isVisible().catch(() => false)) && (await api("Admin", "/ajustes")).horario_secretaria === false);
    await go(p, "/horarios"); await settle(p, 800);
    await p.getByRole("combobox", { name: /^Profesional/ }).click();
    await p.getByRole("option", { name: "Lucía Mendoza" }).click(); await settle(p, 1200);
    ok("Secretaría · sin el permiso de crear, ve los horarios pero no el formulario para crearlos", (await p.locator("#horario-fecha").count()) === 0 && (await p.getByText(/Horarios de Lucía Mendoza/i).first().isVisible().catch(() => false)) && (await p.getByText(/no habilitó que Secretaría cree o quite horarios/).isVisible().catch(() => false)));
    ok("Secretaría · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }

  // ═══ PROFESIONAL ═══
  {
    const { ctx, p, escrituras } = await sesion("Professional");
    await go(p, "/seleccionar-horario"); await settle(p, 800);
    // Hasta cuándo se pueden crear horarios lo decide el Admin: primero una fecha fuera del límite, luego la última permitida
    const reglas = await api("Professional", "/professional/horario-reglas");
    ok("Profesional · nuevo horario: la pantalla dice hasta qué fecha se puede crear", await p.getByText(`hasta el ${comoSeEscribe(reglas.hasta)}`, { exact: false }).isVisible().catch(() => false), JSON.stringify(reglas));
    await p.locator('[id="horario-fecha"]').fill(comoSeEscribe(masDias(reglas.hasta, 1)));
    await p.locator('[id="horario-inicio"]').fill("07:00");
    await p.locator('[id="horario-fin"]').fill("08:00");
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await p.waitForTimeout(800);
    ok("Profesional · nuevo horario: una fecha después del límite no se guarda y se explica", !escrituras.some((e) => e.url.includes("create-horario") && e.status < 300) && (await p.getByRole("alert").filter({ hasText: /límite lo define la administración/ }).first().isVisible().catch(() => false)), JSON.stringify(escrituras.slice(-1)));
    await p.getByRole("alert").getByRole("button").first().click().catch(() => {}); await p.waitForTimeout(300);
    const iso = reglas.hasta;
    await p.locator('[id="horario-fecha"]').fill(comoSeEscribe(iso));
    await p.locator('[id="horario-inicio"]').fill("07:00");
    await p.locator('[id="horario-fin"]').fill("08:00");
    // La modalidad no viene elegida: sin ella no se guarda
    const TEAMS = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_demo%40thread.v2/0";
    const cerrarAviso = async () => { await p.getByRole("alert").getByRole("button").first().click().catch(() => {}); await p.waitForTimeout(300); };
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await p.waitForTimeout(600);
    ok("Profesional · nuevo horario: sin elegir presencial o virtual no se guarda", !escrituras.some((e) => e.url.includes("create-horario") && e.status < 300) && (await p.getByRole("alert").filter({ hasText: /presencial o virtual/ }).first().isVisible().catch(() => false)));
    await cerrarAviso();
    await p.locator("#horario-modalidad-virtual").click();
    await p.locator("#horario-enlace").fill("https://ejemplo.com/reunion");
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await p.waitForTimeout(600);
    ok("Profesional · nuevo horario virtual: un enlace de otro sitio no se acepta", !escrituras.some((e) => e.url.includes("create-horario") && e.status < 300) && (await p.getByRole("alert").filter({ hasText: /Zoom, Microsoft Teams o Google Meet/ }).first().isVisible().catch(() => false)));
    await cerrarAviso();
    await p.locator("#horario-enlace").fill(TEAMS);
    await p.screenshot({ path: path.join(OUT, "pro-horario.jpg"), type: "jpeg", quality: 70 });
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await settle(p, 1200);
    const envio = escrituras.find((e) => e.url.includes("create-horario") && e.status < 300);
    ok("Profesional · nuevo horario: el servidor lo aceptó", !!envio, JSON.stringify(escrituras.filter((e) => e.url.includes("create-horario"))));
    ok("Profesional · nuevo horario: se envió la fecha elegida", envio?.cuerpo?.includes(iso), envio?.cuerpo);
    const yo = (await api("Professional", "/user")).person?.person_id;
    const turnos = lista(await api("Professional", "/worker-schedule")).filter((w) => w.professional?.person_id === yo && w.schedule?.date?.startsWith(iso));
    ok("Profesional · nuevo horario: quedó guardado 07:00–08:00", turnos.some((w) => w.schedule.start_time.startsWith("07:00") && w.schedule.end_time.startsWith("08:00")), JSON.stringify(turnos.map((w) => w.schedule)));

    const creado = turnos.find((w) => w.schedule.start_time.startsWith("07:00"));
    ok("Profesional · nuevo horario: quedó virtual, con su enlace y por aprobar", creado?.modalidad === "virtual" && creado?.enlace_virtual === TEAMS && creado?.aprobado === false, JSON.stringify({ m: creado?.modalidad, e: creado?.enlace_virtual, a: creado?.aprobado }));
    ok("Profesional · nuevo horario: la lista avisa que falta la aprobación", await p.getByText("Por aprobar").first().isVisible().catch(() => false));
    ok("Familia · un horario por aprobar todavía no se le ofrece", !lista(await api("Client", "/worker-schedule")).some((w) => w.worker_schedule_id === creado?.worker_schedule_id));
    // Mientras nadie lo reserve, el profesional puede cambiarle la modalidad
    await p.getByRole("button", { name: /^Cambiar la modalidad o el enlace del horario de 07:00 a 08:00/ }).first().click(); await p.waitForTimeout(300);
    await p.getByRole("radio", { name: "Presencial" }).last().click();
    await p.getByRole("button", { name: "Guardar", exact: true }).click(); await settle(p, 1200);
    const editado = lista(await api("Professional", "/worker-schedule")).find((w) => w.worker_schedule_id === creado?.worker_schedule_id);
    ok("Profesional · sus horarios: cambia la modalidad a presencial y el enlace se borra", editado?.modalidad === "presencial" && (editado?.enlace_virtual ?? null) === null, JSON.stringify({ m: editado?.modalidad, e: editado?.enlace_virtual }));

    // Editar sus propios datos (mismo formulario de usuario)
    const antes = lista(await api("Professional", "/person")).find((x) => x.person_id === yo);
    await go(p, `/editarProfesional/${yo}`); await settle(p, 800);
    await formularioUsuario(p, { "phone.number": "0981112233" }, "pro-editar-perfil");
    const despues = lista(await api("Professional", "/person")).find((x) => x.person_id === yo);
    ok("Profesional · editar perfil: teléfono actualizado", despues?.phone?.number === "0981112233", despues?.phone?.number);
    ok("Profesional · editar perfil: nombre, fecha y especialidad intactos", despues?.first_name === antes?.first_name && despues?.birthdate === antes?.birthdate && despues?.professional?.specialty === antes?.professional?.specialty);
    // Cita virtual: el profesional edita el enlace de su reunión desde la agenda; la modalidad, con la cita ya
    // reservada, la cambia Secretaría
    const hoyEc = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
    const misCitas = lista(await api("Professional", "/appointment")).filter((c) => c.appointment_status?.appointment_status_id === 2 && c.worker_schedule?.schedule?.date?.slice(0, 10) > hoyEc);
    const cita = misCitas.find((c) => c.es_virtual && c.enlace_virtual);
    if (!cita) ok("Profesional · cita virtual: hay una cita agendada y virtual para probar", false);
    else {
      const original = cita.enlace_virtual;
      const citaEnApi = async (rol) => lista(await api(rol, "/appointment")).find((c) => c.appointment_id === cita.appointment_id);
      await go(p, "/citas"); await settle(p, 800);
      await abrirCita(p, cita.worker_schedule.schedule.date.slice(0, 10), cita.client.first_name);
      await p.getByRole("button", { name: "Cambiar el enlace" }).click(); await p.waitForTimeout(300);
      await p.locator("#cita-enlace-virtual").fill("https://ejemplo.com/reunion");
      await p.getByRole("button", { name: "Guardar enlace" }).click(); await p.waitForTimeout(600);
      ok("Profesional · cita virtual: un enlace de otro sitio no se guarda y se explica", (await p.getByRole("alert").filter({ hasText: /Zoom, Microsoft Teams o Google Meet/ }).first().isVisible().catch(() => false)) && (await citaEnApi("Professional"))?.enlace_virtual === original);
      await p.locator("#cita-enlace-virtual").fill(TEAMS);
      await p.screenshot({ path: path.join(OUT, "pro-cita-enlace.jpg"), type: "jpeg", quality: 70 });
      await p.getByRole("button", { name: "Guardar enlace" }).click();
      const entrar = p.getByRole("link", { name: "Entrar a la reunión" });
      await p.waitForFunction((esperado) => [...document.querySelectorAll("a")].some((a) => a.textContent.includes("Entrar a la reunión") && a.getAttribute("href") === esperado), TEAMS, { timeout: 15000 });
      ok("Profesional · cita virtual: el enlace quedó guardado tal como se pegó", (await citaEnApi("Professional"))?.enlace_virtual === TEAMS, JSON.stringify((await citaEnApi("Professional"))?.enlace_virtual));
      ok("Profesional · cita virtual: el botón para entrar abre ese enlace en otra pestaña, sin dar acceso a esta", (await entrar.getAttribute("href")) === TEAMS && (await entrar.getAttribute("target")) === "_blank" && /noopener/.test((await entrar.getAttribute("rel")) ?? ""));
      const dueno = lista(await api("Admin", "/person")).find((x) => x.person_id === cita.client.person_id)?.user_account?.email;
      if (dueno === USERS.Client[0]) ok("Familia · cita virtual: con el pago aprobado recibe el enlace", (await citaEnApi("Client"))?.enlace_virtual === TEAMS);
      ok("Profesional · cita virtual: no se le ofrece pasarla a presencial (eso lo hace Secretaría)", (await p.getByRole("button", { name: "Cambiar el enlace" }).isVisible().catch(() => false)) && (await p.getByRole("button", { name: /presencial/i }).count()) === 0);
      // Se deja el enlace que tenía
      await p.getByRole("button", { name: "Cambiar el enlace" }).click(); await p.waitForTimeout(300);
      await p.locator("#cita-enlace-virtual").fill(original);
      await p.getByRole("button", { name: "Guardar enlace" }).click();
      await p.waitForFunction((esperado) => [...document.querySelectorAll("a")].some((a) => a.textContent.includes("Entrar a la reunión") && a.getAttribute("href") === esperado), original, { timeout: 15000 });
      ok("Profesional · cita virtual: el enlace original quedó restaurado", (await citaEnApi("Professional"))?.enlace_virtual === original);
    }
    const presencial = misCitas.find((c) => !c.es_virtual);
    if (presencial) {
      // La ventana de la cita anterior sigue abierta y tapa el calendario: se cierra antes de abrir otra
      await p.getByRole("button", { name: "Cerrar el detalle de la cita" }).click().catch(() => {});
      await go(p, "/citas"); await settle(p, 800);
      await abrirCita(p, presencial.worker_schedule.schedule.date.slice(0, 10), presencial.client.first_name);
      ok("Profesional · cita presencial: no puede pasarla a virtual y se le dice a quién pedirlo", (await p.getByText(/pide a Secretaría que cambie la modalidad/).isVisible().catch(() => false)) && (await p.getByRole("button", { name: "Cambiar a virtual" }).count()) === 0);
    }
    ok("Profesional · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }

  // ═══ FAMILIA (en celular) ═══
  {
    const { ctx, p, escrituras } = await sesion("Client", { width: 390, height: 800, mobile: true });
    const yo = (await api("Client", "/user")).person;
    await go(p, `/editarCliente/${yo.person_id}`); await settle(p, 800);
    await formularioUsuario(p, { "phone.number": "0975556677" }, "cliente-editar-perfil-celular");
    const despues = (await api("Client", "/user")).person;
    const tel = lista(await api("Admin", "/person")).find((x) => x.person_id === yo.person_id)?.phone?.number;
    ok("Familia · editar perfil en celular: teléfono actualizado", tel === "0975556677", tel);
    ok("Familia · editar perfil: nombre y fecha intactos", despues.first_name === yo.first_name && despues.birthdate === yo.birthdate);
    ok("Familia · sigue entrando con su contraseña", (await token(...USERS.Client)).status === 200);
    // Agendar: los horarios se ofrecen por modalidad (el profesional la elige y Secretaría la aprueba)
    {
      await go(p, "/agendar-cita"); await settle(p, 800);
      const ofrecidos = lista(await api("Client", "/worker-schedule"));
      ok("Familia · agendar: el servidor solo le entrega horarios aprobados y sin el enlace", ofrecidos.length > 0 && ofrecidos.every((w) => w.aprobado !== false && !("enlace_virtual" in w)));
      await p.getByRole("combobox", { name: /^Servicio/ }).click();
      await p.getByRole("option", { name: "Psicología" }).click();
      await p.getByRole("combobox", { name: /^Profesional/ }).click();
      await p.getByRole("option", { name: "Lucía Mendoza" }).click(); await p.waitForTimeout(500);
      const grupo = p.getByRole("group", { name: "Modalidad de la cita" });
      ok("Familia · agendar: puede ver todas, solo las presenciales o solo las virtuales", (await grupo.getByRole("button", { name: /^Presenciales/ }).isVisible()) && (await grupo.getByRole("button", { name: /^Virtuales/ }).isVisible()));
      // Un día en que la profesional tenga libres horarios de las dos modalidades
      const lucia = lista(await api("Admin", "/person")).find((x) => x.user_account?.email === USERS.Professional[0])?.person_id;
      const hoyEc = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
      const libres = ofrecidos.filter((w) => w.professional?.person_id === lucia && w.is_available && w.schedule?.date?.slice(0, 10) > hoyEc);
      const conLasDos = [...new Set(libres.map((w) => w.schedule.date.slice(0, 10)))].sort().find((d) => ["presencial", "virtual"].every((m) => libres.some((w) => w.schedule.date.slice(0, 10) === d && (w.modalidad ?? "presencial") === m)));
      if (conLasDos && conLasDos.slice(0, 7) !== hoyEc.slice(0, 7)) { await p.getByRole("button", { name: /mes siguiente|next month/i }).click(); await p.waitForTimeout(400); }
      await p.locator(".MuiPickersDay-root:not(.Mui-disabled)").filter({ hasText: new RegExp(`^${Number((conLasDos ?? "").slice(8))}$`) }).first().click(); await p.waitForTimeout(500);
      ok("Familia · agendar: las horas del día salen en dos apartados, presenciales y virtuales", (await p.getByRole("region", { name: "Citas presenciales" }).isVisible().catch(() => false)) && (await p.getByRole("region", { name: "Citas virtuales" }).isVisible().catch(() => false)));
      await p.screenshot({ path: path.join(OUT, "cliente-agendar-modalidad.jpg"), type: "jpeg", quality: 70, fullPage: true });
      await grupo.getByRole("button", { name: /^Virtuales/ }).click(); await p.waitForTimeout(400);
      await p.locator(".MuiPickersDay-root:not(.Mui-disabled)").first().click(); await p.waitForTimeout(500);
      ok("Familia · agendar: con «Virtuales» solo quedan las horas virtuales", (await p.getByRole("region", { name: "Citas virtuales" }).isVisible().catch(() => false)) && (await p.getByRole("region", { name: "Citas presenciales" }).count()) === 0);
    }
    ok("Familia · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }
  // ── Avisos: lo que hay por revisar, el aviso que llega con la pantalla abierta y la lista de cada cuenta ──
  {
    const pendiente = (r, clave) => (r.pendientes ?? []).find((x) => x.clave === clave)?.cantidad ?? 0;
    {
      const { ctx, p } = await sesion("Staff");
      await settle(p, 1200);
      const r = await api("Staff", "/avisos");
      const zona = p.getByRole("region", { name: "Avisos" });
      const tarjeta = (titulo) => zona.getByRole("button", { name: new RegExp(`^${titulo}: [0-9]+[.]`) });
      // El número de la tarjeta es el del servidor; si no hay nada de eso, la tarjeta no sale
      const coincide = async (titulo, clave) => {
        const esperado = pendiente(r, clave);
        if (esperado === 0) return (await tarjeta(titulo).count()) === 0;
        return Number(((await tarjeta(titulo).getAttribute("aria-label").catch(() => "")) ?? "").match(/: (\d+)\./)?.[1]) === esperado;
      };
      ok("Secretaría · avisos: la Vista General cuenta los pagos y los horarios por revisar igual que el servidor",
        pendiente(r, "pagos_por_revisar") > 0 && (await coincide("Pagos por revisar", "pagos_por_revisar")) && (await coincide("Horarios por aprobar", "horarios_por_aprobar")), JSON.stringify(r.pendientes));
      const porAtender = r.sin_leer + r.pendientes.filter((x) => x.accion).reduce((n, x) => n + x.cantidad, 0);
      ok("Secretaría · avisos: el contador del menú suma lo que le toca resolver", (await p.getByRole("button", { name: /^Avisos: / }).first().getAttribute("aria-label").catch(() => null)) === `Avisos: ${porAtender} por atender`, String(porAtender));
      await tarjeta("Pagos por revisar").click(); await p.waitForTimeout(700);
      ok("Secretaría · avisos: «Pagos por revisar» lleva a la pantalla de pagos", new URL(p.url()).pathname === "/pagos", p.url());
      await ctx.close();
    }
    {
      // Una cita por revisar de alguna familia de la demo (todas entran con la misma contraseña)
      const cita = lista(await api("Staff", "/appointment")).find((c) => c.appointment_status?.appointment_status_id === 1);
      const correo = cita ? lista(await api("Staff", "/person")).find((x) => x.person_id === cita.client.person_id)?.user_account?.email : null;
      ok("Familia · avisos: hay una cita por revisar para probar el aviso", !!correo);
      if (correo) {
        const ctx = await context(b);
        const p = await ctx.newPage();
        await login(p, correo, "Aspy2026"); await settle(p, 1200);
        await apiPut("Staff", "/appointment/appointment-approve", { appointmentId: cita.appointment_id });
        await p.evaluate(() => document.dispatchEvent(new Event("visibilitychange"))); // la web pregunta, como al volver a la pestaña
        const globo = p.getByRole("status").filter({ hasText: "Tu comprobante fue aprobado" });
        ok("Familia · avisos: al aprobarse su pago le aparece el aviso sin recargar la página", await globo.waitFor({ timeout: 8000 }).then(() => true, () => false));
        await globo.getByRole("button", { name: "Ver" }).click(); await p.waitForTimeout(1800);
        ok("Familia · avisos: «Ver» abre su cita en el calendario, ya Agendada", new URL(p.url()).pathname === "/dashboard" && (await ventanaCita(p).innerText().catch(() => "")).startsWith("Agendada"), p.url());
        const suyos = await (await fetch(API + "/avisos", { headers: { Authorization: `Bearer ${(await token(correo, "Aspy2026")).token}`, Accept: "application/json" } })).json();
        ok("Familia · avisos: el aviso que abrió quedó como leído", suyos.avisos.find((a) => a.tipo === "pago_aprobado" && a.enlace === `/dashboard?cita=${cita.appointment_id}`)?.leido === true);
        await ctx.close();
      }
    }
    {
      const { ctx, p } = await sesion("Professional");
      await go(p, "/avisos"); await settle(p, 900);
      const r = await api("Professional", "/avisos");
      ok("Profesional · avisos: la pantalla lista los mismos avisos que entrega el servidor", r.avisos.length > 0 && (await p.getByRole("list", { name: "Tus avisos" }).getByRole("listitem").count()) === r.avisos.length, String(r.avisos.length));
      if (r.sin_leer > 0) {
        await p.getByRole("button", { name: "Marcar todos como leídos" }).click(); await p.waitForTimeout(900);
        const d = await api("Professional", "/avisos");
        ok("Profesional · avisos: «Marcar todos como leídos» los marca en el servidor y la pantalla queda al día", d.sin_leer === 0 && d.avisos.every((a) => a.leido) && (await p.getByText("Al día", { exact: true }).isVisible().catch(() => false)), String(d.sin_leer));
      } else ok("Profesional · avisos: tenía avisos sin leer para probar «Marcar todos como leídos»", false);
      await ctx.close();
    }
  }
} catch (e) {
  ok("La prueba terminó sin errores inesperados", false, e.message.split("\n")[0]);
} finally {
  await b.close();
}
const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length}/${resultados.length} comprobaciones correctas` + (fallas.length ? `; fallaron: ${fallas.map((f) => f.nombre).join(" | ")}` : ""));
process.exit(fallas.length ? 1 : 0);
