import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import AppointmentCreation from "@components/AppointmentCreation";
import Header from "@components/Header";

interface AppointmentViewProp {
  isClient: boolean;
}

export default function AppointmentView({ isClient }: AppointmentViewProp) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Agendar cita"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>
        <Grid size={12}>
          <AppointmentCreation isClient={isClient} />
        </Grid>
      </Grid>
    </Box>
  );
}
