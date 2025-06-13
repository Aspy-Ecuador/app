import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppointmentCreation from "@components/AppointmentCreation";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

export default function AppointmentView() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9}>
              <Typography variant="h3">Agendar Cita</Typography>
            </Grid>
            <Grid size={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ReplyRoundedIcon />}
                className="guardar"
              >
                Volver
              </Button>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={12}>
          <AppointmentCreation />
        </Grid>
      </Grid>
    </Box>
  );
}
