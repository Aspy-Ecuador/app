import { Appointment } from "@/types/Appointment";
import { AppointmentReport } from "@/types/AppointmentReport";
import { AppointmentReportResponse } from "@/typesResponse/AppointmentReportResponse";

export function appointmentReportResponseAdapter(
  appointment: Appointment,
  appointmentReport: AppointmentReportResponse
): AppointmentReport {
  return {
    appointment: appointment,
    appointment_report_id: appointmentReport.appointment_report_id,
    comments: appointmentReport.comments,
    sign: appointmentReport.sign,
    creation_date: appointmentReport.creation_date,
  };
}
