import { getAuthenticatedUserName } from "@store";
import { useRoleData } from "@/observer/RoleDataContext";
import { appointmentAdapter } from "@/adapters/appointmentAdapter";
import { Appointment } from "@/types/Appointment";
import { userAdapter } from "@/adapters/userAdapter";
import Agenda from "@components/Agenda";
import WelcomePanel from "@components/WelcomePanel";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Progress from "@components/Progress";

export default function ControlPanel() {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const appointments: Appointment[] = (data.appointments || [])
    .map((appointment: any) => {
      const service = data.services?.find(
        (s: any) => s.service_id === appointment.payment.service_id
      );

      const clientPerson = data.persons?.find(
        (p: any) => p.person_id === appointment.payment.person_id
      );

      const clientAccount = data.userAccounts?.find(
        (a: any) => a.user_id === clientPerson?.user_id
      );

      const clientRole = data.roles?.find(
        (r: any) => r.role_id === clientAccount?.role_id
      );

      const professionalPerson = data.persons?.find(
        (p: any) => p.person_id === appointment.scheduled_by.person_id
      );
      const professionalAccount = data.userAccounts?.find(
        (a: any) => a.user_id === professionalPerson?.user_id
      );

      const professionalRole = data.roles?.find(
        (r: any) => r.role_id === professionalAccount?.role_id
      );

      const schedule = data.schedules?.find(
        (s: any) => s.schedule_id === appointment.worker_schedule.schedule_id
      );

      // Validación
      if (
        !service ||
        !clientPerson ||
        !clientAccount ||
        !clientRole ||
        !professionalPerson ||
        !professionalAccount ||
        !professionalRole ||
        !schedule
      )
        return null;

      const client = userAdapter(clientPerson, clientRole, clientAccount);
      const professional = userAdapter(
        professionalPerson,
        professionalRole,
        professionalAccount
      );

      return appointmentAdapter(
        appointment,
        schedule,
        client,
        professional,
        service
      );
    })
    .filter(Boolean);

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
