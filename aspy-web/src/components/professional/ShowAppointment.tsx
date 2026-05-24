// FINAL
import { useNavigate } from "react-router-dom";
import type { Appointment } from "@/typesResponse/Appointment";
import { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Success from "@components/Success";
import appointmentAPI from "@/API/appointmentAPI";
import { useRoleData } from "@/observer/RoleDataContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ShowAppointmentProps {
  unmarkedAppointmentsProp: Appointment[];
  unreportedAppointments: Appointment[];
}

// id de la cita + qué acción está cargando
type LoadingState = { id: number; action: "complete" | "missed" } | null;

export default function ShowAppointment({
  unmarkedAppointmentsProp,
  unreportedAppointments,
}: ShowAppointmentProps) {
  const [unmarkedAppointments, setUnmarkedAppointments] = useState(
    unmarkedAppointmentsProp,
  );
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFail, setIsFail] = useState(false);

  const navigate = useNavigate();
  const {
    refreshAppointments,
    refreshServices,
    refreshPersons,
    refreshAppointmentReports,
  } = useRoleData();

  const handleAction = async (
    cita: Appointment,
    action: "complete" | "missed",
  ) => {
    setLoadingState({ id: cita.appointment_id, action });
    try {
      if (action === "complete") {
        await appointmentAPI.completeAppointment(cita.appointment_id);
        setSuccessMessage(`${cita.client.first_name} marcado como asistido`);
      } else {
        await appointmentAPI.missedAppointment(cita.appointment_id);
        setSuccessMessage(`${cita.client.first_name} marcado como no asistido`);
      }
      await refreshAppointments();
      await refreshServices();
      await refreshPersons();
      await refreshAppointmentReports();
      setUnmarkedAppointments((prev) =>
        prev.filter((c) => c.appointment_id !== cita.appointment_id),
      );
      setIsFail(false);
      setSuccessOpen(true);
    } catch {
      setIsFail(true);
      setSuccessMessage("Ocurrió un error al actualizar la cita");
      setSuccessOpen(true);
    } finally {
      setLoadingState(null);
    }
  };

  const isLoading = (id: number, action: "complete" | "missed") =>
    loadingState?.id === id && loadingState?.action === action;

  const anyLoading = loadingState !== null;

  const sxCard = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": {
      borderColor: "primary.light",
      boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    },
  };

  const sxRow = {
    justifyContent: "space-between",
    alignItems: "center",
    py: 0.5,
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* ── Citas sin marcar ── */}
        <Grid size={12}>
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", letterSpacing: 2 }}
          >
            Citas sin marcar
          </Typography>
        </Grid>

        <Grid size={12} container spacing={2} justifyContent="center">
          {unmarkedAppointments.length > 0 ? (
            unmarkedAppointments.map((cita) => (
              <Grid key={cita.appointment_id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={sxCard}>
                  <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Paciente
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "right" }}
                        fontWeight={600}
                      >
                        {cita.client.first_name} {cita.client.last_name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Servicio
                      </Typography>
                      <Typography variant="body2">
                        {cita.service.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Fecha
                      </Typography>
                      <Typography variant="body2">
                        {cita.worker_schedule.schedule.date.split("T")[0]}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Hora
                      </Typography>
                      <Chip
                        label={`${cita.worker_schedule.schedule.start_time} – ${cita.worker_schedule.schedule.end_time}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: "monospace", fontSize: 11 }}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                    {/* Botón Asistió */}
                    <Button
                      fullWidth
                      size="small"
                      disabled={anyLoading}
                      startIcon={
                        isLoading(
                          cita.appointment_id,
                          "complete",
                        ) ? undefined : (
                          <CheckCircleOutlineIcon fontSize="small" />
                        )
                      }
                      onClick={() => handleAction(cita, "complete")}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        minHeight: 34,
                        bgcolor: "#D1FAE5",
                        color: "#065F46",
                        border: "1px solid #6EE7B7",
                        "&:hover": {
                          bgcolor: "#A7F3D0",
                          borderColor: "#34D399",
                        },
                        "&:disabled": {
                          bgcolor: "#D1FAE588",
                          color: "#065F4688",
                        },
                      }}
                    >
                      {isLoading(cita.appointment_id, "complete") ? (
                        <CircularProgress size={16} sx={{ color: "#065F46" }} />
                      ) : (
                        "Asistió"
                      )}
                    </Button>

                    {/* Botón No asistió */}
                    <Button
                      fullWidth
                      size="small"
                      disabled={anyLoading}
                      startIcon={
                        isLoading(cita.appointment_id, "missed") ? undefined : (
                          <CancelOutlinedIcon fontSize="small" />
                        )
                      }
                      onClick={() => handleAction(cita, "missed")}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        minHeight: 34,
                        bgcolor: "#FEE2E2",
                        color: "#991B1B",
                        border: "1px solid #FCA5A5",
                        "&:hover": {
                          bgcolor: "#FECACA",
                          borderColor: "#F87171",
                        },
                        "&:disabled": {
                          bgcolor: "#FEE2E288",
                          color: "#991B1B88",
                        },
                      }}
                    >
                      {isLoading(cita.appointment_id, "missed") ? (
                        <CircularProgress size={16} sx={{ color: "#991B1B" }} />
                      ) : (
                        "No asistió"
                      )}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Typography variant="body2" align="center" color="text.disabled">
                No hay citas que marcar
              </Typography>
            </Grid>
          )}
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        {/* ── Citas sin reportar ── */}
        <Grid size={12}>
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", letterSpacing: 2 }}
          >
            Citas sin reportar
          </Typography>
        </Grid>

        <Grid size={12} container spacing={2} justifyContent="center">
          {unreportedAppointments.length > 0 ? (
            unreportedAppointments.map((cita) => (
              <Grid key={cita.appointment_id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={sxCard}>
                  <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Paciente
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {cita.client.first_name} {cita.client.last_name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Servicio
                      </Typography>
                      <Typography variant="body2">
                        {cita.service.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Fecha
                      </Typography>
                      <Typography variant="body2">
                        {cita.worker_schedule.schedule.date.split("T")[0]}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={sxRow}>
                      <Typography variant="caption" color="text.secondary">
                        Hora
                      </Typography>
                      <Chip
                        label={cita.worker_schedule.schedule.start_time}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: "monospace", fontSize: 11 }}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      size="small"
                      startIcon={<AddCircleOutlineIcon fontSize="small" />}
                      onClick={() =>
                        navigate(
                          `/pacientes/${cita.appointment_id}/nuevoReporte`,
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        minHeight: 34,
                        bgcolor: "#DBEAFE",
                        color: "#1E40AF",
                        border: "1px solid #93C5FD",
                        "&:hover": {
                          bgcolor: "#BFDBFE",
                          borderColor: "#60A5FA",
                        },
                      }}
                    >
                      Nuevo Reporte
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Typography variant="body2" align="center" color="text.disabled">
                No hay citas que reportar
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Success
        open={successOpen}
        handleClose={() => setSuccessOpen(false)}
        isRegister={false}
        message={successMessage}
        fail={isFail}
      />
    </>
  );
}
