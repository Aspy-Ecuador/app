import { User } from "@/types/User";
import { PaymentDataResponse } from "./PaymentDataResponse";
import { Service } from "@/types/Service";
import { PaymentStatus } from "@/types/PaymentStatus";

// SÍ SE USA
export type PaymentResponse = {
  payment_id: number;
  person_id: number;
  service_id: number;
  discount_id: number | null;
  payment_data_id: number;
  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
  discount: any | null;
  discount_percentage: number | null;
  total_amount: string;
  service_price: string;
  payment_data: {
    payment_data_id: number;
    type: string;
    number: number;
    file: string;
    created_by: string;
    creation_date: string;
    modified_by: string | number | null;
    modification_date: string | null;
  };
  person: {
    person_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    full_name?: string;
    birthdate: string;
    gender: number;
    education: number;
    marital_status: number;
    occupation: number;
    created_by: string;
    creation_date: string;
    modified_by: string | null;
    modification_date: string | null;
    title?: string;
    about?: string;
    specialty?: string;
    password?: string;
  };
  service: {
    service_id: number;
    name: string;
    price: string;
    created_by: string;
    creation_date: string;
    modified_by: string | null;
    modification_date: string | null;
  };
  status: {
    status_id: number;
    name: string;
  };
};
