// SÍ SE USA
export type AppointmentResponse = {
  appointment_id: number;
  payment_id: number;
  scheduled_by: {
    person_id: number;
    user_id: number;
    first_name: string;
    last_name: string | null;
    birthdate: string;
    gender: string;
    occupation: string;
    marital_status: string;
    education: string;
    created_by: string;
    modified_by: string | null;
    creation_date: string;
    modification_date: string | null;
  };
  worker_schedule_id: number;
  tracking_appointment: any; // Puedes cambiar esto si sabes el tipo exacto
  status: {
    status_id: number;
    name: string;
  };
  created_by: string;
  modified_by: string | null;
  creation_date: string;
  modification_date: string | null;
  payment: {
    payment_id: number;
    person_id: number;
    service_id: number;
    discount_id: number | null;
    payment_data_id: number;
    service_price: string;
    discount_percentage: number | null;
    total_amount: string;
    status: number;
    created_by: string;
    modified_by: string | null;
    creation_date: string;
    modification_date: string | null;
  };
  worker_schedule: {
    worker_schedule_id: number;
    schedule_id: number;
    person_id: number;
    is_available: boolean;
    created_by: string;
    modified_by: string | null;
    creation_date: string;
    modification_date: string | null;
  };
};
