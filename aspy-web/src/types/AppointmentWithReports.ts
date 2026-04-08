// FINAL
import type { Appointment } from "@/typesResponse/Appointment";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";

export type AppointmentWithReports = Appointment & {
  report: AppointmentReport | null;
};
