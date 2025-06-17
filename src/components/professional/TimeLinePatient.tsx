// Hay que instalar npm install @mui/lab@6.0.0-beta.32
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { citas } from "@data/Citas";
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

export default function TimeLinePatients() {
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  const navigate = useNavigate();
  const location = useLocation();

  const handleMoreInfo = (cita: Appointment) => {
    navigate(`${location.pathname}/${cita.id}`);
  };

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
      className={themeClass}
    >
      {citas.map((cita, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot /*color={cita.asistio ? "success" : "error"}*/ />
            {index < citas.length && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Grid container spacing={10} sx={{ marginBottom: "3%" }}>
              <Grid size={8}>
                <Typography variant="body1">
                  <strong>Fecha:</strong> {cita.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Hora:</strong> {cita.startTime} - {cita.endTime}
                </Typography>
                <Typography variant="body1">
                  <strong>Profesional:</strong> {cita.professional.first_name}{" "}
                  {cita.patient.last_name}
                </Typography>
                <Typography variant="body1">
                  <strong>{cita.assist ? "Asistió" : "No Asistió"}</strong>
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
                  onClick={() => handleMoreInfo(cita)}
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
