import { Appointment } from "@/types/Appointment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { translateStatus } from "@/utils/utils";

interface ShowAppointmentProps {
  appointments: Appointment[];
}

export default function ShowAppointment({
  appointments,
}: ShowAppointmentProps) {
  return (
    <Box>
      {appointments.map((appointment, index) => (
        <Card key={index} className="card-citas">
          <CardContent className="card-content-citas">
            <Grid container spacing={1}>
              <Grid size={6} container>
                <Grid size={12}>
                  <Typography className="typography-citas" variant="body1">
                    Paciente: {appointment.client.full_name}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography className="typography-citas" variant="body1">
                    Profesional:{appointment.proffesional.full_name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid size={6} container>
                <Grid size={12}>
                  <Typography
                    className="typography-citas"
                    variant="body1"
                    align="right"
                  >
                    Servicio: {appointment.service.name}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography
                    className="typography-citas"
                    variant="body1"
                    align="right"
                  >
                    Estado: {translateStatus(appointment.status.name)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider className="divider-citas" />

            <Grid container spacing={1} className="grid-citas-fecha">
              <Grid size={{ xs: 10, md: 10 }}>
                <Typography className="p-citas">
                  {appointment.startTime}
                </Typography>
              </Grid>
              <Grid size={{ xs: 2, md: 2 }}>
                <Typography className="p-citas">{appointment.date}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
