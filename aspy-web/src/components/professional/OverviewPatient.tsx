// FINAL
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { getAge } from "@/utils/utils";
import type { Person } from "@/typesResponse/Person";

interface OverviewPacienteProps {
  patient: Person;
}

export default function OverviewPatient({ patient }: OverviewPacienteProps) {
  return (
    <Box className="contenedor-overview">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid container size={12} rowSpacing={1}>
          <Typography variant="h6">Paciente</Typography>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Nombre</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>
                {patient.first_name} {patient.last_name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Edad</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{getAge(patient.birthdate)}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Número celular</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{patient.phone.number}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Correo</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{patient.user_account.email}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Ocupacion</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{patient.occupation?.name}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider className="divider-overview-paciente" />
      </Grid>
    </Box>
  );
}
