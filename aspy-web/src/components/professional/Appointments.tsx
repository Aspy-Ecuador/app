import { useRoleData } from "@/observer/RoleDataContext";
import { Appointment } from "@/types/Appointment";
import { getAppointments } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import Progress from "@components/Progress";
import SimpleHeader from "../SimpleHeader";

export default function Appointments() {
  const { data, loading } = useRoleData();
  if (loading) return <Progress />;
  const appointments: Appointment[] = getAppointments(data);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Citas Agendadas" />
        </Grid>

        <Grid size={12}>
          <Agenda appointments={appointments} />
        </Grid>
      </Grid>
    </Box>
  );
}
