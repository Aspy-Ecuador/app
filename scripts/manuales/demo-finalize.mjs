// Después de mover fechas al pasado: asistencia, reportes e inasistencias (la asistencia solo se marca si la cita ya empezó).
import fs from "node:fs";
const API = "http://127.0.0.1:8002/api";
async function call(method, path, token, body) {
  const res = await fetch(API + path, { method, headers: { Accept: "application/json", "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let data = null; try { data = await res.json(); } catch {}
  if (res.status >= 400) console.log("  !", method, path, res.status, JSON.stringify(data).slice(0, 200));
  return { status: res.status, data };
}
const login = async (email, password = "Aspy2026") => (await call("POST", "/login", null, { email, password })).data.access_token;
const appts = JSON.parse(fs.readFileSync(new URL("./appts.json", import.meta.url), "utf8"));
const lu = await login("lucia.mendoza@aspy.com"), ga = await login("gabriela.torres@aspy.com");
// El reporte es un archivo privado: se sube con la sesión de la profesional y el reporte lleva su referencia
const REPORTE = fs.readFileSync(new URL("./demo-assets/reporte.pdf", import.meta.url));
const subirReporte = async (token) => {
  const datos = new FormData();
  datos.append("tipo", "reporte");
  datos.append("archivo", new Blob([REPORTE], { type: "application/pdf" }), "reporte.pdf");
  const res = await fetch(API + "/archivos", { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, body: datos });
  if (res.status !== 201) console.log("  ! no se pudo subir el reporte", res.status, await res.text());
  return (await res.json()).archivo;
};
for (const k of ["a1", "a3"]) {
  await call("PUT", "/appointment/appointment-complete", lu, { appointmentId: appts[k] });
  await call("POST", "/appointment/create-report", lu, { appointmentId: appts[k], file: await subirReporte(lu), sign: "Lucía Mendoza" });
}
await call("PUT", "/appointment/appointment-complete", lu, { appointmentId: appts.a11 });
await call("PUT", "/appointment/appointment-missed", ga, { appointmentId: appts.a4 });
await call("PUT", "/appointment/appointment-complete", ga, { appointmentId: appts.a7 });
console.log("finalizado");
