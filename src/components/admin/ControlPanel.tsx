import { useNavigate } from "react-router-dom";
import { ButtonControl } from "@/types/ButtonControl";
/* getAuthenticatedUserEmail */
import { getAuthenticatedUserName } from "@store";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Overview from "@admin/Overview";
import ButtonList from "@components/ButtonList";
import WelcomePanel from "@components/WelcomePanel";

import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function ControlPanel() {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    const newPath = `/nuevo-usuario`;
    navigate(newPath);
  };

  const handleCreateService = () => {
    const newPath = `/nuevo-servicio`;
    navigate(newPath);
  };

  const botones: ButtonControl[] = [
    {
      text: "Agregar Usuario",
      icon: <AccountCircleOutlinedIcon className="boton-panelcontrol" />,
      accion: handleCreateUser,
    },
    {
      text: "Agregar Servicio",
      icon: <PostAddOutlinedIcon className="boton-panelcontrol" />,
      accion: handleCreateService,
    },
  ];

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Administrador " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={8} className="grid-overview">
          <Overview />
        </Grid>

        <Grid size={4} className="gird-botones-citas">
          <ButtonList botones={botones} />
        </Grid>
      </Grid>
    </Box>
  );
}
