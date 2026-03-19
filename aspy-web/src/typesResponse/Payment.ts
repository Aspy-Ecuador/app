// FINAL
import { Person } from "@/typesResponse/Person";
import { PaymentData } from "@/typesResponse/PaymentData";
import { PaymentStatus } from "@/typesResponse/PaymentStatus";
import { Service } from "@/typesResponse/Service";
import { Receipt } from "@/typesResponse/Receipt";

export interface Payment {
  payment_id: number;

  client_id: number;
  service_id: number;
  payment_data_id: number;
  payment_status_id: number;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  // relaciones
  client: Person;
  service: Service;

  payment_data: PaymentData;
  payment_status: PaymentStatus;

  receipt: Receipt;
}
