import type { Appointment } from "@/typesResponse/Appointment";
import type { Person } from "@/typesResponse/Person";
import type { Service } from "@/typesResponse/Service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import logoBase64 from "@assets/logo mediano.png";
import type { PageViewsBarChartProps } from "@/components/admin/PageViewsBarChart";
import type { StatCardProps } from "@/components/admin/StatCard";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";
import type { CloudinaryUploadResponse } from "@/typesResponse/CloudinaryUploadResponse";
import type { FileData } from "@/types/FileData";
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
  const currentYear = new Date().getFullYear();
  const monthlyIncome = Array(12).fill(0);

  payments.forEach((payment) => {
    if (payment.payment_status.payment_status_id !== 3) {
      const date = new Date(payment.creation_date);

      if (date.getFullYear() !== currentYear) return;

      const month = date.getMonth();
      const price = Number(payment?.service?.price) || 0;

      monthlyIncome[month] += price;
    }
  });

  // Redondear solo al final (mejor práctica)
  return monthlyIncome.map((value) => Number(value.toFixed(2)));
}

// FINAL
export function getDataAppointment(data: any): PageViewsBarChartProps {
  const appointments: Appointment[] = data.appointments ?? [];
  const currentYear = new Date().getFullYear();

  const scheduled = Array(12).fill(0);
  const completed = Array(12).fill(0);
  const cancelled = Array(12).fill(0);
  const saved = Array(12).fill(0);

  appointments.forEach((appointment) => {
    const date = new Date(appointment.creation_date);

    // Solo contamos citas del año actual
    if (date.getFullYear() !== currentYear) return;

    const month = date.getMonth(); // 0–11
    const statusName = appointment.appointment_status.name.toLowerCase() ?? "";
    if (statusName === "agendada") {
      scheduled[month] += 1;
    } else if (statusName === "completada") {
      completed[month] += 1;
    } else if (statusName === "perdida") {
      cancelled[month] += 1;
    } else if (statusName === "guardada") {
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
      return "Administrador";
    case "professional":
      return "Profesional";
    case "client":
      return "Cliente";
    case "staff":
      return "Secretario";
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

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  return data.filter(
    (app) =>
      app.worker_schedule.schedule.date >= todayStr &&
      app.appointment_status.appointment_status_id !== 3,
  );
}

// FINAL
export function getAge(birthdate: string): number {
  const today = new Date();
  const [year, month, day] = birthdate.split("-").map(Number);
  let age = today.getFullYear() - year;

  // Ajustar si aún no ha cumplido años este año
  const mesActual = today.getMonth() + 1;
  const diaActual = today.getDate();
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
export const uploadToCloudinary = async (file: FileData): Promise<string> => {
  const realFile = file!.file as File;
  const formData = new FormData();
  formData.append("file", realFile);
  formData.append("upload_preset", "aspy-web");

  formData.append("folder", "pdfs");

  const isPdf = realFile.type === "application/pdf";
  if (!isPdf && !realFile.type.startsWith("image/")) {
    throw new Error("Solo se permiten imágenes o PDFs.");
  }

  const resourceType = isPdf ? "raw" : "image";
  const url = `https://api.cloudinary.com/v1_1/dyqznwbdb/${resourceType}/upload`;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error Cloudinary: ${res.status} - ${errText}`);
    }

    const data = (await res.json()) as CloudinaryUploadResponse;
    return data.secure_url;
  } catch (error: any) {
    console.error("Error subiendo a Cloudinary:", error.message);
    throw new Error("No se pudo subir el archivo a Cloudinary.");
  }
};

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
  return appointments.filter(
    (appointment) => appointment.appointment_status.appointment_status_id === 2,
  );
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
// ─── Paleta de colores (logo ASPY) ────────────────────────────────
const COLOR = {
  blue: [91, 184, 212] as [number, number, number], // #5BB8D4
  blueDark: [58, 154, 184] as [number, number, number], // #3A9AB8
  blueLight: [214, 240, 248] as [number, number, number], // #D6F0F8
  pink: [232, 160, 176] as [number, number, number], // #E8A0B0
  yellow: [240, 200, 74] as [number, number, number], // #F0C84A
  black: [26, 26, 46] as [number, number, number], // #1A1A2E
  gray: [94, 110, 122] as [number, number, number], // #5E6E7A
  lightGray: [245, 247, 249] as [number, number, number], // #F5F7F9
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

// ─── Función principal ────────────────────────────────────────────
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

  // ══════════════════════════════════════════════════════════════
  // HEADER — banda azul superior
  // ══════════════════════════════════════════════════════════════
  setColor(doc, COLOR.black, "fill");
  doc.rect(0, 0, W, 40, "F");

  // Barra decorativa de colores (azul | rosa | amarillo)
  setColor(doc, COLOR.blue, "fill");
  doc.rect(0, 40, W * 0.5, 3, "F");
  setColor(doc, COLOR.pink, "fill");
  doc.rect(W * 0.5, 40, W * 0.25, 3, "F");
  setColor(doc, COLOR.yellow, "fill");
  doc.rect(W * 0.75, 40, W * 0.25, 3, "F");

  // Logo
  doc.addImage(logoBase64, "PNG", M, 5, 45, 30);

  // Nombre fundación
  setColor(doc, COLOR.white, "text");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Fundación ASPY Ecuador", W - M, 17, { align: "right" });

  // Info contacto
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(doc, [200, 220, 235], "text");
  doc.text("Av. Miguel H. Alcivar y Av. Alberto Borges, Guayaquil", W - M, 24, {
    align: "right",
  });
  doc.text("Tel: 0999616051  |  fundacionaspyecuador@gmail.com", W - M, 30, {
    align: "right",
  });

  // ══════════════════════════════════════════════════════════════
  // TÍTULO DOCUMENTO
  // ══════════════════════════════════════════════════════════════
  setColor(doc, COLOR.lightGray, "fill");
  doc.rect(0, 43, W, 18, "F");

  setColor(doc, COLOR.black, "text");
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

  setColor(doc, COLOR.black, "text");
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

  setColor(doc, COLOR.black, "text");
  doc.setFont("helvetica", "bold");
  doc.text(invoice.receipt.creation_date.split("T")[0], rx + 36, y + 13);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.receipt.receipt_status?.name || "N/A", rx + 36, y + 20);
  doc.text(paymentInfo?.payment_data?.type || "Transferencia", rx + 36, y + 27);

  // ══════════════════════════════════════════════════════════════
  // TABLA DE SERVICIOS
  // ══════════════════════════════════════════════════════════════
  y += 44;

  // Etiqueta sección
  setColor(doc, COLOR.black, "text");
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
      fillColor: COLOR.black,
      textColor: COLOR.white,
      fontSize: 8.5,
      fontStyle: "bold",
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLOR.black,
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    alternateRowStyles: {
      fillColor: COLOR.lightGray,
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

  setColor(doc, COLOR.lightGray, "fill");
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
  setColor(doc, COLOR.black, "text");
  doc.text(
    "Este comprobante es válido como constancia de pago. Para consultas, contáctenos a nuestro correo o teléfono.",
    M + 7,
    noteY + 13,
  );

  // ══════════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════════
  // Barra de colores inferior
  setColor(doc, COLOR.blue, "fill");
  doc.rect(0, 280, W * 0.5, 2, "F");
  setColor(doc, COLOR.pink, "fill");
  doc.rect(W * 0.5, 280, W * 0.25, 2, "F");
  setColor(doc, COLOR.yellow, "fill");
  doc.rect(W * 0.75, 280, W * 0.25, 2, "F");

  // Fondo footer
  setColor(doc, COLOR.black, "fill");
  doc.rect(0, 282, W, 15, "F");

  setColor(doc, [180, 200, 215], "text");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Fundación ASPY Ecuador  |  fundacionaspyecuador@gmail.com  |  Tel: 0999616051",
    W / 2,
    289,
    { align: "center" },
  );
  setColor(doc, COLOR.blue, "text");
  doc.text("Gracias por confiar en nosotros.", W / 2, 294, { align: "center" });

  // ── Guardar ─────────────────────────────────────────────────
  doc.save(
    `Comprobante-ASPY-${invoice.receipt.receipt_id}-${invoice.client}.pdf`,
  );
}
