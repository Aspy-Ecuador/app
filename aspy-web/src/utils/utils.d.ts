import type { User } from "@/types/User";
import type { Appointment } from "@/types/Appointment";
import "jspdf-autotable";
import { Receipt } from "@/types/Receipt";
import { Payment } from "@/types/Payment";
import { ServiceOptions } from "@/types/ServiceOptions";
import { ProfessionalOptions } from "@/types/ProfessionalOptions";
import { AvailableDateTime } from "@/types/AvailableDateTime";
type TendenciaDiaria = {
    promedioPorcentual: number;
};
type TotalIngresosMensual = {
    total: number;
};
export declare function CalcularTendenciaDiaria(data: number[]): TendenciaDiaria;
export declare function TotalIngresosMensual(data: number[]): TotalIngresosMensual;
export declare function getProfesionales(): User[];
export declare function getCitasProfesional(id: number): Appointment[];
export declare function handleDownloadInvoice(invoice: Receipt): void;
export declare function getReceipt(id: number): Receipt;
export declare function getPayment(id: number): Payment;
export declare function getServicesAppointment(): ServiceOptions[];
export declare function getProfessionalAppointment(serviceId: number): ProfessionalOptions[];
export declare function getDates(): Promise<AvailableDateTime[]>;
export declare function getReceipts(id: number): Receipt[];
export {};
