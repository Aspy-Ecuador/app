import { useState } from "react";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCitasProfesional } from "@utils/utils";
import { Appointment } from "@/types/Appointment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import Header from "@components/Header";

export default function Appointments() {
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  const navigate = useNavigate();

  const [selectedId, setSelected] = useState<number>();

  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };

  const citasProfesional: Appointment[] = getCitasProfesional(selectedId!);

  const handleCreateAppointment = () => {
    const newPath = `/agendar-cita`;
    navigate(newPath);
  };

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
        <Grid size={9} className={themeClass}>
          <Agenda citas={citasProfesional} />
        </Grid>
        <Grid size={3}>
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}
