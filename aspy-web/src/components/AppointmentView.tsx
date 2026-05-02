// FINAL
import Box from "@mui/material/Box";
import AppointmentCreation from "@components/AppointmentCreation";
import SimpleHeader from "@components/SimpleHeader";

interface AppointmentViewProp {
  isClient: boolean;
}

export default function AppointmentView({ isClient }: AppointmentViewProp) {
  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Agendar cita" chip="Nueva" />
      <AppointmentCreation isClient={isClient} />
    </Box>
  );
}
