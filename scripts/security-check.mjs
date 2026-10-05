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

const userPayload = (email, extra = {}) => ({
  email, password: "Secreta123", password_confirmation: "Secreta123",
  role_id: 3, accepted_privacy_policy: true, policy_version: "1.0",
  gender_id: 1, occupation_id: 1, marital_status_id: 1, education_id: 1,
  first_name: "Test", last_name: email.split("@")[0], birthdate: "1990-01-01",
  phone: { number: "0999999999", type: "movil" },
  address: { type: "casa", country_id: 1, state_id: 1, city_id: 1, primary_address: "Calle 1", secondary_address: "Calle 2" },
  identification: { type: "cedula", number: "09" + Math.floor(Math.random() * 1e8) },
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

const booking = (client, slot) => ({
  client_id: client.personId, professional_id: P1.personId, service_id: serviceId,
  worker_schedule_id: slot, payment_type: "transferencia", payment_file: "https://example.com/comprobante.pdf",
});
r = await call("POST", "/appointment/appointment-create", A.token, booking(A, slot1));
check("Cliente agenda su propia cita", r.status === 201, JSON.stringify(r.data));
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
r = await call("POST", "/appointment/appointment-create", B.token, booking(A, slot2));
check("Cliente B no puede agendar a nombre de A", r.status === 403, r.status);
r = await call("POST", "/appointment/appointment-create", B.token, { ...booking(B, slot1) });
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
r = await call("POST", "/appointment/create-report", P1.token, { appointmentId: apptA, file: "https://example.com/r.pdf", sign: "https://example.com/s.png" });
check("Profesional 1 crea el reporte de su cita", r.status === 201, JSON.stringify(r.data));
r = await call("GET", "/appointment-report", A.token);
check("Cliente A ve su reporte", r.data.length === 1);
r = await call("GET", "/appointment-report", B.token);
check("Cliente B no ve reportes ajenos", r.status === 200 && r.data.length === 0);
r = await call("GET", "/appointment-report", P2.token);
check("Profesional 2 no ve reportes ajenos", r.data.length === 0);
r = await call("GET", "/appointment-report", S.token);
check("Staff no ve reportes clínicos", r.data.length === 0);

r = await call("POST", "/appointment/appointment-create", B.token, booking(B, slot2));
const apptB = r.data?.appointment?.appointment_id;
check("Cliente B agenda en otro horario", r.status === 201, JSON.stringify(r.data));
r = await call("PUT", "/appointment/appointment-cancel", B.token, { appointmentId: apptB });
check("Cliente B cancela su cita (>24h)", r.status === 200, JSON.stringify(r.data));
r = await call("POST", "/appointment/appointment-create", S.token, booking(A, slot3));
check("Staff agenda una cita a nombre de un cliente", r.status === 201, JSON.stringify(r.data));

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

// ───────── Fuerza bruta ─────────
console.log("\nFuerza bruta");
let got429 = false;
for (let i = 0; i < 12; i++) {
  const x = await call("POST", "/login", null, { email: e("clienta"), password: "mala" + i });
  if (x.status === 429) { got429 = true; break; }
}
check("Login bloquea tras muchos intentos fallidos", got429);
r = await call("POST", "/appointment/appointment-create", A.token, { ...booking(A, slot3), payment_file: undefined });
check("Errores de validación no filtran detalles internos", r.status === 422 && !JSON.stringify(r.data).includes("SQLSTATE"));

console.log(`\nResultado: ${pass} OK, ${fail} fallos`);
if (fail) {
  console.log("Fallos:", failures);
  process.exit(1);
}
