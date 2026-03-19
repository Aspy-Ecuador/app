// FINAL
export interface Receipt {
  receipt_id: number;
  payment_id: number;

  receipt_status_id: number;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
