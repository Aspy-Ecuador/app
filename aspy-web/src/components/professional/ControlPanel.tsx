import { getAuthenticatedUserID, getAuthenticatedUserName } from "@store";
import { Appointment } from "@/types/Appointment";
import { useRoleData } from "@/observer/RoleDataContext";
import {
  getUnmarkedAppointments,
  getUnreportedAppointments,
} from "@/utils/utils";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import ShowAppointment from "@professional/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";

import Progress from "@components/Progress";

export default function ControlPanel() {
  const { data, loading } = useRoleData();
  if (loading) return <Progress />;

  const unmarkedAppointments: Appointment[] = getUnmarkedAppointments(
    data,
    getAuthenticatedUserID()
  );

  const unreportedAppointments: Appointment[] = getUnreportedAppointments(
    data,
    getAuthenticatedUserID()
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <WelcomePanel user={"Dr. " + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={12}>
          <ShowAppointment
            unmarkedAppointmentsProp={unmarkedAppointments}
            unreportedAppointments={unreportedAppointments}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
