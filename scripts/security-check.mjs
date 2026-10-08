// Pruebas de seguridad/autorización de la API de Aspy.
//
// ⚠️ CREA usuarios, horarios y citas de prueba: úsalo SOLO contra una BD local desechable.
//    Por eso se niega a correr si API_URL no apunta a localhost.
//
// Uso (desde la raíz del repo):
//   1. BD local nueva:  cd aspy && touch database/test.sqlite
//      DB_CONNECTION=sqlite DB_DATABASE=$(pwd)/database/test.sqlite php artisan migrate:fresh --seed --force
//   2. Backend:         DB_CONNECTION=sqlite DB_DATABASE=$(pwd)/database/test.sqlite php artisan serve --port=8001
//   3. Pruebas:         node scripts/security-check.mjs
//      (opcional) API_URL=http://127.0.0.1:8001/api ADMIN_EMAIL=admin@aspy.com ADMIN_PASSWORD=ADMIN
//
// Requiere Node 18+ (fetch nativo). Termina con código 1 si alguna prueba falla.

const API = process.env.API_URL ?? "http://127.0.0.1:8001/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@aspy.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ADMIN";
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(API)) {
  console.error(`Abortado: API_URL (${API}) no es local. Este script escribe datos de prueba.`);
  process.exit(2);
}
const run = Date.now().toString().slice(-6);
let pass = 0, fail = 0;
const failures = [];

async function call(method, path, token, body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}
const check = (name, ok, extra = "") => {
  if (ok) { pass++; console.log("  PASS", name); }
  else { fail++; failures.push(name); console.log("  FAIL", name, extra); }
};
const denied = (r) => r.status === 403 || r.status === 404;

// Comprobantes y reportes: se suben a POST /archivos y la cita o el reporte llevan su referencia ("privado:123").
// El servidor revisa el contenido del archivo, no el nombre ni el tipo que declara quien lo sube.
const PDF = Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n");
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
async function subir(token, tipo, bytes = PDF, nombre = "archivo.pdf", mime = "application/pdf") {
  const datos = new FormData();
  datos.append("tipo", tipo);
  datos.append("archivo", new Blob([bytes], { type: mime }), nombre);
  const res = await fetch(API + "/archivos", {
    method: "POST",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: datos,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data, ref: data?.archivo };
}
async function bajar(token, ref) {
  const res = await fetch(API + "/archivos/" + String(ref).split(":")[1], {
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return { status: res.status, tipo: res.headers.get("content-type") ?? "", bytes: Buffer.from(await res.arrayBuffer()) };
}

// Consentimiento (ConsentimientoController): versión vigente y casillas que acepta cada quien, una por una
const POLITICA = "2.0";
const CONSENTE_PACIENTE = { declaraciones: ["tratamiento", "datos_sensibles", "transferencia"], representante: null };
const CONSENTE_PERSONAL = { declaraciones: ["tratamiento", "confidencialidad", "transferencia"], representante: null };

const userPayload = (email, extra = {}) => ({
  email, password: "Secreta123", password_confirmation: "Secreta123",
  role_id: 3, accepted_privacy_policy: true, policy_version: POLITICA, consentimiento: CONSENTE_PACIENTE,
  gender_id: 1, occupation_id: 1, marital_status_id: 1, education_id: 1,
  first_name: "Test", last_name: email.split("@")[0], birthdate: "1990-01-01",
  phone: { number: "0999999999", type: "movil" },
  address: { type: "casa", country_id: 1, state_id: 1, city_id: 1, primary_address: "Calle 1", secondary_address: "Calle 2" },
  identification: { type: "cedula", number: "09" + String(Math.floor(Math.random() * 1e8)).padStart(8, "0") },
  ...extra,
});
async function login(email, password = "Secreta123") {
  const r = await call("POST", "/login", null, { email, password });
  if (r.status !== 200) throw new Error(`login ${email}: ${r.status} ${JSON.stringify(r.data)}`);
  const me = await call("GET", "/user", r.data.access_token);
  return { token: r.data.access_token, roleId: me.data.role_id, personId: me.data.person?.person_id, userId: me.data.user_account_id };
}
const inDays = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

// ───────── Preparación ─────────
console.log("Preparando datos…");
const admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
const e = (n) => `${n}${run}@test.com`;

let r = await call("POST", "/user-account/registro", null, userPayload(e("clienta")));
if (r.status !== 201) throw new Error("registro A " + JSON.stringify(r.data));
await call("POST", "/user-account/registro", null, userPayload(e("clienteb")));
for (const [name, role_id, role] of [["prof1", 2, "professional"], ["prof2", 2, "professional"], ["staff", 4, "staff"]]) {
  r = await call("POST", "/user-account/crear", admin.token, userPayload(e(name), { role_id, role, specialty: "Psicología" }));
  if (r.status !== 201) throw new Error(`crear ${name} ${r.status} ${JSON.stringify(r.data)}`);
}
const A = await login(e("clienta"));
const B = await login(e("clienteb"));
const P1 = await login(e("prof1"));
const P2 = await login(e("prof2"));
const S = await login(e("staff"));

r = await call("POST", "/service", admin.token, { name: "Terapia " + run, price: 25 });
const serviceId = r.data.service_id;
await call("POST", "/professional-service", admin.token, { service_id: serviceId, professional_id: P1.personId });

const mkSlot = async (prof, day, start) => {
  const res = await call("POST", "/professional/create-horario", prof.token, {
    professional_id: prof.personId, date: inDays(day), start_time: start, end_time: start.replace(/^(\d+)/, (h) => String(+h + 1).padStart(2, "0")), name: "Turno",
  });
  return res;
};
r = await mkSlot(P1, 3, "09:00");
check("Profesional crea su propio horario", r.status === 201, JSON.stringify(r.data));
const slot1 = r.data?.worker_schedule?.worker_schedule_id;
const slot2 = (await mkSlot(P1, 4, "10:00")).data?.worker_schedule?.worker_schedule_id;
const slot3 = (await mkSlot(P1, 5, "11:00")).data?.worker_schedule?.worker_schedule_id;
// Turno de hoy a las 00:00 (ya empezó): la asistencia solo se marca cuando la cita ya empezó
const slotHoy = (await mkSlot(P1, 0, "00:00")).data?.worker_schedule?.worker_schedule_id;

// quien = la cuenta que agenda (sube el comprobante con su sesión); client = para quién es la cita
const booking = async (quien, client, slot) => ({
  client_id: client.personId, professional_id: P1.personId, service_id: serviceId,
  worker_schedule_id: slot, payment_type: "transferencia", payment_file: (await subir(quien.token, "comprobante")).ref,
});
// Un paciente no agenda un turno que ya empezó; secretaría sí puede registrar esa cita (alguien que llegó sin agendar)
r = await call("POST", "/appointment/appointment-create", A.token, await booking(A, A, slotHoy));
check("Cliente no puede agendar un turno que ya empezó", r.status === 422, `${r.status} ${JSON.stringify(r.data)}`);
const reservaA = await booking(S, A, slotHoy);
const comprobanteA = reservaA.payment_file; // lo subió Secretaría; pertenece al pago de A
r = await call("POST", "/appointment/appointment-create", S.token, reservaA);
check("Secretaría registra la cita de un turno que ya empezó", r.status === 201, JSON.stringify(r.data));
const apptA = r.data?.appointment?.appointment_id;

// ───────── Escalada de privilegios ─────────
console.log("\nEscalada de privilegios");
r = await call("POST", "/user-account/registro", null, userPayload(e("hacker"), { role_id: 1, role: "staff" }));
const hacker = await login(e("hacker"));
check("Registro público con role_id=1 queda como Cliente", hacker.roleId === 3, `role=${hacker.roleId}`);

r = await call("PUT", `/user-account/${B.personId}`, B.token, userPayload(e("clienteb"), { role_id: 1 }));
const B2 = await login(e("clienteb"));
check("Cliente no puede hacerse Admin editando su cuenta", B2.roleId === 3, `role=${B2.roleId}`);

r = await call("POST", "/user-account/crear", S.token, userPayload(e("adminfalso"), { role_id: 1 }));
check("Staff no puede crear administradores", r.status === 403, r.status);

const adminPerson = (await call("GET", "/user", admin.token)).data.person.person_id;
r = await call("PUT", `/user-account/${adminPerson}`, S.token, userPayload("admin@aspy.com", { role_id: 1 }));
check("Staff no puede editar la cuenta del Admin", r.status === 403, r.status);

// ───────── Acceso a datos de otros usuarios (IDOR) ─────────
console.log("\nAcceso a datos ajenos");
r = await call("PUT", `/user-account/${A.personId}`, B.token, userPayload(e("robado"), { password: "Hackeada123", password_confirmation: "Hackeada123" }));
check("Cliente B no puede cambiar email/clave de cliente A", r.status === 403, r.status);
r = await call("GET", `/person/${A.personId}`, B.token);
check("Cliente B no ve la ficha de A", denied(r), r.status);
r = await call("PUT", `/person/${A.personId}`, B.token, { first_name: "X" });
check("Cliente B no edita la ficha de A", denied(r), r.status);
r = await call("GET", `/user-account/${A.userId}`, B.token);
check("Cliente B no ve la cuenta de A", denied(r), r.status);

r = await call("GET", "/person", B.token);
const leaked = (r.data || []).filter((p) => p.person_id !== B.personId && (p.identification || p.address || p.user_account?.email));
check("Cliente: /person no expone cédula/dirección/email de otros", r.status === 200 && leaked.length === 0, `leaks=${leaked.length}`);
check("Cliente: /person incluye a los profesionales (para agendar)", (r.data || []).some((p) => p.person_id === P1.personId));

r = await call("GET", "/person", P2.token);
check("Profesional sin pacientes no ve fichas de clientes", (r.data || []).every((p) => p.person_id === P2.personId), JSON.stringify((r.data || []).map((p) => p.person_id)));
r = await call("GET", "/person", P1.token);
check("Profesional ve a su paciente", (r.data || []).some((p) => p.person_id === A.personId));
check("Profesional no ve clientes ajenos", !(r.data || []).some((p) => p.person_id === B.personId));

r = await call("GET", "/appointment", B.token);
check("Cliente B no ve citas de A", r.status === 200 && !r.data.some((a) => a.appointment_id === apptA));
r = await call("GET", "/appointment", A.token);
check("Cliente A ve su cita", r.data.some((a) => a.appointment_id === apptA));
r = await call("GET", "/appointment", P2.token);
check("Profesional 2 no ve citas de Profesional 1", !r.data.some((a) => a.appointment_id === apptA));
r = await call("GET", "/payment", B.token);
check("Cliente B no ve pagos de A", r.status === 200 && r.data.every((p) => p.client_id === B.personId));
r = await call("GET", "/appointment", S.token);
check("Staff ve todas las citas", r.data.some((a) => a.appointment_id === apptA));

// ───────── Acciones no permitidas ─────────
console.log("\nAcciones no permitidas");
r = await call("POST", "/appointment/appointment-create", B.token, await booking(B, A, slot2));
check("Cliente B no puede agendar a nombre de A", r.status === 403, r.status);
r = await call("POST", "/appointment/appointment-create", B.token, await booking(B, B, slotHoy));
check("No se puede reservar un horario ocupado", r.status === 422, r.status);
r = await call("PUT", "/appointment/appointment-approve", A.token, { appointmentId: apptA });
check("Cliente no puede aprobar su propio pago", r.status === 403, r.status);
r = await call("PUT", "/appointment/appointment-cancel", B.token, { appointmentId: apptA });
check("Cliente B no puede cancelar la cita de A", r.status === 403, r.status);
r = await call("PUT", "/appointment/appointment-complete", P2.token, { appointmentId: apptA });
check("Profesional 2 no marca asistencia de citas ajenas", r.status === 403, r.status);
r = await call("POST", "/appointment/create-report", A.token, { appointmentId: apptA, file: "x", sign: "y" });
check("Cliente no puede crear reportes clínicos", r.status === 403, r.status);
r = await call("POST", "/appointment/create-report", P2.token, { appointmentId: apptA, file: "x", sign: "y" });
check("Profesional 2 no crea reportes de citas ajenas", r.status === 403, r.status);
r = await call("POST", "/service", A.token, { name: "Gratis", price: 0 });
check("Cliente no crea servicios", r.status === 403, r.status);
r = await call("PATCH", `/service/${serviceId}/available`, A.token, { is_available: false });
check("Cliente no desactiva servicios", r.status === 403, r.status);
r = await call("PUT", "/professional-service/1", A.token, { professional_id: P2.personId });
check("Cliente no reasigna profesionales", r.status === 403, r.status);
r = await call("POST", "/professional/create-horario", P2.token, { professional_id: P1.personId, date: inDays(6), start_time: "08:00", end_time: "09:00", name: "x" });
check("Profesional 2 no crea horarios para Profesional 1", r.status === 403, r.status);
r = await call("POST", "/professional/create-horario", A.token, { professional_id: P1.personId, date: inDays(6), start_time: "08:00", end_time: "09:00", name: "x" });
check("Cliente no crea horarios", r.status === 403, r.status);
r = await call("DELETE", `/worker-schedule/${slot2}`, P2.token);
check("Profesional 2 no borra horarios de Profesional 1", r.status === 403, r.status);
r = await call("DELETE", `/worker-schedule/${slot2}`, A.token);
check("Cliente no borra horarios", r.status === 403, r.status);
r = await call("DELETE", `/payment/1`, A.token);
check("Cliente no borra pagos", r.status === 403, r.status);
r = await call("PATCH", `/person/${A.personId}/available`, B.token, { is_available: false });
check("Cliente no desactiva cuentas", r.status === 403, r.status);
r = await call("DELETE", `/user-account/${A.userId}`, P1.token);
check("Profesional no borra usuarios", r.status === 403, r.status);

// ───────── Flujos normales ─────────
console.log("\nFlujos normales");
r = await call("PUT", "/appointment/appointment-approve", S.token, { appointmentId: apptA });
check("Staff aprueba el pago", r.status === 200, JSON.stringify(r.data));
r = await call("PUT", "/appointment/appointment-complete", P1.token, { appointmentId: apptA });
check("Profesional 1 marca asistencia de su cita", r.status === 200, JSON.stringify(r.data));
const reporteA = (await subir(P1.token, "reporte")).ref;
r = await call("POST", "/appointment/create-report", P1.token, { appointmentId: apptA, file: reporteA, sign: "Profesional Uno" });
check("Profesional 1 crea el reporte de su cita", r.status === 201, JSON.stringify(r.data));
r = await call("GET", "/appointment-report", A.token);
check("Cliente A ve su reporte", r.data.length === 1);
r = await call("GET", "/appointment-report", B.token);
check("Cliente B no ve reportes ajenos", r.status === 200 && r.data.length === 0);
r = await call("GET", "/appointment-report", P2.token);
check("Profesional 2 no ve reportes ajenos", r.data.length === 0);
r = await call("GET", "/appointment-report", S.token);
check("Staff no ve reportes clínicos", r.data.length === 0);

r = await call("POST", "/appointment/appointment-create", B.token, await booking(B, B, slot2));
const apptB = r.data?.appointment?.appointment_id;
check("Cliente B agenda en otro horario", r.status === 201, JSON.stringify(r.data));
r = await call("PUT", "/appointment/appointment-cancel", B.token, { appointmentId: apptB });
check("Cliente B cancela su cita (>24h)", r.status === 200, JSON.stringify(r.data));
r = await call("POST", "/appointment/appointment-create", S.token, await booking(S, A, slot3));
check("Staff agenda una cita a nombre de un cliente", r.status === 201, JSON.stringify(r.data));
const apptFutura = r.data?.appointment?.appointment_id;
await call("PUT", "/appointment/appointment-approve", S.token, { appointmentId: apptFutura });
r = await call("PUT", "/appointment/appointment-complete", P1.token, { appointmentId: apptFutura });
check("No se marca asistencia de una cita que aún no empieza", r.status === 422, r.status);

// El pago guarda su monto: cambiar el precio del servicio no altera pagos anteriores
const pagoDe = async (appt) => {
  const pagos = (await call("GET", "/payment", S.token)).data;
  const citas = (await call("GET", "/appointment", S.token)).data;
  const cita = citas.find((c) => c.appointment_id === appt);
  return pagos.find((p) => p.payment_id === cita?.payment_id);
};
check("El pago guarda el monto cobrado", Number((await pagoDe(apptA))?.amount) === 25, JSON.stringify((await pagoDe(apptA))?.amount));
await call("PUT", `/service/${serviceId}`, admin.token, { name: "Terapia " + run, price: 40 });
check("Cambiar el precio no altera pagos anteriores", Number((await pagoDe(apptA))?.amount) === 25);

r = await call("PUT", `/user-account/${A.personId}`, A.token, userPayload(e("clienta"), { first_name: "Ana" }));
check("Cliente edita su propio perfil", r.status === 200, JSON.stringify(r.data).slice(0, 200));
r = await call("PUT", `/user-account/${P1.personId}`, S.token, userPayload(e("prof1"), { role_id: 2, role: "professional", specialty: "Psicología" }));
check("Staff edita a un profesional", r.status === 200, JSON.stringify(r.data).slice(0, 200));
r = await call("GET", "/me", A.token);
check("/me responde", r.status === 200, r.status);
for (const [who, u] of [["admin", admin], ["staff", S], ["profesional", P1], ["cliente", A]]) {
  const paths = ["/service", "/appointment", "/person", "/payment", "/professional-service", "/worker-schedule", "/appointment-report"];
  const codes = await Promise.all(paths.map((p) => call("GET", p, u.token).then((x) => x.status)));
  check(`Cargas iniciales del ${who} responden 200`, codes.every((c) => c === 200), codes.join(","));
}

// ───────── Comprobantes y reportes (archivos privados) ─────────
console.log("\nComprobantes y reportes (archivos privados)");
r = await subir(null, "comprobante");
check("Sin sesión no se sube ningún archivo", r.status === 401, r.status);
r = await bajar(null, comprobanteA);
check("Sin sesión no se abre ningún archivo", r.status === 401, r.status);

r = await bajar(A.token, comprobanteA);
check("Cliente A abre el comprobante de su pago", r.status === 200 && r.tipo.includes("application/pdf") && r.bytes.equals(PDF), `${r.status} ${r.tipo}`);
r = await bajar(S.token, comprobanteA);
check("Staff abre el comprobante para revisar el pago", r.status === 200, r.status);
r = await bajar(admin.token, comprobanteA);
check("Admin abre el comprobante", r.status === 200, r.status);
r = await bajar(B.token, comprobanteA);
check("Cliente B no abre el comprobante de A", r.status === 403, r.status);
r = await bajar(P1.token, comprobanteA);
check("El profesional de la cita no abre el comprobante de pago", r.status === 403, r.status);

r = await bajar(A.token, reporteA);
check("Cliente A abre el reporte de su cita", r.status === 200 && r.bytes.equals(PDF), r.status);
r = await bajar(P1.token, reporteA);
check("Profesional 1 abre el reporte que escribió", r.status === 200, r.status);
r = await bajar(admin.token, reporteA);
check("Admin abre el reporte", r.status === 200, r.status);
r = await bajar(S.token, reporteA);
check("Staff no abre el archivo de un reporte clínico", r.status === 403, r.status);
r = await bajar(B.token, reporteA);
check("Cliente B no abre el reporte de A", r.status === 403, r.status);
r = await bajar(P2.token, reporteA);
check("Profesional 2 no abre el reporte de un paciente ajeno", r.status === 403, r.status);
r = await call("GET", "/archivos/999999", A.token);
check("Un archivo que no existe responde 404", r.status === 404, r.status);

r = await subir(A.token, "reporte");
check("Cliente no sube reportes", r.status === 403, r.status);
r = await subir(S.token, "reporte");
check("Staff no sube reportes", r.status === 403, r.status);
r = await subir(P1.token, "comprobante");
check("Profesional no sube comprobantes", r.status === 403, r.status);
r = await subir(P1.token, "reporte", PNG, "reporte.png", "image/png");
check("El reporte solo puede ser un PDF", r.status === 422, r.status);
r = await subir(A.token, "comprobante", PNG, "comprobante.png", "image/png");
check("El comprobante puede ser una imagen", r.status === 201 && /^privado:\d+$/.test(r.ref ?? ""), `${r.status} ${JSON.stringify(r.data)}`);
const sueltoA = r.ref;
r = await subir(A.token, "comprobante", Buffer.from("<html><script>alert(1)</script></html>"), "comprobante.pdf", "application/pdf");
check("Un archivo disfrazado de PDF se rechaza (se revisa el contenido)", r.status === 422, r.status);
r = await subir(A.token, "comprobante", Buffer.from("MZ" + "x".repeat(200)), "comprobante.png", "image/png");
check("Un archivo que no es imagen ni PDF se rechaza", r.status === 422, r.status);

r = await bajar(S.token, sueltoA);
check("Un archivo recién subido solo lo abre quien lo subió", r.status === 403 && (await bajar(A.token, sueltoA)).status === 200, r.status);
const slot4 = (await mkSlot(P1, 6, "12:00")).data?.worker_schedule?.worker_schedule_id;
r = await call("POST", "/appointment/appointment-create", B.token, { ...(await booking(B, B, slot4)), payment_file: sueltoA });
check("No se agenda con un comprobante que subió otra persona", r.status === 422, r.status);
r = await call("POST", "/appointment/appointment-create", A.token, { ...(await booking(A, A, slot4)), payment_file: comprobanteA });
check("No se agenda con un comprobante que ya se usó en otro pago", r.status === 422, r.status);
r = await call("POST", "/appointment/appointment-create", A.token, { ...(await booking(A, A, slot4)), payment_file: "https://example.com/comprobante.pdf" });
check("Ya no se aceptan enlaces externos como comprobante", r.status === 422, r.status);
r = await call("POST", "/appointment/appointment-create", A.token, { ...(await booking(A, A, slot4)), payment_file: reporteA });
check("Un reporte no sirve como comprobante", r.status === 422, r.status);
r = await call("GET", "/worker-schedule/" + slot4, A.token);
check("Esos intentos no ocuparon el horario", r.data?.is_available === true || r.data?.is_available === 1, JSON.stringify(r.data)?.slice(0, 120));
r = await call("GET", "/payment", S.token);
check("Los listados no traen el contenido de ningún archivo", r.status === 200 && !JSON.stringify(r.data).includes("contenido"));

// ───────── Protección contra el abuso (que nadie pueda saturar el sistema ni llenar la base) ─────────
console.log("\nProtección contra el abuso");
r = await call("GET", "/archivos/resumen", null);
check("Consultar cuántos archivos tiene una cuenta exige sesión", r.status === 401, r.status);
for (let i = 0; i < 6; i++) await subir(B.token, "comprobante");
r = await call("GET", "/archivos/resumen", B.token);
check("Una cuenta guarda como máximo 5 archivos sin usar y el sistema le dice cuántos tiene", r.status === 200 && r.data?.sin_usar === 5 && r.data?.maximo_sin_usar === 5 && r.data?.hoy >= 6 && r.data?.maximo_por_dia === 30, JSON.stringify(r.data));
r = await subir(B.token, "comprobante");
check("Al subir otro se reemplaza el más antiguo (y lo informa)", r.status === 201 && r.data?.reemplazados === 1 && r.data?.sin_usar === 5, JSON.stringify(r.data));
r = await call("POST", "/login", null, { email: "nadie@test.com", password: "x", relleno: "a".repeat(300 * 1024) });
check("Una petición con un cuerpo exagerado se rechaza (413)", r.status === 413, r.status);
r = await mkSlot(P1, 800, "09:00");
check("No se crean horarios a más de un año", r.status === 422, r.status);
r = await call("POST", "/service", admin.token, { name: "Precio absurdo", price: 1e9 });
check("No se crean servicios con precios absurdos", r.status === 422, r.status);
{
  const raiz = await fetch(API.replace(/\/api$/, "/"));
  check("La dirección del servidor no abre sesiones ni deja cookies", raiz.status === 200 && !raiz.headers.get("set-cookie"), `${raiz.status} ${raiz.headers.get("set-cookie")}`);
  const limite = await fetch(API + "/login", { headers: { Accept: "application/json" } });
  check("Todo el API tiene un límite general de peticiones", Number(limite.headers.get("x-ratelimit-limit")) > 0, limite.headers.get("x-ratelimit-limit"));
}

// ───────── Manuales de uso (no son públicos) ─────────
console.log("\nManuales de uso");
const archivo = async (pase, ruta) => (await fetch(`${API}/manuales/archivo/${pase}/${ruta}`)).status;
r = await call("GET", "/manuales/acceso", null);
check("Sin sesión no se obtiene pase de manuales", r.status === 401, r.status);
check("Sin pase válido no se abre un manual", (await archivo("falso.falso", "manual-familias.html")) === 403);
const paseDe = async (u) => (await call("GET", "/manuales/acceso", u.token)).data;
const pc = await paseDe(A);
check("Cliente solo recibe el manual de familias", JSON.stringify(pc.manuales) === '["manual-familias"]', JSON.stringify(pc.manuales));
check("Cliente abre su manual, sus capturas y su PDF",
  [await archivo(pc.pase, "manual-familias.html"), await archivo(pc.pase, "img/familias/01-landing-ingresar.jpg"), await archivo(pc.pase, "pdf/manual-familias.pdf")].every((s) => s === 200));
check("Cliente no abre manuales de otros roles",
  [await archivo(pc.pase, "manual-personal.html"), await archivo(pc.pase, "img/personal/01-panel.jpg"), await archivo(pc.pase, "pdf/manual-administrador.pdf"), await archivo(pc.pase, "index.html")].every((s) => s === 403));
const pp = await paseDe(P1);
check("Profesional solo recibe el manual de profesionales", JSON.stringify(pp.manuales) === '["manual-profesional"]', JSON.stringify(pp.manuales));
check("Profesional no abre el manual de familias", (await archivo(pp.pase, "manual-familias.html")) === 403);
for (const [who, u] of [["Staff", S], ["Admin", admin]]) {
  const pt = await paseDe(u);
  check(`${who} recibe los 5 manuales y abre la portada`, pt.manuales.length === 5 && (await archivo(pt.pase, "index.html")) === 200, JSON.stringify(pt.manuales));
}
const [carga, firma] = pc.pase.split(".");
const datos = JSON.parse(Buffer.from(carga.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
const cargaFalsa = Buffer.from(JSON.stringify({ ...datos, m: ["manual-personal"] })).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
check("Un pase alterado se rechaza", (await archivo(`${cargaFalsa}.${firma}`, "manual-personal.html")) === 403);
check("No se puede salir de la carpeta de manuales", [await archivo(pc.pase, "../.env"), await archivo(pc.pase, "..%2F..%2F.env")].every((s) => s === 404 || s === 403));

// ───────── Datos bancarios (solo el Admin los edita) ─────────
console.log("\nDatos bancarios");
const cuenta = { bank_name: "Banco Prueba", account_type: "Corriente", account_number: "2100123456", holder_name: "Fundación Aspy Ecuador", holder_id: "0992345678001" };
r = await call("GET", "/bank-account", null);
check("Sin sesión no se ven los datos bancarios", r.status === 401, r.status);
for (const [who, u] of [["Cliente", A], ["Profesional", P1], ["Staff", S]]) {
  r = await call("PUT", "/bank-account", u.token, { ...cuenta, account_number: "999999999" });
  check(`${who} no puede cambiar los datos bancarios`, r.status === 403, r.status);
}
r = await call("PUT", "/bank-account", admin.token, cuenta);
check("Admin guarda los datos bancarios", r.status === 200, JSON.stringify(r.data).slice(0, 200));
r = await call("PUT", "/bank-account", admin.token, { ...cuenta, account_number: "abc123" });
check("Datos bancarios inválidos se rechazan", r.status === 422, r.status);
r = await call("GET", "/bank-account", A.token);
check("Un cliente ve la cuenta para transferir", r.status === 200 && r.data?.account_number === cuenta.account_number, JSON.stringify(r.data));

// ───────── Registro: identificación, teléfono y ocupación "Otra" ─────────
console.log("\nRegistro");
await new Promise((ok) => setTimeout(ok, 61_000)); // el registro público admite 5 por minuto por IP
r = await call("POST", "/user-account/registro", null, userPayload(e("cedulamala"), { identification: { type: "cedula", number: "09ABC12345" } }));
check("Cédula con letras se rechaza", r.status === 422, r.status);
r = await call("POST", "/user-account/registro", null, userPayload(e("telmalo"), { phone: { number: "09abc12345", type: "movil" } }));
check("Teléfono con letras se rechaza", r.status === 422, r.status);
r = await call("POST", "/user-account/registro", null, userPayload(e("otra1"), { occupation_id: 10 }));
check("Ocupación 'Otra' exige escribirla", r.status === 422, r.status);
await new Promise((ok) => setTimeout(ok, 61_000)); // el registro admite 5 por minuto
r = await call("POST", "/user-account/registro", null, userPayload(e("otra2"), { occupation_id: 10, occupation_other: "Diseñadora gráfica" }));
const otra = r.status === 201 ? await login(e("otra2")) : null;
const fichaOtra = otra ? (await call("GET", "/user", otra.token)).data : null;
check("Ocupación 'Otra' se guarda con su texto", fichaOtra?.person?.occupation_other === "Diseñadora gráfica", `${r.status} ${JSON.stringify(fichaOtra?.person?.occupation_other)}`);
// Política de privacidad: la acepta quien se registra; el alta desde el panel no la pide
const sinPolitica = (email, extra = {}) => { const { accepted_privacy_policy: _a, policy_version: _v, consentimiento: _c, ...resto } = userPayload(email, extra); return resto; };
r = await call("POST", "/user-account/registro", null, sinPolitica(e("sinpolitica")));
check("Registro público sin aceptar la política se rechaza", r.status === 422 && !!r.data?.errors?.accepted_privacy_policy, r.status);
r = await call("POST", "/user-account/crear", S.token, sinPolitica(e("altapanel")));
check("Alta desde el panel no exige la política", r.status === 201, `${r.status} ${JSON.stringify(r.data)}`);
// …pero esa persona la acepta ella misma en su primer ingreso (aplica a todos los roles)
const altaPanel = await login(e("altapanel"));
r = await call("GET", "/consentimiento", null);
check("Consultar el consentimiento exige sesión", r.status === 401, r.status);
r = await call("GET", "/consentimiento", altaPanel.token);
check("Cuenta creada desde el panel: política pendiente", r.status === 200 && r.data?.pendiente === true, JSON.stringify(r.data));
r = await call("GET", "/consentimiento", A.token);
check("Quien se registró por su cuenta ya la tiene aceptada", r.data?.pendiente === false, JSON.stringify(r.data));
r = await call("POST", "/consentimiento", altaPanel.token, { accepted_privacy_policy: false, policy_version: POLITICA, consentimiento: CONSENTE_PACIENTE });
check("No se registra un consentimiento sin aceptar", r.status === 422, r.status);
r = await call("POST", "/consentimiento", altaPanel.token, { accepted_privacy_policy: true, policy_version: "9.9", consentimiento: CONSENTE_PACIENTE });
check("No se acepta una versión que no es la vigente", r.status === 422, r.status);
r = await call("POST", "/consentimiento", altaPanel.token, { accepted_privacy_policy: true, policy_version: POLITICA });
check("No se acepta sin las casillas del consentimiento", r.status === 422, r.status);
r = await call("POST", "/consentimiento", altaPanel.token, { accepted_privacy_policy: true, policy_version: POLITICA, consentimiento: { declaraciones: ["tratamiento", "transferencia"], representante: null } });
check("Los datos de salud se autorizan con su propia casilla", r.status === 422, r.status);
r = await call("GET", "/consentimiento", S.token);
check("Al personal se le pide el compromiso de confidencialidad", r.data?.declaraciones?.includes("confidencialidad") && !r.data?.declaraciones?.includes("datos_sensibles"), JSON.stringify(r.data));
r = await call("POST", "/consentimiento", S.token, { accepted_privacy_policy: true, policy_version: POLITICA, consentimiento: CONSENTE_PACIENTE });
check("El personal no acepta con las casillas de un paciente", r.status === 422, r.status);
r = await call("POST", "/consentimiento", altaPanel.token, { accepted_privacy_policy: true, policy_version: POLITICA, consentimiento: CONSENTE_PACIENTE, user_id: 1, user_account_id: 1 });
const consPropio = (await call("GET", "/consentimiento", altaPanel.token)).data;
const consAjeno = (await call("GET", "/consentimiento", S.token)).data;
check("Cada quien acepta solo por su propia cuenta", r.status === 201 && consPropio?.pendiente === false && consAjeno?.pendiente === true, `${r.status} ${JSON.stringify(consPropio)} ${JSON.stringify(consAjeno)}`);
// Retirar el consentimiento: solo la propia persona (paciente), con confirmación; deshabilita su cuenta
r = await call("POST", "/consentimiento/retirar", null, { confirmar: true });
check("Retirar el consentimiento exige sesión", r.status === 401, r.status);
r = await call("POST", "/consentimiento/retirar", S.token, { confirmar: true });
check("El personal no retira su consentimiento en línea", r.status === 403, r.status);
r = await call("POST", "/consentimiento/retirar", altaPanel.token, {});
check("Retirar el consentimiento pide confirmación", r.status === 422, r.status);
r = await call("POST", "/consentimiento/retirar", altaPanel.token, { confirmar: true });
check("El paciente retira su consentimiento", r.status === 200 && r.data?.retirado === true, `${r.status} ${JSON.stringify(r.data)}`);
r = await call("GET", "/user", altaPanel.token);
check("Al retirarlo se cierran sus sesiones", r.status === 401, r.status);
r = await call("POST", "/login", null, { email: e("altapanel"), password: "Secreta123" });
check("…y su cuenta queda deshabilitada", r.status === 403 && r.data?.code === "cuenta_deshabilitada", r.status);
r = await call("GET", "/person", S.token);
check("Secretaría ve quién retiró su consentimiento", r.data?.some((p) => p.person_id === altaPanel.personId && !!p.consentimiento_retirado_el) && r.data?.filter((p) => !!p.consentimiento_retirado_el).length === 1, r.status);
check("Los demás no reciben ese dato", (await call("GET", "/person", A.token)).data?.every((p) => !("consentimiento_retirado_el" in p) || p.consentimiento_retirado_el == null));

// ───────── Cuentas deshabilitadas ─────────
console.log("\nCuentas deshabilitadas");
await call("POST", "/user-account/registro", null, userPayload(e("deshabilitada")));
const D = await login(e("deshabilitada"));
const paseD = (await call("GET", "/manuales/acceso", D.token)).data.pase;
check("La comprobación de sesión responde con sesión y rechaza sin ella",
  (await call("GET", "/sesion", D.token)).status === 204 && (await call("GET", "/sesion", null)).status === 401);
r = await call("PATCH", `/person/${D.personId}/available`, S.token, { is_available: false });
check("Staff deshabilita una cuenta", r.status === 200, r.status);
r = await call("GET", "/user", D.token);
check("La sesión abierta se corta y explica que la cuenta está deshabilitada", r.status === 403 && r.data?.code === "cuenta_deshabilitada", `${r.status} ${JSON.stringify(r.data)}`);
r = await call("GET", "/appointment", D.token);
check("Ese token ya no sirve para nada más", r.status === 401, r.status);
check("Un pase de manuales previo deja de funcionar", (await archivo(paseD, "manual-familias.html")) === 403);
r = await call("POST", "/login", null, { email: e("deshabilitada"), password: "Secreta123" });
check("Una cuenta deshabilitada no puede iniciar sesión", r.status === 403 && r.data?.code === "cuenta_deshabilitada" && !r.data?.access_token, r.status);
await call("PATCH", `/person/${D.personId}/available`, S.token, { is_available: true });
r = await call("POST", "/login", null, { email: e("deshabilitada"), password: "Secreta123" });
check("Al rehabilitarla vuelve a iniciar sesión", r.status === 200 && !!r.data?.access_token, r.status);
r = await call("PATCH", `/person/${S.personId}/available`, S.token, { is_available: false });
check("Staff no puede deshabilitar su propia cuenta", r.status === 422, r.status);
r = await call("PATCH", `/person/${admin.personId}/available`, admin.token, { is_available: false });
check("Admin no puede deshabilitar su propia cuenta", r.status === 422, r.status);

// ───────── Fuerza bruta ─────────
console.log("\nFuerza bruta");
let got429 = false;
for (let i = 0; i < 12; i++) {
  const x = await call("POST", "/login", null, { email: e("clienta"), password: "mala" + i });
  if (x.status === 429) { got429 = true; break; }
}
check("Login bloquea tras muchos intentos fallidos", got429);
r = await call("POST", "/appointment/appointment-create", A.token, { ...(await booking(A, A, slot3)), payment_file: undefined });
check("Errores de validación no filtran detalles internos", r.status === 422 && !JSON.stringify(r.data).includes("SQLSTATE"));

console.log(`\nResultado: ${pass} OK, ${fail} fallos`);
if (fail) {
  console.log("Fallos:", failures);
  process.exit(1);
}
