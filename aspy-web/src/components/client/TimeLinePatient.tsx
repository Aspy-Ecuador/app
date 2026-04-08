// Hay que instalar npm install @mui/lab@6.0.0-beta.32
// FINAL
import type { Appointment } from "@/typesResponse/Appointment";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getReportsUser, translateStatus } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";
import type { AppointmentWithReports } from "@/types/AppointmentWithReports";

interface TimeLinePatientsProps {
  patient_id: number;
  onSelectComments: (comments: string) => void;
}

export default function TimeLinePatients({
  patient_id,
  onSelectComments,
}: TimeLinePatientsProps) {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const appointments: Appointment[] = data.appointments || [];
  const appointmentsReport: AppointmentReport[] = data.appointmentReports || [];

  const appointmentsReportUser: AppointmentWithReports[] = getReportsUser(
    appointmentsReport,
    patient_id,
    appointments,
  );

  const handleMoreInfo = (report: AppointmentWithReports) => {
    onSelectComments(report.report?.file || "");
  };

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {appointmentsReportUser.map((report, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot /*color={cita.asistio ? "success" : "error"}*/ />
            {index < appointmentsReportUser.length && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Grid container spacing={10} sx={{ marginBottom: "3%" }}>
              <Grid size={6}>
                <Typography variant="body1">
                  <strong>Fecha:</strong> {report.worker_schedule.schedule.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Hora:</strong>{" "}
                  {report.worker_schedule.schedule.start_time} -{" "}
                  {report.worker_schedule.schedule.end_time}
                </Typography>
                <Typography variant="body1">
                  <strong>Profesional:</strong> {report.professional.first_name}{" "}
                  {report.professional.last_name}
                </Typography>
                <Typography variant="body1">
                  <strong>
                    {translateStatus(report.appointment_status.name)}
                  </strong>
                </Typography>
              </Grid>
              <Grid
                size={6}
                container
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  onClick={() => handleMoreInfo(report)}
                  className="button-ver-detalles"
                >
                  Ver Reporte
                </Button>
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
