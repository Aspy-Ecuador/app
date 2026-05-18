// FINAL
import Box from "@mui/material/Box";
import SimpleHeader from "@components/SimpleHeader";
import HorarioProfessional from "@professional/HorarioProfessional";

export default function HorarioView() {
  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Mis Horarios" chip="Horario" />
      <HorarioProfessional />
    </Box>
  );
}
