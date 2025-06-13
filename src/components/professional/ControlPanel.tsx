import { getAuthenticatedUserName } from "@store";
import { citas } from "@data/Citas";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import ShowAppointment from "@professional/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";

export default function ControlPanel() {
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Dr. " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={12}>
          <ShowAppointment citasSinMarcar={citas} citasSinReporte={citas} />
        </Grid>
      </Grid>
    </Box>
  );
}
