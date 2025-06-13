import { useTheme } from "@mui/material";
import { User } from "@/types/User";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

interface OverviewPacienteProps {
  paciente: User;
  representante: User;
  newReport: () => void;
}

export default function OverviewPaciente({
  paciente,
  representante,
  newReport,
}: OverviewPacienteProps) {
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  return (
    <Box className="contenedor-overview">
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
        className={themeClass}
      >
        <Grid container size={12} rowSpacing={1}>
          <Typography variant="h6">Paciente</Typography>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Nombre</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>
                {paciente.firstName} {paciente.lastName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Edad</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{paciente.age}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Número celular</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{paciente.phone}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Correo</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{paciente.email}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider className="divider-overview-paciente" />
        <Grid container size={12} rowSpacing={1}>
          <Typography variant="h6">Representante</Typography>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Nombre</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>
                {representante.firstName} {representante.lastName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Parentesco</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{representante.age}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Número celular</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{representante.phone}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Correo</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{representante.email}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className="grid-button-overview">
          <Button
            onClick={newReport}
            variant="outlined"
            className="button-new-report"
          >
            Nuevo Reporte
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
