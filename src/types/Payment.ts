import { FileData } from "@/types/FileData";

export interface Payment {
  id: number;
  person: string;
  service: string;
  paymentMethod: string;
  file: FileData;
  service_price: number;
  discount_percentage: number;
  total_amount: number;
  status: boolean;
  address: string;
  contactEmail: string;
  contactPhone: string;
  creation_date: string;
  modification_date: string;
}
