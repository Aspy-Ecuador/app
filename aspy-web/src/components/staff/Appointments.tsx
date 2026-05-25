import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentProfessional } from "@utils/utils";
import type { Appointment } from "@/typesResponse/Appointment";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import Header from "@components/Header";
import Progress from "@components/Progress";

export default function Appointments() {
  const navigate = useNavigate();
  const { data, loading } = useRoleData();
  const [selectedId, setSelected] = useState<number>(0);

  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };

  if (loading) return <Progress />;

  const appointmentProfessional: Appointment[] = getAppointmentProfessional(
    selectedId,
    data,
  );

  const handleCreateAppointment = () => {
    const newPath = `/agendar-cita`;
    navigate(newPath);
  };

  return (
    <Box className="box-panel-control" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      
      {/* Contenedor del Header con la inyección estética para el botón '+' */}
      <Box
        className="grid-p-patients-tittle"
        sx={{
          "& button": {
            display: "inline-flex !important",
            alignItems: "center !important",
            justifyContent: "center !important",
            minWidth: "40px !important",
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: "50%",
          },
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            margin: "0 !important", 
          },
          "& svg": {
            margin: "0 !important",
          }
        }}
      >
        <Header
          textHeader={"Citas"}
          isCreate={true}
          textIcon="" // Vacío para mantener el botón circular con el icono '+'
          handle={handleCreateAppointment}
        />
      </Box>

      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Selector de profesional:
            móvil/tablet → fila completa arriba (order: 1)
            desktop      → columna derecha (3/12) (order: 2) */}
        <Grid
          size={{ xs: 12, md: 3 }}
          order={{ xs: 1, md: 2 }}
        >
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>

        {/* Agenda:
            móvil/tablet → fila completa debajo del selector (order: 2)
            desktop      → columna izquierda (9/12) (order: 1) */}
        <Grid
          size={{ xs: 12, md: 9 }}
          order={{ xs: 2, md: 1 }}
        >
          <Agenda appointments={appointmentProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}