// FINAL
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUserName } from "@store";
import type { ButtonControl } from "@/types/ButtonControl";
import type { Appointment } from "@/typesResponse/Appointment";
import { getNextAppointments } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import Progress from "@components/Progress";
import ButtonList from "@components/ButtonList";
import ShowAppointment from "@staff/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";

export default function ControlPanel() {
  const { data, loading } = useRoleData();
  const navigate = useNavigate();

  const botones: ButtonControl[] = [
    {
      text: "Agendar cita",
      icon: <EditCalendarRoundedIcon />,
      accion: () => navigate("/agendar-cita"),
    },
    {
      text: "Registrar usuario",
      icon: <PermContactCalendarRoundedIcon />,
      accion: () => navigate("/registrarUsuario"),
    },
    {
      text: "Agregar servicio",
      icon: <PersonAddAltRoundedIcon />,
      accion: () => navigate("/crear-servicio"),
    },
  ];

  if (loading) return <Progress />;

  const appointments: Appointment[] = getNextAppointments(data.appointments);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <WelcomePanel user={"Secr. " + getAuthenticatedUserName()} />

      <Grid container spacing={2} alignItems="flex-start">


                {/* Sidebar de acciones — ancho completo en móvil, 4 en desktop */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 1.75,
                py: 1.25,
                borderBottom: "0.5px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                }}
              >
                Acciones rápidas
              </Typography>
            </Box>
            <Box sx={{ p: 0.75 }}>
              <ButtonList botones={botones} />
            </Box>
          </Paper>
        </Grid>

        {/* Columna de citas — ancho completo en móvil, 8 en desktop */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              mb: 1.25,
            }}
          >
            Citas de hoy
          </Typography>
          <ShowAppointment appointments={appointments} />
        </Grid>



      </Grid>
    </Box>
  );
}