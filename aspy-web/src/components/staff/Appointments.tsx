import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentByProfessional } from "@utils/utils";
import { Appointment } from "@/types/Appointment";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import Header from "@components/Header";
import Progress from "@components/Progress";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";

export default function Appointments() {
  const navigate = useNavigate();

  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const [selectedId, setSelected] = useState<number>(0);

  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };

  const handleCreateAppointment = () => {
    const newPath = `/agendar-cita`;
    navigate(newPath);
  };

  const appointmentProfessional: AppointmentResponse[] =
    getAppointmentByProfessional(selectedId, data);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Citas"}
            isCreate={true}
            textIcon={"Nueva Cita"}
            handle={handleCreateAppointment}
          />
        </Grid>
        <Grid size={9}>
          <Agenda appointments={appointmentProfessional} />
        </Grid>
        <Grid size={3}>
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}
