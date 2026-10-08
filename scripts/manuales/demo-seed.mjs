import fs from "node:fs";
// Datos ficticios para las capturas del manual (SOLO contra el backend local de demo).
const API = "http://127.0.0.1:8002/api";
const PASS = "Aspy2026";

async function call(method, path, token, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (res.status >= 400) console.log("  !", method, path, res.status, JSON.stringify(data).slice(0, 200));
  return { status: res.status, data };
}
async function login(email, password = PASS) {
  const r = await call("POST", "/login", null, { email, password });
  // Las personas de demo ya aceptaron la política de privacidad; si no, en cada captura saldría
  // la ventana del primer ingreso (las cuentas creadas desde el panel no la tienen aceptada).
  // (cada quien con las casillas que le tocan según su rol; las dice el propio servidor)
  const estado = (await call("GET", "/consentimiento", r.data.access_token)).data;
  if (estado?.pendiente) await call("POST", "/consentimiento", r.data.access_token, { accepted_privacy_policy: true, policy_version: estado.version, consentimiento: { declaraciones: estado.declaraciones, representante: null } });
  const me = await call("GET", "/user", r.data.access_token);
  return { token: r.data.access_token, personId: me.data.person?.person_id };
}
const inDays = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
let ced = 912345670;
const user = (email, first, last, extra = {}) => ({
  email, password: PASS, password_confirmation: PASS, role_id: 3,
  accepted_privacy_policy: true, policy_version: "2.0", consentimiento: { declaraciones: ["tratamiento", "datos_sensibles", "transferencia"], representante: null },
  gender_id: extra.gender_id ?? 1, occupation_id: extra.occupation_id ?? 4, marital_status_id: extra.marital_status_id ?? 1, education_id: extra.education_id ?? 5,
  first_name: first, last_name: last, birthdate: extra.birthdate ?? "1988-04-12",
  phone: { number: "09" + String(91234560 + (ced % 100) * 1117).slice(0, 8), type: "movil" },
  address: { type: "casa", country_id: 1, state_id: 10, city_id: 46, primary_address: extra.street ?? "Av. Francisco de Orellana", secondary_address: extra.street2 ?? "Mz. 12 Villa 4" },
  identification: { type: "cedula", number: "0" + ced++ },
  ...extra,
});

const admin = await login("admin@aspy.com", "ADMIN");

// Personal y profesionales
const pros = [
  ["lucia.mendoza@aspy.com", "Lucía", "Mendoza", "Psicología clínica", 2, "Psicóloga clínica", 1, "1987-03-15"],
  ["andres.villacis@aspy.com", "Andrés", "Villacís", "Terapia de lenguaje", 1, "Terapeuta de lenguaje", 3, "1990-08-02"],
  ["gabriela.torres@aspy.com", "Gabriela", "Torres", "Terapia ocupacional", 2, "Terapeuta ocupacional", 3, "1992-11-20"],
];
for (const [email, f, l, specialty, g, title, occupation_id, birthdate] of pros)
  await call("POST", "/user-account/crear", admin.token, user(email, f, l, { role_id: 2, role: "professional", specialty, title, gender_id: g, occupation_id, birthdate, education_id: 6, marital_status_id: 2, street: "Cdla. Kennedy Norte", street2: "Calle B y Av. San Jorge" }));
await call("POST", "/user-account/crear", admin.token, user("recepcion@aspy.com", "María José", "Andrade", { role_id: 4, role: "staff", gender_id: 2, occupation_id: 9, birthdate: "1995-06-09", street: "Urdesa Central", street2: "Av. Víctor Emilio Estrada" }));

// Clientes (registro público)
const clients = [
  ["sofia.ramirez@gmail.com", "Sofía", "Ramírez", { gender_id: 2, occupation_id: 5, marital_status_id: 2, birthdate: "1986-02-18", street: "Alborada 6ta etapa", street2: "Mz. 615 Villa 9" }],
  ["daniel.cedeno@gmail.com", "Daniel", "Cedeño", { gender_id: 1, occupation_id: 6, marital_status_id: 2, birthdate: "1983-09-30", street: "Sauces 8", street2: "Mz. 470 Villa 2" }],
  ["valeria.paredes@gmail.com", "Valeria", "Paredes", { gender_id: 2, occupation_id: 9, marital_status_id: 5, birthdate: "1991-12-05", street: "Samanes 4", street2: "Mz. 2210 Villa 7" }],
  ["mateo.alvarado@gmail.com", "Mateo", "Alvarado", { gender_id: 1, occupation_id: 4, marital_status_id: 1, birthdate: "2004-05-14", education_id: 3, street: "Cdla. Garzota", street2: "Mz. 21 Villa 15" }],
];
for (const [email, f, l, extra] of clients) await call("POST", "/user-account/registro", null, user(email, f, l, extra));

// Servicios
const services = [
  ["Terapia de lenguaje", 25],
  ["Psicología", 30],
  ["Terapia ocupacional", 25],
  ["Evaluación integral", 40],
];
const sid = {};
for (const [name, price] of services) {
  const r = await call("POST", "/service", admin.token, { name, price });
  sid[name] = r.data.service_id;
}
const P = {};
for (const [email] of pros) P[email] = await login(email);
const C = {};
for (const [email] of clients) C[email] = await login(email);
const lucia = P["lucia.mendoza@aspy.com"], andres = P["andres.villacis@aspy.com"], gaby = P["gabriela.torres@aspy.com"];
const link = [
  [sid["Psicología"], lucia], [sid["Evaluación integral"], lucia],
  [sid["Terapia de lenguaje"], andres], [sid["Evaluación integral"], andres],
  [sid["Terapia ocupacional"], gaby],
];
for (const [service_id, p] of link) await call("POST", "/professional-service", admin.token, { service_id, professional_id: p.personId });

// Horarios: próximos 12 días, mañanas y tardes
const slots = new Map(); // key prof → array of ids
for (const p of [lucia, andres, gaby]) {
  const ids = [];
  for (let d = 1; d <= 12; d++) {
    const dow = new Date(Date.now() + d * 864e5).getDay();
    if (dow === 0 || dow === 6) continue;
    for (const h of ["09:00", "10:00", "11:00", "15:00", "16:00"]) {
      const end = String(+h.slice(0, 2) + 1).padStart(2, "0") + ":00";
      const r = await call("POST", "/professional/create-horario", p.token, { professional_id: p.personId, date: inDays(d), start_time: h, end_time: end, name: "Turno" });
      ids.push(r.data?.worker_schedule?.worker_schedule_id);
    }
  }
  slots.set(p, ids);
}

// El comprobante es un archivo privado: se sube con la sesión del paciente y la cita lleva su referencia
const COMPROBANTE = fs.readFileSync(new URL("./demo-assets/comprobante.png", import.meta.url));
const subirComprobante = async (token) => {
  const datos = new FormData();
  datos.append("tipo", "comprobante");
  datos.append("archivo", new Blob([COMPROBANTE], { type: "image/png" }), "comprobante.png");
  const res = await fetch(API + "/archivos", { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, body: datos });
  if (res.status !== 201) console.log("  ! no se pudo subir el comprobante", res.status, await res.text());
  return (await res.json()).archivo;
};
const book = async (client, prof, service, idx) =>
  (await call("POST", "/appointment/appointment-create", client.token, {
    client_id: client.personId, professional_id: prof.personId, service_id: service,
    worker_schedule_id: slots.get(prof)[idx], payment_type: "transferencia",
    payment_file: await subirComprobante(client.token),
  })).data?.appointment?.appointment_id;

const sofia = C["sofia.ramirez@gmail.com"], daniel = C["daniel.cedeno@gmail.com"], valeria = C["valeria.paredes@gmail.com"], mateo = C["mateo.alvarado@gmail.com"];
const appts = {
  a1: await book(sofia, lucia, sid["Psicología"], 0, 1),
  a2: await book(sofia, andres, sid["Terapia de lenguaje"], 2, 2),
  a3: await book(daniel, lucia, sid["Psicología"], 1, 3),
  a4: await book(valeria, gaby, sid["Terapia ocupacional"], 3, 4),
  a5: await book(mateo, andres, sid["Terapia de lenguaje"], 6, 5),
  a6: await book(sofia, lucia, sid["Evaluación integral"], 7, 6),
  a7: await book(daniel, gaby, sid["Terapia ocupacional"], 8, 7),
  a8: await book(valeria, lucia, sid["Psicología"], 12, 8),
  a9: await book(mateo, lucia, sid["Psicología"], 16, 9),
  a10: await book(sofia, lucia, sid["Psicología"], 20, 10),
  a11: await book(valeria, lucia, sid["Psicología"], 3, 11),
  a12: await book(daniel, lucia, sid["Evaluación integral"], 4, 12),
};
const staff = await login("recepcion@aspy.com");
for (const k of ["a1", "a2", "a3", "a4", "a6", "a7", "a8", "a10", "a11", "a12"]) await call("PUT", "/appointment/appointment-approve", staff.token, { appointmentId: appts[k] });
// Datos bancarios de EJEMPLO (los configura el Admin); se ven en la pantalla de pago
await call("PUT", "/bank-account", admin.token, { bank_name: "Banco de Ejemplo", account_type: "Corriente", account_number: "0000012345", holder_name: "Fundación Aspy Ecuador", holder_id: "0990000000001" });
// La cancelación de Valeria se hace antes de mover fechas (más de 24 h de anticipación)
await call("PUT", "/appointment/appointment-cancel", C["valeria.paredes@gmail.com"].token, { appointmentId: appts.a8 });
fs.writeFileSync(new URL("./appts.json", import.meta.url), JSON.stringify(appts));
// Días hacia atrás para dejar citas en el pasado (lo aplica backdate.php)
fs.writeFileSync(new URL("./backdate.json", import.meta.url), JSON.stringify({ [appts.a1]: 14, [appts.a3]: 12, [appts.a4]: 9, [appts.a7]: 5, [appts.a11]: 3, [appts.a12]: 1 }));
console.log(JSON.stringify(appts));
