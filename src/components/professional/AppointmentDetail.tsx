import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { pacientes } from "@data/Pacientes";
import { User } from "@/types/User";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import LogoClaro from "@assets/logo mediano.png";
import LogoOscuro from "@assets/logo aspy negativo mediano.png";
import Divider from "@mui/material/Divider";

export default function AppointmentDetail() {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : null;
  const user: User | undefined = pacientes.find((u) => u.id === numericId);

  const idreporte = 122123221897;
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const theme = useTheme();

  return (
    <Box className="box-panel-control">
      <Grid container spacing={2}>
        <Grid container size={12}>
          <Grid size={6} className="grid-empresa" sx={{}}>
            <Typography variant="h2">Fundación ASPY</Typography>
          </Grid>
          <Grid size={6} className="grid-logo">
            <img
              src={theme.palette.mode === "dark" ? LogoOscuro : LogoClaro}
              alt="Logo"
              width={200}
            />
          </Grid>
        </Grid>
        <Grid size={12} textAlign={"center"}>
          <Typography variant="h4">#{idreporte}</Typography>
        </Grid>
        <Grid container size={12}>
          <Grid size={6} width={"10%"}>
            <Typography variant="body1">Fecha</Typography>
          </Grid>
          <Grid size={6} width={"20%"} textAlign={"right"}>
            <Typography variant="body1" className="negrita">
              {fecha}
            </Typography>
          </Grid>
        </Grid>
        <Grid container size={12}>
          <Grid size={6} width={"10%"}>
            <Typography variant="body1">Hora</Typography>
          </Grid>
          <Grid size={6} width={"20%"} textAlign={"right"}>
            <Typography variant="body1" className="negrita">
              {hora}
            </Typography>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Divider className="divider-report" />
        </Grid>
        <Grid container size={12}>
          <Grid size={6} textAlign={"left"}>
            <Typography variant="body1" className="typo-report">
              Profesional
            </Typography>
            <Typography variant="body1">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
            <Typography variant="body1">
              {"Aquí va dirección"}
              {user?.address}
            </Typography>
            <Typography variant="body1">{user?.phone}</Typography>
          </Grid>
          <Grid size={6} textAlign={"right"}>
            <Typography variant="body1" className="typo-report">
              Paciente
            </Typography>
            <Typography variant="body1">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
            <Typography variant="body1">
              {"Aquí va dirección"}
              {user?.address}
            </Typography>
            <Typography variant="body1">{user?.phone}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
