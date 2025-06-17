import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Appointment } from "@/types/Appointment";
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

interface ShowAppointmentProps {
  citasSinMarcar: Appointment[];
  citasSinReporte: Appointment[];
}

export default function ShowAppointment({
  citasSinMarcar,
  citasSinReporte,
}: ShowAppointmentProps) {
  const navigate = useNavigate();

  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  return (
    <Grid container spacing={2} className={themeClass}>
      <Grid size={12}>
        <Typography variant="h3">Citas sin marcar:</Typography>
      </Grid>

      <Grid size={12} container alignItems="center" justifyContent="center">
        {citasSinMarcar.length > 0 ? (
          citasSinMarcar.map((cita, index) => (
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
                      Paciente: {cita.patient.firstName + cita.patient.lastName}
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
                        aria-labelledby={`opciones-${index}`}
                        name={`opcion-cita-${index}`}
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Asistió"
                        />
                        <FormControlLabel
                          value="male"
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
        {citasSinReporte.length > 0 ? (
          citasSinReporte.map((cita, index) => (
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
                      Paciente: {cita.patient.firstName + cita.patient.lastName}
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
                        const newPath = `pacientes/${cita.patient.id}-${cita.patient.firstName.toLowerCase()}/nuevoReporte`;
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
    </Grid>
  );
}
