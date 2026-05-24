// FINAL
import { useState } from "react";
import { getAppointmentProfessional } from "@utils/utils";
import type { Appointment } from "@/typesResponse/Appointment";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
    data,
  );

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Citas" chip="Citas agendadas" />

      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Selector de profesional:
            móvil/tablet → fila completa arriba
            desktop      → columna derecha (3/12) */}
        <Grid
          size={{ xs: 12, md: 3 }}
          order={{ xs: 1, md: 2 }}
        >
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>

        {/* Agenda:
            móvil/tablet → fila completa debajo del selector
            desktop      → columna izquierda (9/12) */}
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