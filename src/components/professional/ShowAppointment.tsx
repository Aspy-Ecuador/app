import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { Appointment } from "@/types/Appointment";
import { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import ConfirmDialog from "@professional/ConfirmDialog";

interface ShowAppointmentProps {
  unmarkedAppointmentsProp: Appointment[];
  unreportedAppointments: Appointment[];
}

export default function ShowAppointment({
  unmarkedAppointmentsProp,
  unreportedAppointments,
}: ShowAppointmentProps) {
  const [unmarkedAppointments, setUnmarkedAppointments] = useState(
    unmarkedAppointmentsProp
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [assistMap, setAssistMap] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const theme = useTheme().palette.mode;
  const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  const handleConfirmAssist = () => {
    (document.activeElement as HTMLElement)?.blur(); // ✅ esto
    if (selectedAppointment) {
      setUnmarkedAppointments((prev) =>
        prev.filter((cita) => cita.id !== selectedAppointment.id)
      );

      setAssistMap((prev) => {
        const updated = { ...prev };
        delete updated[selectedAppointment.id];
        return updated;
      });
    }
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleCancel = () => {
    (document.activeElement as HTMLElement)?.blur(); // ✅ esto
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  return (
    <Grid container spacing={2} className={themeClass}>
      <Grid size={12}>
        <Typography variant="h3">Citas sin marcar:</Typography>
      </Grid>

      <Grid size={12} container alignItems="center" justifyContent="center">
        {unmarkedAppointments.length > 0 ? (
          unmarkedAppointments.map((cita, index) => (
            <Grid key={index} size={12} sx={{ maxWidth: 310 }}>
              <Card variant="outlined">
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography gutterBottom variant="h6">
                      Paciente:{" "}
                      {cita.patient.first_name + " " + cita.patient.last_name}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <FormControl>
                      <FormLabel id={`opciones-${index}`}>
                        Seleccione una opción
                      </FormLabel>
                      <RadioGroup
                        row
                        name={`opcion-cita-${index}`}
                        value={assistMap[cita.id] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAssistMap((prev) => ({
                            ...prev,
                            [cita.id]: value,
                          }));

                          setSelectedAppointment(cita);
                          setOpenDialog(true);
                        }}
                      >
                        <FormControlLabel
                          value="assist"
                          control={<Radio />}
                          label="Asistió"
                        />
                        <FormControlLabel
                          value="no-assist"
                          control={<Radio />}
                          label="No asistió"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography variant="h4" align="center">
              No hay citas que marcar
            </Typography>
          </Grid>
        )}
      </Grid>

      <Grid size={12}>
        <Divider className="divider-paciente-historial" />
      </Grid>

      <Grid size={12}>
        <Typography variant="h3">Citas sin reportar:</Typography>
      </Grid>

      <Grid size={12} container alignItems="center" justifyContent="center">
        {unreportedAppointments.length > 0 ? (
          unreportedAppointments.map((cita, index) => (
            <Grid key={index} size={12} sx={{ maxWidth: 310 }}>
              <Card variant="outlined">
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography gutterBottom variant="h6">
                      Paciente:{" "}
                      {cita.patient.first_name + " " + cita.patient.last_name}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Button
                      onClick={() => {
                        const newPath = `pacientes/${cita.patient.id}-${cita.patient.first_name.toLowerCase()}/nuevoReporte`;
                        navigate(newPath);
                      }}
                      variant="outlined"
                      className="button-new-report"
                    >
                      Nuevo Reporte
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography variant="h4" align="center">
              No hay citas que reportar
            </Typography>
          </Grid>
        )}
      </Grid>

      <ConfirmDialog
        open={openDialog}
        onClose={handleCancel}
        onConfirm={handleConfirmAssist}
        value={selectedAppointment ? assistMap[selectedAppointment.id] : ""}
      />
    </Grid>
  );
}
