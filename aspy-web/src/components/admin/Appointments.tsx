import { useState } from "react";
import { getAppointmentProfessional } from "@utils/utils";
import { Appointment } from "@/types/Appointment";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";

export default function Appointments() {
  const { data, loading } = useRoleData();
  const [selectedId, setSelected] = useState<number>(0);

  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };

  if (loading) return <Progress />;

  const appointmentProfessional: Appointment[] = getAppointmentProfessional(
    selectedId,
    data
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Citas"} />
        </Grid>
        <Grid size={9}>
          {loading ? (
            <Progress />
          ) : (
            <Agenda appointments={appointmentProfessional} />
          )}
        </Grid>
        <Grid size={3}>
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}
