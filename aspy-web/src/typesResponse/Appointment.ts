// FINAL
import type { Service } from "@/typesResponse/Service";
import type { Person } from "@/typesResponse/Person";
import type { AppointmentStatus } from "@/typesResponse/AppointmentStatus";
import type { WorkerSchedule } from "@/typesResponse/WorkerSchedule";

export interface Appointment {
  appointment_id: number;

  payment_id: number;

  appointment_status: AppointmentStatus;

  client: Person;
  professional: Person;

  service: Service;
  worker_schedule: WorkerSchedule;
  created_by: string;
  modified_by: string;
  creation_date: string;
  modification_date: string;

  /** true si la cita es virtual (tiene un enlace de reunión guardado). */
  es_virtual?: boolean;
  /**
   * Enlace de la reunión (Zoom, Teams o Meet). Al paciente le llega solo cuando su cita está Agendada;
   * su profesional, Secretaría y el Admin lo ven siempre.
   */
  enlace_virtual?: string | null;
}
