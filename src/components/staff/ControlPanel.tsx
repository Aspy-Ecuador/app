import { useNavigate } from "react-router-dom";
import { getAuthenticatedUserName } from "@store";
import { citas } from "@data/Citas";
import { ButtonControl } from "@/types/ButtonControl";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import ButtonList from "@components/ButtonList";
import ShowAppointment from "@components/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";
import Typography from "@mui/material/Typography";

import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";

export default function ControlPanel() {
  const navigate = useNavigate();

  const handleCreatePatient = () => {
    const newPath = `/crear-paciente`;
    navigate(newPath);
  };

  const handleCreateService = () => {
    const newPath = `/crear-servicio`;
    navigate(newPath);
  };

  const handleCreateProfessional = () => {
    const newPath = `/crear-profesional`;
    navigate(newPath);
  };

  const handleCreateAppointment = () => {
    const newPath = `/agendar-cita`;
    navigate(newPath);
  };

  const botones: ButtonControl[] = [
    {
      text: "Agregar Profesional",
      icon: <PersonAddAltRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateProfessional,
    },
    {
      text: "Agregar Paciente",
      icon: <PermContactCalendarRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreatePatient,
    },
    {
      text: "Agregar Servicio",
      icon: <MedicalServicesRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateService,
    },
    {
      text: "Agendar Nueva Cita",
      icon: <EditCalendarRoundedIcon className="boton-panelcontrol" />,
      accion: handleCreateAppointment,
    },
  ];

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Secr. " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={8}>
          <Typography variant="h3">Proximas citas:</Typography>
          <ShowAppointment citas={citas} />
        </Grid>

        <Grid size={4} className="gird-botones-citas">
          <ButtonList botones={botones} />
        </Grid>
      </Grid>
    </Box>
  );
}
