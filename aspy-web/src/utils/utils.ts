import type { Appointment } from "@/typesResponse/Appointment";
import type { Person } from "@/typesResponse/Person";
import type { Service } from "@/typesResponse/Service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
// Logo oficial de ASPY (el mismo del sitio), en PNG para los PDF y el Excel
import logoDocumentos from "@assets/landing/logo-aspy-documentos.png";
import { crearXlsx } from "./xlsx";
import type { PageViewsBarChartProps } from "@/components/admin/PageViewsBarChart";
import type { StatCardProps } from "@/components/admin/StatCard";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";
import type { Payment } from "@/typesResponse/Payment";
import type { FlattenedReceipt } from "@/types/FlattenedReceipt";
import type { AppointmentWithReports } from "@/types/AppointmentWithReports";

type TotalIngresosMensual = {
  total: number;
};

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
    [key: string]: number;
  };
}

export function TotalIngresosMensual(data: number[]): TotalIngresosMensual {
  return { total: data.reduce((total, numero) => total + numero, 0) };
}

// FINAL
export function getService(data: any, service_id: number): Service {
  const services: Service[] = data.services;
  const service = services.find((service) => service.service_id === service_id);
  if (!service)
    throw new Error(`No se encontró el servicio con ID ${service_id}`);
  return service;
}

// FINAL
export function getIncome(data: any): number[] {
  const payments: Payment[] = data.payments ?? [];
  const currentYear = Number(hoyEcuador().slice(0, 4));
  const monthlyIncome = Array(12).fill(0);

  payments.forEach((payment) => {
    if (payment.payment_status.payment_status_id !== 3) {
      // Año y mes del pago en la hora de Ecuador (el servidor lo envía en hora universal)
      const [anio, mes] = fechaLocal(payment.creation_date).split("-").map(Number);

      if (anio !== currentYear) return;

      const month = mes - 1;
      const price = montoPago(payment);

      monthlyIncome[month] += price;
    }
  });

  // Redondear solo al final (mejor práctica)
  return monthlyIncome.map((value) => Number(value.toFixed(2)));
}

// FINAL
export function getDataAppointment(data: any): PageViewsBarChartProps {
  const appointments: Appointment[] = data.appointments ?? [];
  const currentYear = Number(hoyEcuador().slice(0, 4));

  const scheduled = Array(12).fill(0);
  const completed = Array(12).fill(0);
  const cancelled = Array(12).fill(0);
  const saved = Array(12).fill(0);

  appointments.forEach((appointment) => {
    const [anio, mes] = fechaLocal(appointment.creation_date).split("-").map(Number);

    // Solo contamos citas del año actual
    if (anio !== currentYear) return;

    const month = mes - 1; // 0–11
    // Por id (1 Guardada, 2 Agendada, 3 Asistió, 5 Cancelada): los nombres cambian entre bases
    const estado = Number(appointment.appointment_status?.appointment_status_id);
    if (estado === 2) {
      scheduled[month] += 1;
    } else if (estado === 3) {
      completed[month] += 1;
    } else if (estado === 5) {
      cancelled[month] += 1;
    } else if (estado === 1) {
      saved[month] += 1;
    }
  });

  const total =
    scheduled.reduce((a, b) => a + b, 0) +
    completed.reduce((a, b) => a + b, 0) +
    cancelled.reduce((a, b) => a + b, 0);
  return { total, scheduled, completed, cancelled, saved };
}

// FINAL
export function getDataCard(data: any): StatCardProps[] {
  const users: Person[] = data.persons ?? [];
  const appointments: Appointment[] = data.appointments ?? [];

  // filtros
  const pacientes = users.filter((u) => u.user_account.role.name === "Client");
  const profesionales = users.filter(
    (u) => u.user_account.role.name === "Professional",
  );
  return [
    {
      title: "Usuarios",
      value: users.length.toString(),
    },
    {
      title: "Citas",
      value: appointments.length.toString(),
    },
    {
      title: "Pacientes",
      value: pacientes.length.toString(),
    },
    {
      title: "Profesionales",
      value: profesionales.length.toString(),
    },
  ];
}

//FINAL
export function translateRol(rol: string): string {
  switch (rol.trim().toLowerCase()) {
    case "admin":
      return "Administrador/a";
    case "professional":
      return "Profesional";
    case "client":
      return "Cliente";
    case "staff":
      return "Secretario/a";
    default:
      return "Desconocido";
  }
}

// FINAL
export function getAppointmentProfessional(
  proffesional_id: number,
  data: any,
): Appointment[] {
  if (!data) {
    return [];
  }

  const appointments: Appointment[] = data.appointments ?? [];

  if (proffesional_id === 0) {
    return appointments;
  }

  return appointments.filter(
    (appointment) => appointment.professional.user_id === proffesional_id,
  );
}

// FINAL
export function getNextAppointments(data: Appointment[]): Appointment[] {
  if (!data) return [];

  // "Hoy" en la hora de Ecuador: con la hora universal, desde las 19:00 las citas de hoy desaparecían
  const todayStr = hoyEcuador();
  return data.filter(
    (app) => app.worker_schedule.schedule.date >= todayStr, //&&
    //app.appointment_status.appointment_status_id !== 3,
  );
}

// FINAL
export function getAge(birthdate: string): number {
  const [anioActual, mesActual, diaActual] = hoyEcuador().split("-").map(Number);
  const [year, month, day] = String(birthdate).slice(0, 10).split("-").map(Number);
  let age = anioActual - year;

  // Ajustar si aún no ha cumplido años este año
  if (mesActual < month || (mesActual === month && diaActual < day)) {
    age--;
  }

  return age;
}

// FINAL
export function getAppointmentsReport(
  appointmentsReport: AppointmentReport[],
  appointments: Appointment[],
  user_id: number,
  cita_id: number,
): AppointmentWithReports {
  const appointment = appointments.find(
    (a) => a.appointment_id === cita_id && a.client.user_id === user_id,
  )!;

  const report = appointmentsReport.find(
    (r) => r.appointment_id === appointment.appointment_id,
  )!;

  return {
    ...appointment,
    report,
  };
}

// FINAL
export function getReportsUser(
  appointmentsReport: AppointmentReport[],
  client_id: number,
  appointments: Appointment[],
): AppointmentWithReports[] {
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.client.person_id === client_id,
  );

  return filteredAppointments.map((appointment) => {
    const report =
      appointmentsReport.find(
        (report) => report.appointment_id === appointment.appointment_id,
      ) || null;

    return {
      ...appointment,
      report,
    };
  });
}

// FINAL
export const getPayment = (id: number, data: Payment[]): Payment => {
  //const payments: PaymentResponse[] = getPayments(data);
  if (!data) {
    throw new Error("No se encontraron pagos en los datos proporcionados.");
  }
  const payment = data.find((p) => p.payment_id === id);
  if (!payment) {
    throw new Error(`No se encontró el pago con ID ${id}`);
  }
  return payment;
};

// FINAL
export function getAppointmentsProfessional(
  data: Appointment[],
  user_id: number,
): Appointment[] {
  return data.filter(
    (appointment) => appointment.professional.user_id === user_id,
  );
}

// FINAL
export function getClients(
  appointments: Appointment[],
  persons: Person[],
  user_id: number,
): Person[] {
  const filteredAppointments = getAppointmentsProfessional(
    appointments,
    user_id,
  );

  // Obtener IDs únicos de clientes
  const clientIds = new Set(
    filteredAppointments.map((app) => app.client.person_id),
  );

  // Filtrar persons con esos IDs
  return persons.filter((person) => clientIds.has(person.person_id));
}

// FINAL
export function getUser(data: Person[], user_id: number): Person {
  return data.find((user) => user.user_id === user_id)!;
}

// FINAL
export function getUnmarkedAppointments(
  data: Appointment[],
  user_id: number,
): Appointment[] {
  const appointments: Appointment[] = getAppointmentsProfessional(
    data,
    user_id,
  );
  // Solo citas agendadas que ya empezaron: la asistencia no se marca por adelantado
  return appointments.filter(
    (appointment) =>
      appointment.appointment_status.appointment_status_id === 2 && yaEmpezo(appointment),
  );
}

// ─── Hora de Ecuador ──────────────────────────────────────────────
// Todo el sistema usa la hora de Ecuador continental (America/Guayaquil: UTC−5 todo el año, sin horario
// de verano), igual que el servidor, sin importar la zona horaria del dispositivo con que se mire.
// Para saber qué día es, qué hora es o si un turno ya empezó, usa estas funciones (no `new Date()` a secas
// ni `toISOString()`, que dan la hora del dispositivo o la universal).
const ZONA_ECUADOR = "America/Guayaquil";
const DESFASE_ECUADOR = "-05:00";
const relojEcuador = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA_ECUADOR,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Fecha ("AAAA-MM-DD") y hora ("HH:MM") de un instante, en la hora de Ecuador. */
function enEcuador(instante: Date): { fecha: string; hora: string } {
  const p = Object.fromEntries(relojEcuador.formatToParts(instante).map((x) => [x.type, x.value]));
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` };
}

/** Hoy en Ecuador, como "AAAA-MM-DD". */
export const hoyEcuador = (): string => enEcuador(new Date()).fecha;

/** Instante (en milisegundos) de una fecha y una hora de Ecuador; p. ej., el inicio de un turno. */
export function instanteEcuador(fecha: string | Date, hora: string): number {
  const dia = fecha instanceof Date ? enEcuador(fecha).fecha : String(fecha).split("T")[0];
  return new Date(`${dia}T${hora}${DESFASE_ECUADOR}`).getTime();
}

/**
 * "Ahora" de Ecuador como hora de pared ("AAAA-MM-DDTHH:MM:00"), para componentes que dibujan las horas
 * tal como están guardadas (la agenda): así la línea de la hora actual y el día de hoy son los de Ecuador.
 */
export function ahoraEcuadorDePared(): string {
  const { fecha, hora } = enEcuador(new Date());
  return `${fecha}T${hora}:00`;
}

/** Suma días a una fecha "AAAA-MM-DD". No hay horas de por medio: no depende de ninguna zona horaria. */
export function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + dias)).toISOString().slice(0, 10);
}

/**
 * Fecha de un registro (pago, recibo, cuenta) como "AAAA-MM-DD" en la hora de Ecuador.
 * El servidor la envía en hora universal ("2026-10-08T05:37:00Z"); cortar el texto por la "T"
 * mostraba la fecha y la hora 5 horas adelantadas (y el día siguiente desde las 19:00).
 * Una fecha sin hora ("2026-10-08": cumpleaños, día de una cita) se devuelve igual.
 */
export function fechaLocal(valor: string | Date | null | undefined): string {
  if (!valor) return "";
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return String(valor).split("T")[0];
  return enEcuador(d).fecha;
}

/** Igual que `fechaLocal`, con la hora de Ecuador: "AAAA-MM-DD / HH:MM". */
export function fechaHoraLocal(valor: string | Date | null | undefined): string {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return String(valor);
  const { fecha, hora } = enEcuador(d);
  return `${fecha} / ${hora}`;
}

/** Hora como "09:00". El servidor puede devolverla con segundos ("09:00:00"), según la base de datos. */
export const horaCorta = (hora: string | null | undefined): string => String(hora ?? "").slice(0, 5);

/** true si la hora de inicio de un turno ya pasó (la fecha y la hora del turno son de Ecuador). */
export function turnoYaEmpezo(s: { date: string | Date; start_time: string } | null | undefined): boolean {
  if (!s) return false;
  return instanteEcuador(s.date, s.start_time) <= Date.now();
}

/** true si la hora de fin de un turno ya pasó (hora de Ecuador). */
export function turnoYaTermino(s: { date: string | Date; end_time: string } | null | undefined): boolean {
  if (!s) return false;
  return instanteEcuador(s.date, s.end_time) <= Date.now();
}

/** true si la hora de inicio de la cita ya pasó (hora de Ecuador). */
export function yaEmpezo(appointment: Appointment): boolean {
  return turnoYaEmpezo(appointment.worker_schedule?.schedule);
}

// FINAL
export function getUnreportedAppointments(
  data: Appointment[],
  reports: AppointmentReport[],
  user_id: number,
): Appointment[] {
  const appointments: Appointment[] = getAppointmentsProfessional(
    data,
    user_id,
  );
  console.log("Appointments for user:", appointments);
  if (!appointments || !reports) {
    return [];
  }

  const reportedIds = new Set(reports.map((r) => r.appointment_id));

  const unreported = appointments.filter(
    (app) =>
      !reportedIds.has(app.appointment_id) &&
      app.appointment_status.appointment_status_id === 3,
  );
  console.log("Unreported Appointments:", unreported);
  return unreported.length > 0 ? unreported : [];
}

// FINAL
export function getAppointment(data: Appointment[], id: number): Appointment {
  return data.find((app) => app.appointment_id === id)!;
}

// FINAL
export function getAppointmentbyClient(
  data: any,
  client_id: number,
): Appointment[] {
  const appointments: Appointment[] = data.appointments ?? [];
  return appointments.filter((apt) => apt.client.user_id === client_id);
}

// FINAL
export function getReceiptByUser(data: any, user_id: number): Payment[] {
  const payments: Payment[] = data.payments ?? [];
  return payments.filter((pay) => pay.client.user_id == user_id);
}

// FINAL
export function getProfessional(data: Person[]) {
  if (!data) return [];
  return data.filter(
    (person) => person.user_account.role.name === "Professional",
  );
}

// FINAL
export function getClient(data: Person[]) {
  if (!data) return [];
  return data.filter((person) => person.user_account.role.name === "Client");
}

// -------------------------------------------------------------------------
// ─── Colores de ASPY en los documentos (los mismos del sitio: components/landing/constants.tsx) ───
const COLOR = {
  blue: [91, 184, 212] as [number, number, number], // #5BB8D4
  blueDark: [58, 154, 184] as [number, number, number], // #3A9AB8
  blueLight: [214, 240, 248] as [number, number, number], // #D6F0F8
  pink: [232, 160, 176] as [number, number, number], // #E8A0B0
  yellow: [240, 200, 74] as [number, number, number], // #F0C84A
  tinta: [18, 38, 58] as [number, number, number], // #12263A, el azul oscuro de los títulos
  gray: [94, 110, 122] as [number, number, number], // #5E6E7A
  crema: [255, 248, 241] as [number, number, number], // #FFF8F1, el fondo claro del sitio
  white: [255, 255, 255] as [number, number, number],
  border: [226, 235, 240] as [number, number, number], // #E2EBF0
};

// ─── Helpers ──────────────────────────────────────────────────────
function setColor(
  doc: jsPDFWithAutoTable,
  rgb: [number, number, number],
  type: "fill" | "draw" | "text",
) {
  if (type === "fill") doc.setFillColor(...rgb);
  else if (type === "draw") doc.setDrawColor(...rgb);
  else doc.setTextColor(...rgb);
}

// ─── Encabezado y pie de los documentos de la fundación ───────────
const DIRECCION_EN_REPORTES = "Av. Miguel H. Alcivar y Av. Alberto Borges, Guayaquil";
const CONTACTO_EN_REPORTES = "Tel: 0999616051  |  fundacionaspyecuador@gmail.com";
/** El logo mide 520 × 330: en la hoja va de 44 mm de ancho. */
const LOGO_MM = { ancho: 44, alto: 27.9 };

/** Franja de los tres colores de ASPY (azul, rosa y amarillo) a todo el ancho. */
function franjaAspy(doc: jsPDFWithAutoTable, W: number, y: number, alto: number) {
  setColor(doc, COLOR.blue, "fill");
  doc.rect(0, y, W * 0.5, alto, "F");
  setColor(doc, COLOR.pink, "fill");
  doc.rect(W * 0.5, y, W * 0.25, alto, "F");
  setColor(doc, COLOR.yellow, "fill");
  doc.rect(W * 0.75, y, W * 0.25, alto, "F");
}

/**
 * Encabezado (ocupa los primeros 43 mm): el logo oficial sobre fondo blanco, como en el menú del sitio,
 * los datos de la fundación a la derecha y la franja de colores debajo.
 */
function encabezadoAspy(doc: jsPDFWithAutoTable, W: number, M: number) {
  doc.addImage(logoDocumentos, "PNG", M, 6, LOGO_MM.ancho, LOGO_MM.alto, "logo-aspy", "FAST");

  setColor(doc, COLOR.tinta, "text");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Fundación ASPY Ecuador", W - M, 17, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLOR.gray, "text");
  doc.text(DIRECCION_EN_REPORTES, W - M, 24, { align: "right" });
  doc.text(CONTACTO_EN_REPORTES, W - M, 30, { align: "right" });

  franjaAspy(doc, W, 40, 3);
}

/** Pie (los últimos 17 mm de la hoja): la franja de colores y una banda azul oscuro con el contacto. */
function pieAspy(doc: jsPDFWithAutoTable, W: number, H: number, segundaLinea: string) {
  franjaAspy(doc, W, H - 17, 2);
  setColor(doc, COLOR.tinta, "fill");
  doc.rect(0, H - 15, W, 15, "F");
  setColor(doc, [200, 215, 228], "text");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Fundación ASPY Ecuador  |  fundacionaspyecuador@gmail.com  |  Tel: 0999616051", W / 2, H - 8, { align: "center" });
  setColor(doc, COLOR.blue, "text");
  doc.text(segundaLinea, W / 2, H - 3, { align: "center" });
}

// ─── Recibo de un pago ────────────────────────────────────────────
export function handleDownloadInvoice(invoice: FlattenedReceipt) {
  const doc = new jsPDF("p", "mm", "a4") as jsPDFWithAutoTable;
  const W = 210; // ancho A4
  const M = 14; // margen lateral

  // ── Datos externos ──────────────────────────────────────────────
  const persons = localStorage.getItem("persons");
  const personData: Person[] = persons ? JSON.parse(persons) : [];
  const clientPerson = personData.find(
    (p) => p.person_id === invoice.client_id,
  );

  const payment = localStorage.getItem("payments");
  const paymentData: Payment[] = payment ? JSON.parse(payment) : [];
  const paymentInfo = paymentData.find(
    (p) => p.payment_id === invoice.receipt.payment_id,
  );

  encabezadoAspy(doc, W, M);

  // ══════════════════════════════════════════════════════════════
  // TÍTULO DOCUMENTO
  // ══════════════════════════════════════════════════════════════
  setColor(doc, COLOR.crema, "fill");
  doc.rect(0, 43, W, 18, "F");

  setColor(doc, COLOR.tinta, "text");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("COMPROBANTE DE PAGO", W / 2, 54, { align: "center" });

  // Número de comprobante — badge azul
  setColor(doc, COLOR.blue, "fill");
  doc.roundedRect(W - M - 44, 45, 44, 12, 2, 2, "F");
  setColor(doc, COLOR.white, "text");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`N° ${invoice.receipt.receipt_id}`, W - M - 22, 52.5, {
    align: "center",
  });

  // ══════════════════════════════════════════════════════════════
  // BLOQUE INFO — cliente y fecha
  // ══════════════════════════════════════════════════════════════
  let y = 72;

  // Dos columnas: cliente (izq) | fecha (der)
  // — Card izquierda
  setColor(doc, COLOR.border, "draw");
  setColor(doc, COLOR.white, "fill");
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, 88, 34, 2, 2, "FD");

  // — Card derecha
  doc.roundedRect(W / 2 + 4, y, 88, 34, 2, 2, "FD");

  // Etiqueta "DATOS DEL CLIENTE"
  setColor(doc, COLOR.blue, "fill");
  doc.roundedRect(M, y, 44, 6, 1, 1, "F");
  setColor(doc, COLOR.white, "text");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", M + 22, y + 4.3, { align: "center" });

  // Valores cliente
  setColor(doc, COLOR.gray, "text");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Nombre:", M + 4, y + 13);
  doc.text("Email:", M + 4, y + 20);
  doc.text("Teléfono:", M + 4, y + 27);

  setColor(doc, COLOR.tinta, "text");
  doc.setFont("helvetica", "bold");
  doc.text(invoice.client || "N/A", M + 24, y + 13);
  doc.setFont("helvetica", "normal");
  doc.text(clientPerson?.user_account.email || "N/A", M + 24, y + 20);
  doc.text(clientPerson?.phone.number || "N/A", M + 24, y + 27);

  // Etiqueta "DETALLES DE EMISIÓN"
  const rx = W / 2 + 4;
  setColor(doc, COLOR.pink, "fill");
  doc.roundedRect(rx, y, 50, 6, 1, 1, "F");
  setColor(doc, COLOR.white, "text");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES DE EMISIÓN", rx + 25, y + 4.3, { align: "center" });

  setColor(doc, COLOR.gray, "text");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha de emisión:", rx + 4, y + 13);
  doc.text("Estado:", rx + 4, y + 20);
  doc.text("Método de pago:", rx + 4, y + 27);

  setColor(doc, COLOR.tinta, "text");
  doc.setFont("helvetica", "bold");
  doc.text(fechaLocal(invoice.receipt.creation_date), rx + 36, y + 13);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.receipt.receipt_status?.name || "N/A", rx + 36, y + 20);
  doc.text(paymentInfo?.payment_data?.type || "Transferencia", rx + 36, y + 27);

  // ══════════════════════════════════════════════════════════════
  // TABLA DE SERVICIOS
  // ══════════════════════════════════════════════════════════════
  y += 44;

  // Etiqueta sección
  setColor(doc, COLOR.tinta, "text");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE DEL SERVICIO", M, y);

  // Línea decorativa
  setColor(doc, COLOR.blue, "draw");
  doc.setLineWidth(0.8);
  doc.line(M, y + 1.5, M + 50, y + 1.5);
  setColor(doc, COLOR.border, "draw");
  doc.setLineWidth(0.3);
  doc.line(M + 50, y + 1.5, W - M, y + 1.5);

  autoTable(doc, {
    startY: y + 5,
    head: [["#", "Descripción del Servicio", "Precio Unitario", "Total"]],
    body: [["1", invoice.service, `$${invoice.price}`, `$${invoice.price}`]],
    theme: "plain",
    headStyles: {
      fillColor: COLOR.tinta,
      textColor: COLOR.white,
      fontSize: 8.5,
      fontStyle: "bold",
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLOR.tinta,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    alternateRowStyles: {
      fillColor: COLOR.crema,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left" },
      2: { halign: "right", cellWidth: 38 },
      3: { halign: "right", cellWidth: 38, fontStyle: "bold" },
    },
    margin: { left: M, right: M },
    tableLineWidth: 0,
  });

  // ══════════════════════════════════════════════════════════════
  // BLOQUE TOTALES
  // ══════════════════════════════════════════════════════════════
  const afterTable = (doc.lastAutoTable?.finalY ?? 130) + 8;

  // Card de totales alineada a la derecha
  const tw = 80; // ancho
  const tx = W - M - tw;

  setColor(doc, COLOR.crema, "fill");
  setColor(doc, COLOR.border, "draw");
  doc.setLineWidth(0.3);
  doc.roundedRect(tx, afterTable, tw, 36, 2, 2, "FD");

  // Filas de totales
  const rows: [string, string, boolean][] = [
    ["Subtotal:", `$${invoice.price}`, false],
    ["IVA (15%):", "$0.00", false],
    ["TOTAL:", `$${invoice.price}`, true],
  ];

  rows.forEach(([label, value, isBold], i) => {
    const ry = afterTable + 8 + i * 10;

    if (isBold) {
      // Fila total — fondo azul
      setColor(doc, COLOR.blue, "fill");
      doc.rect(tx + 1, ry - 5, tw - 2, 11, "F");
      setColor(doc, COLOR.white, "text");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
    } else {
      setColor(doc, COLOR.gray, "text");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
    }

    doc.text(label, tx + 8, ry);
    doc.text(value, tx + tw - 6, ry, { align: "right" });
  });

  // ══════════════════════════════════════════════════════════════
  // NOTA / AGRADECIMIENTO
  // ══════════════════════════════════════════════════════════════
  const noteY = afterTable + 48;

  setColor(doc, COLOR.blueLight, "fill");
  setColor(doc, COLOR.blue, "draw");
  doc.setLineWidth(0.4);
  doc.roundedRect(M, noteY, W - M * 2, 18, 2, 2, "FD");

  // Acento lateral izquierdo
  setColor(doc, COLOR.blue, "fill");
  doc.roundedRect(M, noteY, 3, 18, 1, 1, "F");

  setColor(doc, COLOR.blueDark, "text");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Nota:", M + 7, noteY + 7);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLOR.tinta, "text");
  doc.text(
    "Este comprobante es válido como constancia de pago. Para consultas, contáctenos a nuestro correo o teléfono.",
    M + 7,
    noteY + 13,
  );

  pieAspy(doc, W, 297, "Gracias por confiar en nosotros.");

  // ── Guardar ─────────────────────────────────────────────────
  doc.save(
    `Comprobante-ASPY-${invoice.receipt.receipt_id}-${invoice.client}.pdf`,
  );
}

// ─── Exportar cualquier tabla a Excel o a PDF ────────────────────────────────
// Todas las tablas del sistema se descargan con estas dos funciones (botones en tabla/BotonesExportar.tsx).
// Se exporta lo que la tabla está mostrando: si hay filtros puestos, solo las filas que los pasan.

/** Una columna del archivo: su título y de dónde sale el dato de cada fila. */
export interface ColumnaExportable<T> {
  titulo: string;
  valor: (fila: T) => string | number | null | undefined;
  /** Monto en dólares: en Excel queda como número con dos decimales y en el PDF se escribe "$12.50". */
  dinero?: boolean;
}

export interface TablaExportable<T> {
  /** Título del reporte ("Lista de pagos"). */
  titulo: string;
  /** Nombre del archivo, sin la fecha ni la extensión ("pagos"). */
  archivo: string;
  columnas: ColumnaExportable<T>[];
  filas: T[];
  /** Se escribe bajo el título del PDF (p. ej., que la lista está filtrada). */
  nota?: string;
}

function descargarArchivoGenerado(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

/** El logo, una sola vez por sesión. Si no se puede leer, el Excel sale sin él (nunca deja de descargarse). */
let logoEnBytes: Promise<Uint8Array | null> | null = null;
const bytesDelLogo = () =>
  (logoEnBytes ??= fetch(logoDocumentos)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
    .then((b) => new Uint8Array(b))
    .catch(() => {
      logoEnBytes = null;
      return null;
    }));

/**
 * Excel de verdad (.xlsx): arriba, el logo de ASPY y los datos de la lista; debajo, la tabla, con los números
 * como números y el filtro de Excel puesto en sus encabezados (fila 6).
 */
export async function exportarTablaExcel<T>(tabla: TablaExportable<T>) {
  const filas = tabla.filas.map((fila) =>
    tabla.columnas.map((columna) => {
      const valor = columna.valor(fila);
      return columna.dinero ? Number(valor) || 0 : valor;
    }),
  );
  const logo = await bytesDelLogo();
  const cuantos = tabla.filas.length === 1 ? "1 registro" : `${tabla.filas.length} registros`;
  const bytes = crearXlsx(
    tabla.columnas.map((columna) => columna.titulo),
    filas,
    {
      hoja: tabla.titulo,
      conDecimales: tabla.columnas.flatMap((columna, i) => (columna.dinero ? [i] : [])),
      membrete: {
        // 150 × 95 px en la hoja (el archivo trae más resolución, para que se vea nítido al agrandar o imprimir)
        logo: logo ? { png: logo, ancho: 150, alto: 95, descripcion: "Logo de la Fundación ASPY Ecuador" } : undefined,
        lineas: [
          "Fundación ASPY Ecuador",
          tabla.titulo,
          `Generado el ${hoyEcuador().split("-").reverse().join("/")}  ·  ${tabla.nota ? `${cuantos} · ${tabla.nota}` : cuantos}`,
          `${DIRECCION_EN_REPORTES}  |  ${CONTACTO_EN_REPORTES}`,
        ],
      },
    },
  );
  descargarArchivoGenerado(
    new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${tabla.archivo}-aspy-${hoyEcuador()}.xlsx`,
  );
}

/** PDF con el encabezado de la fundación. Con más de 6 columnas, la hoja va acostada. */
export function exportarTablaPDF<T>(tabla: TablaExportable<T>) {
  const acostada = tabla.columnas.length > 6;
  const doc = new jsPDF(acostada ? "l" : "p", "mm", "a4") as jsPDFWithAutoTable;
  const W = acostada ? 297 : 210;
  const H = acostada ? 210 : 297;
  const M = 14;

  encabezadoAspy(doc, W, M);

  // ── Título, fecha y cuántos registros trae ──
  setColor(doc, COLOR.crema, "fill");
  doc.rect(0, 43, W, 18, "F");
  setColor(doc, COLOR.tinta, "text");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(tabla.titulo.toUpperCase(), W / 2, 54, { align: "center" });
  setColor(doc, COLOR.blue, "fill");
  doc.roundedRect(W - M - 44, 45, 44, 12, 2, 2, "F");
  setColor(doc, COLOR.white, "text");
  doc.setFontSize(8);
  doc.text(hoyEcuador().split("-").reverse().join("/"), W - M - 22, 52.5, { align: "center" });

  setColor(doc, COLOR.gray, "text");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const cuantos = tabla.filas.length === 1 ? "1 registro" : `${tabla.filas.length} registros`;
  doc.text(tabla.nota ? `${cuantos} · ${tabla.nota}` : cuantos, M, 70);

  const pie = (pagina: number) => pieAspy(doc, W, H, `Reporte generado automáticamente.  ·  Página ${pagina}`);

  autoTable(doc, {
    startY: 75,
    head: [tabla.columnas.map((columna) => columna.titulo)],
    body: tabla.filas.map((fila) =>
      tabla.columnas.map((columna) => {
        const valor = columna.valor(fila);
        if (columna.dinero) return `$${(Number(valor) || 0).toFixed(2)}`;
        return valor === null || valor === undefined ? "" : String(valor);
      }),
    ),
    theme: "plain",
    headStyles: { fillColor: COLOR.tinta, textColor: COLOR.white, fontSize: 8, fontStyle: "bold", cellPadding: { top: 4, bottom: 4, left: 4, right: 4 } },
    bodyStyles: { fontSize: 8, textColor: COLOR.tinta, cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 } },
    alternateRowStyles: { fillColor: COLOR.crema },
    columnStyles: Object.fromEntries(tabla.columnas.flatMap((columna, i) => (columna.dinero ? [[i, { halign: "right" as const }]] : []))),
    // El pie ocupa los últimos 17 mm de cada página
    margin: { left: M, right: M, top: 14, bottom: 22 },
    tableLineWidth: 0,
    didDrawPage: (datos) => pie(datos.pageNumber),
  });

  doc.save(`${tabla.archivo}-aspy-${hoyEcuador()}.pdf`);
}

/** Monto de un pago: el guardado al pagar; en pagos antiguos, el precio del servicio. */
export function montoPago(payment: { amount?: string | number | null; service?: { price: string | number } | null }): number {
  return Number(payment?.amount ?? payment?.service?.price) || 0;
}

/** Fecha legible en español ("12 de abril de 1988") a partir de "1988-04-12" o "1988-04-12T05:00:00Z". */
export function fechaLegible(fecha: string | null | undefined): string {
  if (!fecha) return "";
  const [y, m, d] = String(fecha).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return String(fecha);
  return new Date(y, m - 1, d).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" });
}

/** Ocupación para mostrar: si eligió "Otra", el texto que escribió. */
export function ocupacionDe(person: { occupation?: { name?: string } | null; occupation_other?: string | null } | null | undefined): string {
  return person?.occupation_other || person?.occupation?.name || "";
}
