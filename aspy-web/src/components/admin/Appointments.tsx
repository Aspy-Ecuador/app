import { useState } from "react";
import { getAppointmentProfessional } from "@utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import SimpleHeader from "@components/SimpleHeader";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { Appointment } from "@/types/Appointment";
import { userAdapter } from "@/adapters/userAdapter";
import { appointmentAdapter } from "@/adapters/appointmentAdapter";

export default function Appointments() {
  const { data, loading } = useRoleData();
  const [selectedId, setSelected] = useState<number>(0);
  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };
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
        (p: any) => p.person_id === appointment.worker_schedule.person_id
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
      ) {
        return null;
      }

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

  const appointmentProfessional: Appointment[] = getAppointmentProfessional(
    selectedId,
    appointments
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Citas"} />
        </Grid>
        <Grid size={9}>
          {loading ? <Progress /> : <Agenda appointments={appointmentProfessional} />}
        </Grid>
        <Grid size={3}>
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}
