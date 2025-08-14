// Hay que instalar npm install @mui/lab@6.0.0-beta.32
import { User } from "@/types/User";
import { useNavigate, useLocation } from "react-router-dom";
import { Appointment } from "@/types/Appointment";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  getAppointmentsReport,
  getReportsUser,
  translateStatus,
} from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { AppointmentReport } from "@/types/AppointmentReport";

interface TimeLinePatientsProps {
  patient: User;
}

export default function TimeLinePatients({ patient }: TimeLinePatientsProps) {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const navigate = useNavigate();
  const location = useLocation();

  const appointmentsReport: AppointmentReport[] = getAppointmentsReport(data);

  const appointmentsReportUser: AppointmentReport[] = getReportsUser(
    appointmentsReport,
    patient.person_id
  );

  //const appointmentsUser: Appointment[] =
  const handleMoreInfo = (appointment: Appointment) => {
    navigate(`${location.pathname}/${appointment.id_appointment}`);
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
              <Grid size={8}>
                <Typography variant="body1">
                  <strong>Fecha:</strong> {report.appointment.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Hora:</strong> {report.appointment.startTime} -{" "}
                  {report.appointment.endTime}
                </Typography>
                <Typography variant="body1">
                  <strong>Profesional:</strong>{" "}
                  {report.appointment.proffesional.full_name}
                </Typography>
                <Typography variant="body1">
                  <strong>
                    {translateStatus(report.appointment.status.name)}
                  </strong>
                </Typography>
              </Grid>
              <Grid
                size={4}
                container
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  onClick={() => handleMoreInfo(report.appointment)}
                  className="button-ver-detalles"
                >
                  Ver detalles
                </Button>
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
