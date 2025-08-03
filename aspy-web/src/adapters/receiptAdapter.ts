import { Receipt } from "@/types/Receipt";
import { ReceiptResponse } from "@/typesResponse/ReceiptResponse";
import { PaymentDataResponse } from "@/typesResponse/PaymentDataResponse";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { User } from "@/types/User";

export function receiptAdapter(
  receipt: ReceiptResponse,
  paymentData: PaymentDataResponse,
  service: ServiceResponse,
  client: User
): Receipt {
  const datehour: string = receipt.creation_date.split(" ")[0];
  return {
    receipt,
    payment_data: paymentData,
    service,
    client,
    date: datehour,
  };
}
