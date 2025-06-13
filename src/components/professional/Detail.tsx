import { useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { citas } from "@data/Citas";
import { pacientes } from "@data/Pacientes";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import LogoClaro from "@assets/logo mediano.png";
import LogoOscuro from "@assets/logo aspy negativo mediano.png";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

export default function AppointmentDetail() {
  const { id, citaId } = useParams();
  const user = pacientes.find((u) => u.id.toString() === id);
  const cita = citas.find((c) => c.id.toString() === citaId);
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const theme = useTheme();

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9}>
              <Typography variant="h3">Citas</Typography>
            </Grid>
            <Grid size={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ReplyRoundedIcon fontSize="large" />}
                className="guardar"
              >
                Volver
              </Button>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={12} className="grid-detalles">
          <Grid container width={"80%"}>
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
              <Typography variant="h4">#{cita?.id}</Typography>
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
            <Grid size={12}>
              <Divider className="divider-report" />
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" className="typo-report">
                Comentario
              </Typography>
              <Typography variant="body1">{cita?.date}</Typography>
              {/*cOLOCAR EL VISOR DE PDF */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
