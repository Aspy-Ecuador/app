import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import AppointmentCreation from "@components/AppointmentCreation";

import SimpleHeader from "./SimpleHeader";

export default function AppointmentView() {
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Agendar Cita"} />
        </Grid>
        <Grid size={12}>
          <AppointmentCreation />
        </Grid>
      </Grid>
    </Box>
  );
}
