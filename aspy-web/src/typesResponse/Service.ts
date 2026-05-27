// FINAL
export interface Service {
  service_id: number;

  name: string;
  price: number;

  is_available: boolean;
  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
