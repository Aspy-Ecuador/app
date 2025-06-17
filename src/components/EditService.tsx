import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import ServiceForm from "@forms/ServiceForm";

export default function EditService() {
  //Obtener id servicio
  const { id } = useParams();
  const numericId = id ? parseInt(id) : undefined;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Editar Servicio"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        <Grid size={12}>
          <ServiceForm isEditMode={true} serviceId={numericId} />
        </Grid>
      </Grid>
    </Box>
  );
}
