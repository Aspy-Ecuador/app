// SÍ SE USA
export interface ReceiptResponse {
  receipt_id: number;
  payment_id: number;
  number: string;
  issueDate: string;
  clientName: string;
  address: string;
  serviceName: string;
  servicePrice: number;
  discount_percentage: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  contactEmail: string;
  contactPhone: string;
}
