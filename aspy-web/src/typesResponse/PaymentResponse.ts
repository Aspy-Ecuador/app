// SÍ SE USA
export type PaymentResponse = {
  payment_id: number;
  person_id: number;
  service_id: number;
  discount_id: number | null; // Está vacío en tu ejemplo
  payment_data_id: number;
  service_price: number;
  discount_percentage: number | null; // Está vacío en tu ejemplo
  total_amount: number;
  status: number; // Ej. 1 = activo, 0 = inactivo (según convención común)
  created_by: string;
  modified_by: string | null;
  creation_date: string; // formato: 'YYYY-MM-DD HH:mm:ss'
  modification_date: string | null;
};
