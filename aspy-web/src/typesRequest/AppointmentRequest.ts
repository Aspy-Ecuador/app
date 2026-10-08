// FINAL
export type AppointmentRequest = {
  payment_type: string;
  payment_file: string; // referencia al comprobante subido antes ("privado:123", ver archivoAPI)
  client_id?: number;
  professional_id?: number;
  service_id?: number;
  worker_schedule_id: number;
};
