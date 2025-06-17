import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import FormView from "@components/FormView";

export default function EditRole() {
  //Obtener usuario
  const { id } = useParams();
  const numericId = parseInt(id!);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Editar Usuario"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        <Grid size={12}>
          <FormView isEdit={true} userId={numericId} role="" />
        </Grid>
      </Grid>
    </Box>
  );
}
