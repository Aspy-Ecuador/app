import { getAuthenticatedUserIdentity, getAuthenticatedUserName } from "@store";
import { useRoleData } from "@/observer/RoleDataContext";
import { Appointment } from "@/types/Appointment";
import { getAppointmentbyClient } from "@/utils/utils";
import Agenda from "@components/Agenda";
import WelcomePanel from "@components/WelcomePanel";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Progress from "@components/Progress";

export default function ControlPanel() {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const appointments: Appointment[] = getAppointmentbyClient(
    data,
    getAuthenticatedUserIdentity()
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12} sx={{ padding: 5 }}>
          <WelcomePanel user={"Estimado " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={12}>
          <Agenda appointments={appointments} />
        </Grid>
      </Grid>
    </Box>
  );
}
