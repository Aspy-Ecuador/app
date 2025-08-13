import { User } from "@/types/User";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { getAge, getOccupation } from "@/utils/utils";

interface OverviewPacienteProps {
  patient: User;
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
              <Typography>{patient.full_name}</Typography>
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
          {/*
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Número celular</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{paciente.phone}</Typography>
            </Grid>
          </Grid>
          */}
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Correo</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{patient.email}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Ocupacion</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{getOccupation(patient.occupation)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider className="divider-overview-paciente" />
        {/*
        <Grid container size={12} rowSpacing={1}>
          <Typography variant="h6">Representante</Typography>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <Typography>Nombre</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>
                {representante.first_name} {representante.last_name}
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
        */}
      </Grid>
    </Box>
  );
}
