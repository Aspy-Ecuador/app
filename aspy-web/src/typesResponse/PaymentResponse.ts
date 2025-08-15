import { User } from "@/types/User";
import { PaymentDataResponse } from "./PaymentDataResponse";
import { Service } from "@/types/Service";
import { PaymentStatus } from "@/types/PaymentStatus";

// SÍ SE USA
export type PaymentResponse = {
  payment_id: number;
  person: User;
  service: Service;
  payment_data: PaymentDataResponse;
  payment_status: PaymentStatus;
  discount_id: number | null; // Está vacío en tu ejemplo
  payment_data_id: number;
  service_price: number;
  discount_percentage: number | null; // Está vacío en tu ejemplo
  total_amount: number;
  created_by: string;
  modified_by: string | null;
  creation_date: string; // formato: 'YYYY-MM-DD HH:mm:ss'
  modification_date: string | null;
};
