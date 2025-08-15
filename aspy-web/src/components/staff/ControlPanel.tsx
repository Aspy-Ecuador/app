import { useNavigate } from "react-router-dom";
import { getAuthenticatedUserName } from "@store";
import { ButtonControl } from "@/types/ButtonControl";
import { Appointment } from "@/types/Appointment";
import { getNextAppointments } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import ButtonList from "@components/ButtonList";
import ShowAppointment from "@staff/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";
import Typography from "@mui/material/Typography";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import Progress from "@components/Progress";

export default function ControlPanel() {
  const { data, loading } = useRoleData();

  const navigate = useNavigate();

  const handleCreateUser = () => {
    const newPath = `/registrarUsuario`;
    navigate(newPath);
  };

  const handleCreateService = () => {
    const newPath = `/crear-servicio`;
    navigate(newPath);
  };

  const handleCreateAppointment = () => {
    const newPath = `/agendar-cita`;
    navigate(newPath);
  };

  const botones: ButtonControl[] = [
    {
      text: "Registrar nuevo usuario",
      icon: <PermContactCalendarRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateUser,
    },
    {
      text: "Agregar Servicio",
      icon: <PersonAddAltRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateService,
    },
    {
      text: "Agendar Nueva Cita",
      icon: <EditCalendarRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateAppointment,
    },
  ];

  const appointments: Appointment[] = getNextAppointments(data);

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Secr. " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={8}>
          <Typography variant="h3">Citas de hoy:</Typography>
          <ShowAppointment appointments={appointments} />
        </Grid>

        <Grid size={4} className="gird-botones-citas">
          <ButtonList botones={botones} />
        </Grid>
      </Grid>
    </Box>
  );
}
