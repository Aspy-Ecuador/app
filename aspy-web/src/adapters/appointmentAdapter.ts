import { Appointment } from "@/types/Appointment";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import { ScheduleResponse } from "@/typesResponse/ScheduleResponse";
import { User } from "@/types/User";
import { Service } from "@/types/Service";

export function appointmentAdapter(
  appointment: AppointmentResponse,
  schedule: ScheduleResponse,
  client: User,
  professional: User,
  service: Service
): Appointment {
  return {
    id_appointment: appointment.appointment_id,
    service,
    client,
    proffesional: professional,
    status: {
      id_status: appointment.status.status_id,
      name: appointment.status.name,
    },
    date: schedule.date,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
  };
}
