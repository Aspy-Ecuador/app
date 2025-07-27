import { getAuthenticatedUserName } from "@store";
import { citas } from "@data/Citas";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import ShowAppointment from "@professional/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";
import { runProfessionalLoaders } from '../../API/init';
import { useEffect } from "react";

export default function ControlPanel() {
  useEffect(() => {
    runProfessionalLoaders();
  }, []);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Dr. " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={12}>
          <ShowAppointment
            unmarkedAppointmentsProp={citas}
            unreportedAppointments={citas}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
