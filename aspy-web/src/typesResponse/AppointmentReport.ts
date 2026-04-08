// FINAL
export type Appointment = {
  appointment_id: number;
  appointment_status_id: number;
  client_id: number;
  professional_id: number;
  service_id: number;
  worker_schedule_id: number;
  payment_id: number;
  created_by: number | null;
  modified_by: number | null;
  creation_date: string;
  modification_date: string;
};

export type AppointmentReport = {
  appointment_report_id: number;
  appointment_id: number;
  file: string;
  sign: string;
  created_by: number | null;
  modified_by: number | null;
  creation_date: string;
  modification_date: string;
  appointment: Appointment;
};
