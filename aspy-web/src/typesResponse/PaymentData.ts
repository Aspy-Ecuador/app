// FINAL
export interface PaymentData {
  payment_data_id: number;
  client_id: number;

  type: string;
  file: string | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
