// FINAL
// Hay que instalar npm install @mui/lab@6.0.0-beta.32
import { useNavigate, useLocation } from "react-router-dom";
import { estadoCita } from "@utils/estadoCita";
import { horaCorta } from "@utils/utils";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { getReportsUser } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import type { Person } from "@/typesResponse/Person";
import type { AppointmentWithReports } from "@/types/AppointmentWithReports";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { aspy } from "@shared-theme/themePrimitives";

// ─── Paleta del logo ASPY ────────────────────────────────────────
const C = {
  blue: "#5BB8D4",
  blueDark: "#3A9AB8",
  blueLight: aspy.blueLight,
  pink: "#E8A0B0",
  pinkLight: aspy.pinkLight,
  yellow: "#F0C84A",
  yellowLight: aspy.yellowLight,
  black: aspy.text,
  muted: aspy.muted,
  border: aspy.border,
};


interface TimeLinePatientsProps {
  patient: Person;
}

export default function TimeLinePatients({ patient }: TimeLinePatientsProps) {
  const { data, loading } = useRoleData();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <Progress />;

  const appointmentsReportUser: AppointmentWithReports[] = getReportsUser(
    data.appointmentReports,
    patient.user_id,
    data.appointments,
  );

  const handleMoreInfo = (appointmentId: number) => {
    navigate(`${location.pathname}/${appointmentId}`);
  };

  if (appointmentsReportUser.length === 0) {
    return (
      <Box
        sx={{
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          p: 5,
          textAlign: "center",
          color: C.muted,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="body2">
          No hay citas registradas para este paciente.
        </Typography>
      </Box>
    );
  }

  return (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
      }}
    >
      {appointmentsReportUser.map((report, index) => {
        // Mismos colores que la leyenda del calendario (un solo mapa por id de estado)
        const estado = estadoCita(report.appointment_status);
        const dot = { bg: estado.bg, border: estado.main };
        const chip = { label: estado.nombre, bgcolor: estado.bg, color: estado.fg, border: estado.border };
        const isLast = index === appointmentsReportUser.length - 1;

        return (
          <TimelineItem key={index}>
            <TimelineSeparator>
              {/* Dot personalizado */}
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: dot.bg,
                  border: `2px solid ${dot.border}`,
                  mt: 2.2,
                  flexShrink: 0,
                }}
              />
              {!isLast && (
                <TimelineConnector sx={{ bgcolor: C.border, width: "1px" }} />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ pb: 2.5, pt: 0.5 }}>
              {/* Card de cita */}
              <Box
                sx={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 2.5,
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 18px rgba(91,184,212,0.15)",
                    borderColor: C.blue,
                  },
                }}
              >
                {/* Franja de color superior según estado */}
                <Box sx={{ height: 3, bgcolor: dot.border }} />

                <Box sx={{ p: 2 }}>
                  {/* Fila superior: fecha + chip de estado */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <CalendarMonthRoundedIcon
                        sx={{ fontSize: 15, color: C.blue }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        {report.worker_schedule.schedule.date.split("T")[0]}
                      </Typography>
                    </Box>
                    <Chip
                      label={chip.label}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        bgcolor: chip.bgcolor,
                        color: chip.color,
                        border: `1px solid ${chip.border}`,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Box>

                  {/* Datos de la cita */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <AccessTimeRoundedIcon
                        sx={{ fontSize: 14, color: C.muted }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: C.muted, fontSize: "0.8rem" }}
                      >
                        {horaCorta(report.worker_schedule.schedule.start_time)} —{" "}
                        {horaCorta(report.worker_schedule.schedule.end_time)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <PersonRoundedIcon
                        sx={{ fontSize: 14, color: C.muted }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: C.muted, fontSize: "0.8rem" }}
                      >
                        {report.professional.first_name}{" "}
                        {report.professional.last_name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Botón */}
                  <Button
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                    onClick={() => handleMoreInfo(report.appointment_id)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      color: C.blueDark,
                      bgcolor: C.blueLight,
                      border: `1px solid ${C.blue}55`,
                      "&:hover": { bgcolor: `${C.blue}59`, borderColor: C.blue },
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
