export type AppointmentRequest = {
  payment_data: {
    type: string;
    number: number;
    file: string; // URL de Cloudinary (imagen o PDF)
  };
  payment: {
    person_id: number;
    service_id: number;
    service_price: number;
    total_amount: number;
  };
  scheduled_by: number;
  worker_schedule_id: number;
};
