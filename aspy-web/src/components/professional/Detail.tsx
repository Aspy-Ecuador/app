// FINAL
import { useRoleData } from "@/observer/RoleDataContext";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentsReport } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Progress from "@components/Progress";
import LogoClaro from "@assets/logo mediano.png";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import type { AppointmentWithReports } from "@/types/AppointmentWithReports";

export default function AppointmentDetail() {
  const { data, loading } = useRoleData();
  const { id, citaId } = useParams();
  const navigate = useNavigate();

  if (loading) return <Progress />;

  const user_id = id ? parseInt(id) : 0;
  const cita_id = citaId ? parseInt(citaId) : 0;

  if (user_id === 0 || cita_id === 0) {
    navigate("/");
    return null;
  }

  const appointment: AppointmentWithReports = getAppointmentsReport(
    data.appointmentReports,
    data.appointments,
    user_id,
    cita_id,
  );

  const initials = (first: string, last: string) =>
    `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 1.5,
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          Detalles de la cita
        </Typography>
        <Chip
          label={`#${appointment?.appointment_id}`}
          size="small"
          sx={{
            ml: "auto",
            bgcolor: "#E6F1FB",
            color: "#185FA5",
            fontWeight: 500,
            fontSize: 11,
            height: 22,
            "& .MuiChip-label": { px: 1.25 },
          }}
        />
      </Box>

      {/* ── Contenido ── */}
      <Grid container spacing={1.5} alignItems="flex-start">
        {/* ── Panel izquierdo: info de la cita ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            {/* Logo / cabecera de la organización */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Fundación ASPY
              </Typography>
              <img
                src={LogoClaro}
                alt="Logo"
                style={{ height: 28, objectFit: "contain" }}
              />
            </Box>

            <Box
              sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Fecha y hora */}
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    letterSpacing: 2,
                    fontSize: 10,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Horario
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayRoundedIcon
                      sx={{ fontSize: 14, color: "text.disabled" }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {appointment?.worker_schedule.schedule.date.split("T")[0]}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeRoundedIcon
                      sx={{ fontSize: 14, color: "text.disabled" }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {appointment?.worker_schedule.schedule.start_time}
                      {" – "}
                      {appointment?.worker_schedule.schedule.end_time}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* Profesional */}
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    letterSpacing: 2,
                    fontSize: 10,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Profesional
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "#E6F1FB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#185FA5",
                      flexShrink: 0,
                    }}
                  >
                    {initials(
                      appointment?.professional.first_name,
                      appointment?.professional.last_name,
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment?.professional.first_name}{" "}
                      {appointment?.professional.last_name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PersonOutlineRoundedIcon
                        sx={{ fontSize: 12, color: "text.disabled" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Profesional
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Paciente */}
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    letterSpacing: 2,
                    fontSize: 10,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Paciente
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "#EAF3DE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#3B6D11",
                      flexShrink: 0,
                    }}
                  >
                    {initials(
                      appointment?.client.first_name,
                      appointment?.client.last_name,
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment?.client.first_name}{" "}
                      {appointment?.client.last_name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PersonOutlineRoundedIcon
                        sx={{ fontSize: 12, color: "text.disabled" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Paciente
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* ── Panel derecho: visor PDF ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "78vh",
            }}
          >
            {/* Barra del visor */}
            <Box
              sx={{
                px: 2,
                py: 1,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 15, color: "text.disabled" }}
              />
              <Typography variant="caption" color="text.secondary">
                Reporte de la cita #{appointment?.appointment_id}
              </Typography>
            </Box>

            {/* Cuerpo del visor */}
            <Box sx={{ flex: 1, position: "relative", minHeight: "70vh" }}>
              {appointment?.report?.file ? (
                <iframe
                  src={appointment.report.file}
                  title="Vista previa del reporte"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    display: "block",
                    position: "absolute",
                    inset: 0,
                  }}
                />
              ) : (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%", gap: 1.5, py: 10 }}
                >
                  <InsertDriveFileOutlinedIcon
                    sx={{ fontSize: 40, color: "text.disabled" }}
                  />
                  <Typography variant="body2" color="text.disabled">
                    No hay reporte disponible para esta cita
                  </Typography>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
