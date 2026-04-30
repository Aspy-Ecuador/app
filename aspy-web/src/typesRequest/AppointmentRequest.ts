// FINAL
export type AppointmentRequest = {
  payment_type: string;
  payment_file: string; // URL de Cloudinary (imagen o PDF)
  client_id?: number;
  professional_id?: number;
  service_id?: number;
  worker_schedule_id: number;
};
