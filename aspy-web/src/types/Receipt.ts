// SÍ SE USA
import { User } from "@/types/User";
import { PaymentDataResponse } from "@/typesResponse/PaymentDataResponse";
import { ReceiptResponse } from "@/typesResponse/ReceiptResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";

export type Receipt = {
  receipt: ReceiptResponse;
  payment_data: PaymentDataResponse;
  service: ServiceResponse;
  client: User;
  date: string;
};
