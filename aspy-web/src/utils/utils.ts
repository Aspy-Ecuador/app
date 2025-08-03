import { usuarios } from "@data/Usuarios";
import { servicesList } from "@data/Servicios";
import type { User } from "@/types/User";
import type { Appointment } from "@/types/Appointment";
import { citas } from "@data/Citas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import logoBase64 from "@assets/logo mediano.png";
import { Receipt } from "@/types/Receipt";
import { receiptList } from "@data/Recibos";
import { paymentList } from "@data/Pagos";
import { Payment } from "@/types/Payment";
import { ServiceOptions } from "@/types/ServiceOptions";
import { ProfessionalOptions } from "@/types/ProfessionalOptions";
import { AvailableDateTime } from "@/types/AvailableDateTime";
import { ProfessionalServiceResponse } from "@/types/ProfessionalServiceResponse";

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

export function getProfesionales(): User[] {
  return usuarios.filter((u: User) => u.role === "Profesional");
}

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

export function getReceipt(id: number): Receipt {
  const receipt = receiptList.find((receipt) => receipt.payment_id === id);
  if (!receipt) {
    throw new Error(`Recibo con ID ${id} no encontrada`);
  }
  return receipt;
}

export function getPayment(id: number): Payment {
  const payment = paymentList.find((payment) => payment.id === id);
  if (!payment) {
    throw new Error(`Pago con ID ${id} no encontrada`);
  }
  return payment;
}

export function getServicesAppointment(): ServiceOptions[] {
  return servicesList.map((servicio) => ({
    id: servicio.id,
    name: servicio.name,
    price: servicio.price,
  }));
}

export function getProfessionalAppointment(
  serviceId: number
): ProfessionalOptions[] {
  const service = servicesList.find((s) => s.id === serviceId);

  if (!service) return [];

  return [
    {
      id: service.idProfessinoal,
      name: service.nameProfesional,
    },
  ];
}

export function getDates(): Promise<AvailableDateTime[]> {
  return Promise.resolve([
    { date: "2025-06-12", hours: ["10:00", "11:00"] },
    { date: "2025-06-14", hours: ["09:00", "15:00"] },
  ]);
}

import { PersonResponse } from "@/typesResponse/PersonResponse";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { userAdapter } from "@/adapters/userAdapter";

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

export function getService(service_id: number, data: any): ServiceResponse {
  const services: ServiceResponse[] = data.services;
  const service = services.find((service) => service.service_id === service_id);
  if (!service)
    throw new Error(`No se encontró el worker schedule con ID ${service_id}`);
  return service;
}

export function getCitasProfesional(
  proffesional_id: number,
  data: any
): AppointmentResponse[] {
  const appointments: AppointmentResponse[] = data.appointments;
  if (!proffesional_id) {
    return appointments;
  }
  return appointments.filter(
    (appointment) => appointment.worker_schedule.person_id === proffesional_id
  );
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
  const persons: PersonResponse[] = data.persons;
  const userAccounts: UserAccountResponse[] = data.userAccounts;
  const roles: RoleResponse[] = data.roles;
  return userAccounts
    .map((account) => {
      const person = persons.find((p) => p.person_id === account.user_id);
      const role = roles.find((r) => r.role_id === account.role_id);
      return person && role ? userAdapter(person, role, account) : null;
    })
    .filter((user): user is User => user !== null);
}
