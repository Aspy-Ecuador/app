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
import ConfirmDialog from "@professional/ConfirmDialog";
import appointmentAPI from "@/API/appointmentAPI";
import { useRoleData } from "@/observer/RoleDataContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ShowAppointmentProps {
  unmarkedAppointmentsProp: Appointment[];
  unreportedAppointments: Appointment[];
}

type ActionType = "complete" | "missed" | null;

export default function ShowAppointment({
  unmarkedAppointmentsProp,
  unreportedAppointments,
}: ShowAppointmentProps) {
  const [unmarkedAppointments, setUnmarkedAppointments] = useState(
    unmarkedAppointmentsProp,
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const {
    refreshAppointments,
    refreshServices,
    refreshPersons,
    refreshAppointmentReports,
  } = useRoleData();

  const handleSelectAction = (cita: Appointment, action: ActionType) => {
    (document.activeElement as HTMLElement)?.blur();
    setSelectedAppointment(cita);
    setPendingAction(action);
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    (document.activeElement as HTMLElement)?.blur();

    if (!selectedAppointment || !pendingAction) return;

    const { appointment_id } = selectedAppointment;

    try {
      if (pendingAction === "complete") {
        await appointmentAPI.completeAppointment(appointment_id);
      } else if (pendingAction === "missed") {
        await appointmentAPI.missedAppointment(appointment_id);
      }

      setUnmarkedAppointments((prev) =>
        prev.filter((cita) => cita.appointment_id !== appointment_id),
      );

      await refreshAppointments();
      await refreshServices();
      await refreshPersons();
      await refreshAppointmentReports();
    } finally {
      setOpenDialog(false);
      setSelectedAppointment(null);
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    (document.activeElement as HTMLElement)?.blur();
    setOpenDialog(false);
    setSelectedAppointment(null);
    setPendingAction(null);
  };

  const sxCard = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    transition: "border-color 0.2s",
    "&:hover": { borderColor: "primary.light" },
  };

  const sxRow = {
    justifyContent: "space-between",
    alignItems: "center",
    py: 0.5,
  };

  return (
    <Grid container spacing={3}>
      {/* ── Sección: Citas sin marcar ── */}
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
                    <Typography variant="body2" fontWeight={600}>
                      {cita.client.first_name} {cita.client.last_name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={sxRow}>
                    <Typography variant="caption" color="text.secondary">
                      Servicio
                    </Typography>
                    <Typography variant="body2">{cita.service.name}</Typography>
                  </Stack>
                  <Stack direction="row" sx={sxRow}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha
                    </Typography>
                    <Typography variant="body2">
                      {cita.worker_schedule.schedule.date}
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
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => handleSelectAction(cita, "complete")}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Asistió
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={() => handleSelectAction(cita, "missed")}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    No asistió
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

      {/* ── Sección: Citas sin reportar ── */}
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
                    <Typography variant="body2">{cita.service.name}</Typography>
                  </Stack>
                  <Stack direction="row" sx={sxRow}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha
                    </Typography>
                    <Typography variant="body2">
                      {cita.worker_schedule.schedule.date}
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
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() =>
                      navigate(`pacientes/${cita.appointment_id}/nuevoReporte`)
                    }
                    sx={{ borderRadius: 2, textTransform: "none" }}
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

      <ConfirmDialog
        open={openDialog}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        value={pendingAction ?? ""}
      />
    </Grid>
  );
}
