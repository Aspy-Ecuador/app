import type { User } from "@/types/User";
import type { Appointment } from "@/types/Appointment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import logoBase64 from "@assets/logo mediano.png";
import { Receipt } from "@/types/Receipt";
import { ProfessionalServiceResponse } from "@/typesResponse/ProfessionalServiceResponse";

type TendenciaDiaria = {
  promedioPorcentual: number;
};

type TotalIngresosMensual = {
  total: number;
};

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
    [key: string]: number;
  };
}

export function CalcularTendenciaDiaria(data: number[]): TendenciaDiaria {
  if (data.length < 2) {
    return {
      promedioPorcentual: 0,
    };
  }

  let sumaPorcentajes = 0;

  for (let i = 1; i < data.length; i++) {
    const actual = data[i];
    const anterior = data[i - 1];

    const cambio = actual - anterior;

    if (anterior !== 0) {
      const porcentaje = (cambio / anterior) * 100;
      sumaPorcentajes += porcentaje;
    }
  }

  const totalCambios = data.length - 1;

  return {
    promedioPorcentual: +(sumaPorcentajes / totalCambios).toFixed(2),
  };
}

export function TotalIngresosMensual(data: number[]): TotalIngresosMensual {
  return { total: data.reduce((total, numero) => total + numero, 0) };
}

import { PersonResponse } from "@/typesResponse/PersonResponse";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { userAdapter } from "@/adapters/userAdapter";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import { PageViewsBarChartProps } from "@/components/admin/PageViewsBarChart";
import { StatCardProps } from "@/components/admin/StatCard";
import { ProfessionalResponse } from "@/typesResponse/ProffesionalResponse";
import { appointmentAdapter } from "@/adapters/appointmentAdapter";
import { AppointmentReportResponse } from "@/typesResponse/AppointmentReportResponse";
import { AppointmentReport } from "@/types/AppointmentReport";
import { appointmentReportResponseAdapter } from "@/adapters/appointmentReportResponseAdapter";
import { CloudinaryUploadResponse } from "@/typesResponse/CloudinaryUploadResponse";
import { FileData } from "@/types/FileData";
import { dataPayments } from "@/data/Payment";
import { ReceiptResponse } from "@/typesResponse/ReceiptResponse";
import { receiptAdapter } from "@/adapters/receiptAdapter";

export function getPerson(person_id: number, data: any): PersonResponse {
  const persons: PersonResponse[] = data.persons;
  const person = persons.find((person) => person.person_id === person_id);
  if (!person) throw new Error(`No se encontró la persona con ID ${person_id}`);
  return person;
}

export function getWorkerSchedule(
  worker_schedule_id: number,
  data: any
): WorkerScheduleResponse {
  const workerschedules: WorkerScheduleResponse[] = data.workerSchedules;
  const workerschedule = workerschedules.find(
    (workerschedule) => workerschedule.worker_schedule_id === worker_schedule_id
  );
  if (!workerschedule)
    throw new Error(
      `No se encontró el worker schedule con ID ${worker_schedule_id}`
    );
  return workerschedule;
}

export function getService(data: any, service_id: number): ServiceResponse {
  const services: ServiceResponse[] = data.services;
  const service = services.find((service) => service.service_id === service_id);
  if (!service)
    throw new Error(`No se encontró el worker schedule con ID ${service_id}`);
  return service;
}

export function getProfessionalService(
  service_id: number,
  data: any
): PersonResponse[] {
  const professionals: ProfessionalServiceResponse[] =
    data.professionalServices;

  const professionalsFilter = professionals.filter(
    (service) => service.service_id === service_id
  );

  const persons: PersonResponse[] = data.persons;

  const professionalIds = new Set(
    professionalsFilter.map((prof) => prof.person_id)
  );

  return persons.filter((person) => professionalIds.has(person.person_id));
}

export function getProfessionalSchedule(
  person_id: number,
  data: any
): WorkerScheduleResponse[] {
  const workerSchedules: WorkerScheduleResponse[] = data.workerSchedules;
  const workerFilter: WorkerScheduleResponse[] = workerSchedules.filter(
    (worker) => worker.person_id === person_id
  );
  return workerFilter;
}

export function getUsers(data: any): User[] {
  if (
    !data ||
    !data.persons ||
    !data.userAccounts ||
    !data.roles ||
    !data.professional
  ) {
    return [];
  }
  const persons: PersonResponse[] = data.persons;
  const userAccounts: UserAccountResponse[] = data.userAccounts;
  const roles: RoleResponse[] = data.roles;
  const professionals: ProfessionalResponse[] = data.professional;

  return userAccounts
    .map((account) => {
      const person = persons.find((p) => p.user_id === account.user_id);
      const role = roles.find((r) => r.role_id === account.role_id);
      if (!person || !role) return null;
      const user = userAdapter(person, role, account);

      // Si es profesional (role_id === 2), añadimos sus datos extra
      if (role.role_id === 2) {
        const prof = professionals.find(
          (p) => p.person_id === person.person_id
        );
        if (prof) {
          user.title = prof.title;
          user.about = prof.about;
          user.specialty = prof.specialty;
        }
      }
      return user;
    })
    .filter((user): user is User => user !== null);
}

export function getIncome(data: PaymentResponse[]): number[] {
  const monthlyIncome = Array(12).fill(0); // Inicializamos un arreglo con 12 ceros (uno por cada mes)

  data.forEach((payment) => {
    const creationMonth = new Date(payment.creation_date).getMonth(); // Obtenemos el mes (0-11)
    const totalAmount = payment.total_amount;

    // Sumamos el total_amount al mes correspondiente
    monthlyIncome[creationMonth] += totalAmount;
  });

  return monthlyIncome;
}

export function getDataAppointment(data: any): PageViewsBarChartProps {
  const appointments: AppointmentResponse[] = data.appointments;
  const scheduled = Array(12).fill(0);
  const completed = Array(12).fill(0);
  const cancelled = Array(12).fill(0);

  appointments.forEach((appointment) => {
    const creationMonth = new Date(appointment.creation_date).getMonth(); // Obtenemos el mes (0-11)
    const statusName = appointment.status.name.toLowerCase(); // Obtenemos el estado de la cita (scheduled, completed, cancelled)

    if (statusName === "scheduled") {
      scheduled[creationMonth] += 1;
    } else if (statusName === "completed") {
      completed[creationMonth] += 1;
    } else if (statusName === "cancelled") {
      cancelled[creationMonth] += 1;
    }
  });

  const total = appointments.length; // Total de citas es la longitud de la lista de datos

  return {
    total,
    scheduled,
    completed,
    cancelled,
  };
}

export function getDataCard(data: any): StatCardProps[] {
  const users: UserAccountResponse[] = data.userAccounts;
  const appointments: AppointmentResponse[] = data.appointments;
  const today = new Date();

  const lastMonth = today.getMonth() - 1 < 0 ? 11 : today.getMonth() - 1;
  const lastMonthYear =
    today.getMonth() - 1 < 0 ? today.getFullYear() - 1 : today.getFullYear();

  const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();

  function countMonthDays<T>(
    items: T[],
    getDate: (item: T) => string
  ): number[] {
    const counts = Array(daysInLastMonth).fill(0);

    items.forEach((item) => {
      const date = new Date(getDate(item));
      if (
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      ) {
        const day = date.getDate() - 1;
        counts[day] += 1;
      }
    });

    while (counts.length < 31) {
      counts.push(0);
    }

    return counts;
  }

  const usuariosData = countMonthDays(users, (u) => u.creation_date);
  const citasData = countMonthDays(appointments, (c) => c.creation_date);
  const pacientesData = countMonthDays(
    users.filter((u) => u.role_id === 3),
    (u) => u.creation_date
  );
  const inactivosData = countMonthDays(
    users.filter((u) => u.status === 2),
    (u) => u.creation_date
  );

  return [
    {
      title: "Usuarios",
      value: usuariosData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "usuarios",
      data: usuariosData,
    },
    {
      title: "Citas",
      value: citasData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "citas",
      data: citasData,
    },
    {
      title: "Pacientes",
      value: pacientesData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "pacientes",
      data: pacientesData,
    },
    {
      title: "Usuarios inactivos",
      value: inactivosData.reduce((a, b) => a + b, 0).toString(),
      interval: "Mes pasado",
      trend: "inactivos",
      data: inactivosData,
    },
  ];
}

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

export function toNumber(str: string): number {
  return Number(str);
}

export function getAppointmentProfessional(
  proffesional_id: number,
  data: any
): Appointment[] {
  if (!data) {
    return [];
  }

  const appointments: Appointment[] = getAppointments(data);

  if (proffesional_id === 0) {
    return appointments;
  }

  return appointments.filter(
    (appointment) => appointment.proffesional.person_id === proffesional_id
  );
}

export function getAppointments(data: any): Appointment[] {
  const professionals: ProfessionalResponse[] = data.professional;

  const appointments: Appointment[] = (data.appointments || [])
    .map((appointment: any) => {
      const service = data.services?.find(
        (s: any) => s.service_id === appointment.payment.service_id
      );

      const clientPerson = data.persons?.find(
        (p: any) => p.person_id === appointment.payment.person_id
      );

      const clientAccount = data.userAccounts?.find(
        (a: any) => a.user_id === clientPerson?.user_id
      );

      const clientRole = data.roles?.find(
        (r: any) => r.role_id === clientAccount?.role_id
      );

      const professionalPerson = data.persons?.find(
        (p: any) => p.person_id === appointment.worker_schedule.person_id
      );
      const professionalAccount = data.userAccounts?.find(
        (a: any) => a.user_id === professionalPerson?.user_id
      );

      const professionalRole = data.roles?.find(
        (r: any) => r.role_id === professionalAccount?.role_id
      );

      const schedule = data.schedules?.find(
        (s: any) => s.schedule_id === appointment.worker_schedule.schedule_id
      );

      // Validación
      if (
        !service ||
        !clientPerson ||
        !clientAccount ||
        !clientRole ||
        !professionalPerson ||
        !professionalAccount ||
        !professionalRole ||
        !schedule
      )
        return null;

      const client = userAdapter(clientPerson, clientRole, clientAccount);
      const professional = userAdapter(
        professionalPerson,
        professionalRole,
        professionalAccount
      );
      // Si es profesional (role_id === 2), añadimos sus datos extra
      if (professional.role_id === 2) {
        const prof = professionals.find(
          (p) => p.person_id === professional.person_id
        );
        if (prof) {
          professional.title = prof.title;
          professional.about = prof.about;
          professional.specialty = prof.specialty;
        }
      }
      return appointmentAdapter(
        appointment,
        schedule,
        client,
        professional,
        service
      );
    })
    .filter(Boolean);

  return appointments;
}

export function getNextAppointments(data: any): Appointment[] {
  const appointments: Appointment[] = getAppointments(data);
  if (!appointments) return [];

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  return appointments.filter((app) => app.date > todayStr);
}

export function translateStatus(status: string): string {
  switch (status.trim().toLowerCase()) {
    case "scheduled":
      return "Agendado";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Desconocido";
  }
}

export function getOccupation(occupation: number): string {
  switch (occupation) {
    case 1:
      return "Doctor";
    case 2:
      return "Enfermero";
    case 3:
      return "Ingeniero";
    case 4:
      return "Estudiante";
    default:
      return "Desconocido";
  }
}

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

export function getGender(gender: number): string {
  switch (gender) {
    case 1:
      return "Masculino";
    case 2:
      return "Femenino";
    default:
      return "Desconocido";
  }
}

export function getAppointmentsReport(data: any): AppointmentReport[] {
  const appointments: Appointment[] = getAppointments(data);
  const appointmentReport: AppointmentReportResponse[] =
    data.appointmentReports;
  return appointmentReport
    .map((report) => {
      const appointment = appointments.find(
        (a) => a.id_appointment === report.appointment_id
      );

      if (!appointment) return null;

      return appointmentReportResponseAdapter(appointment, report);
    })
    .filter((item): item is AppointmentReport => item !== null);
}

export function getReportsUser(
  appointmentsReport: AppointmentReport[],
  patient_id: number
): AppointmentReport[] {
  return appointmentsReport.filter(
    (report) => report.appointment.client.person_id === patient_id
  );
}

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

export const getPayment = (id: number): PaymentResponse => {
  const payment = dataPayments.find((p) => p.payment_id === id);
  if (!payment) {
    throw new Error(`No se encontró el pago con ID ${id}`);
  }
  return payment;
};

export function handleDownloadInvoice(invoice: Receipt) {
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
    { align: "center" }
  );

  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(10, 45, 200, 45);

  // Datos de Factura
  doc.setFontSize(12);
  doc.text(`Comprobante de Pago Nº: ${invoice.receipt.receipt_id}`, 10, 52);
  doc.text(`Fecha de Emisión: ${invoice.date}`, 142, 52);
  doc.text(`Cliente: ${invoice.client.full_name}`, 10, 59);
  //doc.text(`Dirección: ${invoice.address}`, 10, 66);

  // Tabla de servicios
  const servicios = [[invoice.service.name, `$${invoice.service.price}`]];

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
    ["Subtotal:", `$${invoice.service.price}`],
    ["IVA 15%:", `$${0}`],
    ["Total:", `$${invoice.service.price}`],
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
  doc.text(`Método de Pago: ${invoice.payment_data.type}`, 10, finalY);

  // Datos de contacto
  doc.text(`Ctn.: ${invoice.payment_data.number}`, 10, finalY + 7);
  //doc.text(`Teléfono: ${invoice.payment_data.}`, 10, finalY + 14);

  // Pie de página

  doc.setLineWidth(0.5);
  doc.line(10, 285, 200, 285);
  doc.setFontSize(9);
  doc.text("Gracias por confiar en nosotros.", 105, 290, { align: "center" });

  doc.save(
    `Factura-${invoice.receipt.receipt_id}-${invoice.client.first_name}.pdf`
  );
}

export function getAppointmentsProfessional(
  data: any,
  person_id: number
): Appointment[] {
  const appointments: Appointment[] = getAppointments(data);
  return appointments.filter(
    (appointment) => appointment.proffesional.person_id === person_id
  );
}

export function getClients(data: any, person_id: number): User[] {
  const appointments: Appointment[] = getAppointmentsProfessional(
    data,
    person_id
  );

  const clients = appointments.map((app) => app.client);

  const uniqueClients = clients.filter(
    (client, index, self) =>
      index === self.findIndex((c) => c.person_id === client.person_id)
  );
  return uniqueClients;
}

export function getUser(data: any, user_id: number): User {
  const users: User[] = getUsers(data);
  console.log(users);
  return users.find((user) => user.user_id === user_id)!;
}

export function getUnmarkedAppointments(
  data: any,
  person_id: number
): Appointment[] {
  const appointments: Appointment[] = getAppointmentsProfessional(
    data,
    person_id
  );
  //const appointmentReport: AppointmentReport[] = getAppointmentsReport(data);
  return appointments.filter(
    (appointment) => appointment.status.id_status === 1
  );
}

export function getUnreportedAppointments(
  data: any,
  person_id: number
): Appointment[] {
  const appointments: Appointment[] = getAppointmentsProfessional(
    data,
    person_id
  );

  const appointmentReports: AppointmentReportResponse[] =
    data.appointmentReports;

  if (!appointments || !appointmentReports) {
    return [];
  }

  const unreported = appointments.filter(
    (app) =>
      !appointmentReports.some(
        (report) => report.appointment_id === app.id_appointment
      )
  );
  console.log(appointments);
  return unreported.length > 0 ? unreported : [];
}

export function getAppointment(data: any, id: number): Appointment | undefined {
  const appointments: Appointment[] = getAppointments(data);
  return appointments.find((app) => app.id_appointment === id);
}

export function getClientsAppointment(data: any): User[] {
  const users: User[] = getUsers(data);

  return users.filter((user) => user.role_id === 3);
}

export function getAppointmentbyClient(
  data: any,
  client_id: number
): Appointment[] {
  const appointments: Appointment[] = getAppointments(data);
  return appointments.filter((app) => app.client.user_id === client_id);
}

export function getReceipt(data: any): Receipt[] {
  if (!data) {
    return [];
  }
  const receiptsResponse: ReceiptResponse[] = data.receipts;
  const receiptList: Receipt[] = receiptsResponse
    .map((receipt) => {
      const payment = dataPayments?.find(
        (p: any) => p.payment_id === receipt.payment_id
      );
      if (!payment) return null;

      const paymentData = data.paymentData?.find(
        (pd: any) => pd.payment_data_id === payment.payment_data_id
      );
      const service = data.services?.find(
        (s: any) => s.service_id === payment.service.id_serice
      );
      const person = data.persons?.find(
        (p: any) => p.person_id === payment.person.person_id
      );
      const userAccount = data.userAccounts?.find(
        (ua: any) => ua.user_id === person?.user_id
      );
      const role = data.roles?.find(
        (r: any) => r.role_id === userAccount?.role_id
      );

      if (!paymentData || !service || !person || !userAccount || !role)
        return null;

      const client = userAdapter(person, role, userAccount);

      return receiptAdapter(receipt, paymentData, service, client);
    })
    .filter(Boolean) as Receipt[];
  return receiptList;
}

export function getReceiptByUser(data: any, user_id: number): Receipt[] {
  if (!data || !user_id) {
    return [];
  }
  const receipts: Receipt[] = getReceipt(data);
  return receipts.filter((recp) => recp.client.user_id == user_id);
}
