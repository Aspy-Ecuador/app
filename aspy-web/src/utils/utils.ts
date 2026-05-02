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
  return data.filter((app) => app.worker_schedule.schedule.date >= todayStr);
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
export function handleDownloadInvoice(invoice: FlattenedReceipt) {
  const doc = new jsPDF("p", "mm", "a4") as jsPDFWithAutoTable; // Vertical, milímetros, tamaño A4

  // Insertar logo
  doc.addImage(logoBase64, "PNG", 10, 10, 50, 30);

  // Nombre empresa
  doc.setFontSize(18);
  doc.text("Fundación ASPY Ecuador", 105, 20, { align: "center" });

  // Info Empresa
  doc.setFontSize(10);
  doc.text("Av.Miguel H Alcivar, y Av.Alberto Borges, Guayaquil", 105, 28, {
    align: "center",
  });
  doc.text(
    "Teléfono: 0999616051 | Email: fundacionaspyecuador@gmail.com",
    105,
    34,
    { align: "center" },
  );

  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(10, 45, 200, 45);

  // Datos de Factura
  doc.setFontSize(12);
  doc.text(`Comprobante de Pago Nº: ${invoice.receipt.receipt_id}`, 10, 52);
  doc.text(
    `Fecha de Emisión: ${invoice.receipt.creation_date.split("T")[0]}`,
    142,
    52,
  );
  doc.text(`Cliente: ${invoice.client}`, 10, 59);

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

  doc.text(`Dirección: ${clientPerson?.user_account.email || "N/A"}`, 10, 66);

  // Tabla de servicios
  const servicios = [[invoice.service, `$${invoice.price}`]];

  autoTable(doc, {
    startY: 75,
    head: [["Descripción del Servicio", "Precio"]],
    body: servicios,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    styles: { fontSize: 11 },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
    },
  });

  // Tabla de totales
  const totales = [
    ["Subtotal:", `$${invoice.price}`],
    ["IVA 15%:", `$${0}`],
    ["Total:", `$${invoice.price}`],
  ];

  autoTable(doc, {
    startY: 100,
    body: totales,
    theme: "plain",
    styles: { fontSize: 11 },
    tableWidth: 60, // ancho pequeño para que no sea gigante
    margin: { left: 145 }, // mueve la tabla a la derecha en el eje X
    columnStyles: {
      0: { halign: "right", fontStyle: "bold" },
      1: { halign: "left" },
    },
  });

  // Totales
  const finalY = (doc.lastAutoTable?.finalY ?? 0) + 15;

  // Método de pago
  doc.setFontSize(11);
  doc.text(
    `Método de Pago: ${paymentInfo?.payment_data.type || "N/A"}`,
    10,
    finalY,
  );

  // Datos de contacto
  doc.text(`Teléfono: ${clientPerson?.phone.number || "N/A"}`, 10, finalY + 10);

  // Pie de página

  doc.setLineWidth(0.5);
  doc.line(10, 285, 200, 285);
  doc.setFontSize(9);
  doc.text("Gracias por confiar en nosotros.", 105, 290, { align: "center" });

  doc.save(`Factura-${invoice.receipt.receipt_id}-${invoice.client}.pdf`);
}

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
