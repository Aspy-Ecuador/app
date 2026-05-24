// FINAL
import { useNavigate } from "react-router-dom";
import type { ButtonControl } from "@/types/ButtonControl";
import { getAuthenticatedUserName } from "@store";
import { useRoleData } from "@/observer/RoleDataContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Overview from "@admin/Overview";
import ButtonList from "@components/ButtonList";
import WelcomePanel from "@components/WelcomePanel";
import Progress from "@components/Progress";

import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function ControlPanel() {
  const navigate = useNavigate();
  const { loading } = useRoleData();

  if (loading) return <Progress />;

  const handleCreateUser = () => navigate("/nuevo-usuario");
  const handleCreateService = () => navigate("/nuevo-servicio");

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
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <WelcomePanel user={"Administrador " + getAuthenticatedUserName()} />

      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Overview:
            móvil/tablet → ancho completo
            desktop      → 8/12 */}
        <Grid size={{ xs: 12, md: 8 }} order={{ xs: 2, md: 1 }}>
          <Overview />
        </Grid>

        {/* Botones:
            móvil/tablet → ancho completo arriba
            desktop      → 4/12 a la derecha */}
        <Grid size={{ xs: 12, md: 4 }} order={{ xs: 1, md: 2 }}>
          <ButtonList botones={botones} />
        </Grid>
      </Grid>
    </Box>
  );
}