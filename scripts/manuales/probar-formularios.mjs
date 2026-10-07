// Prueba de punta a punta de los formularios del panel: los llena como una persona, los envía y
// comprueba en el API que se guardó exactamente lo escrito. SOLO contra la BD de demo (SQLite).
// Uso (servidores de demo arriba y `bash reset.sh` antes; ver README.md):
//   WEB=http://localhost:5173 node probar-formularios.mjs
// Escribe datos de prueba: después corre `bash reset.sh` antes de rehacer capturas.
import fs from "node:fs";
import path from "node:path";
import { browser, context, login, settle, go, USERS, WEB, DIR } from "./lib.mjs";

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
const lista = (j) => (Array.isArray(j) ? j : j.data ?? []);
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
      await p.getByRole("button", { name: "Guardar" }).click();
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
    ok("Secretaría · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }

  // ═══ PROFESIONAL ═══
  {
    const { ctx, p, escrituras } = await sesion("Professional");
    await go(p, "/seleccionar-horario"); await settle(p, 800);
    const d = new Date(Date.now() + 40 * 864e5); while ([0, 6].includes(d.getDay())) d.setDate(d.getDate() + 1);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    await p.locator('[id="horario-fecha"]').fill(iso.split("-").reverse().join("/"));
    await p.locator('[id="horario-inicio"]').fill("07:00");
    await p.locator('[id="horario-fin"]').fill("08:00");
    await p.screenshot({ path: path.join(OUT, "pro-horario.jpg"), type: "jpeg", quality: 70 });
    await p.getByRole("button", { name: /Guardar horario/ }).click(); await settle(p, 1200);
    const envio = escrituras.find((e) => e.url.includes("create-horario"));
    ok("Profesional · nuevo horario: el servidor lo aceptó", envio && envio.status < 300, JSON.stringify(envio));
    ok("Profesional · nuevo horario: se envió la fecha elegida", envio?.cuerpo?.includes(iso), envio?.cuerpo);
    const yo = (await api("Professional", "/user")).person?.person_id;
    const turnos = lista(await api("Professional", "/worker-schedule")).filter((w) => w.professional?.person_id === yo && w.schedule?.date?.startsWith(iso));
    ok("Profesional · nuevo horario: quedó guardado 07:00–08:00", turnos.some((w) => w.schedule.start_time.startsWith("07:00") && w.schedule.end_time.startsWith("08:00")), JSON.stringify(turnos.map((w) => w.schedule)));

    // Editar sus propios datos (mismo formulario de usuario)
    const antes = lista(await api("Professional", "/person")).find((x) => x.person_id === yo);
    await go(p, `/editarProfesional/${yo}`); await settle(p, 800);
    await formularioUsuario(p, { "phone.number": "0981112233" }, "pro-editar-perfil");
    const despues = lista(await api("Professional", "/person")).find((x) => x.person_id === yo);
    ok("Profesional · editar perfil: teléfono actualizado", despues?.phone?.number === "0981112233", despues?.phone?.number);
    ok("Profesional · editar perfil: nombre, fecha y especialidad intactos", despues?.first_name === antes?.first_name && despues?.birthdate === antes?.birthdate && despues?.professional?.specialty === antes?.professional?.specialty);
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
    ok("Familia · ninguna escritura falló", escrituras.every((e) => e.status < 400), JSON.stringify(escrituras.filter((e) => e.status >= 400)));
    await ctx.close();
  }
} catch (e) {
  ok("La prueba terminó sin errores inesperados", false, e.message.split("\n")[0]);
} finally {
  await b.close();
}
const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length}/${resultados.length} comprobaciones correctas` + (fallas.length ? `; fallaron: ${fallas.map((f) => f.nombre).join(" | ")}` : ""));
process.exit(fallas.length ? 1 : 0);
