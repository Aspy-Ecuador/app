// FINAL
import { Service } from "@/typesResponse/Service";
import { Person } from "@/typesResponse/Person";
import { AppointmentStatus } from "@/typesResponse/AppointmentStatus";
import { WorkerSchedule } from "@/typesResponse/WorkerSchedule";

export interface Appointment {
  appointment_id: number;

  appointment_status: AppointmentStatus;

  client: Person;
  professional: Person;

  service: Service;
  worker_schedule: WorkerSchedule;
}
