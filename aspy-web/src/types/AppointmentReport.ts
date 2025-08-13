// SÍ SE USA
import { Appointment } from "@/types/Appointment";

export type AppointmentReport = {
  appointment: Appointment;
  appointment_report_id: number;
  comments: string;
  sign: string;
  creation_date: string;
};
