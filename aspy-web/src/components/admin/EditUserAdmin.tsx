import { useParams, useNavigate } from "react-router-dom";
import Error from "@components/Error";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import FormViewAdmin from "./FormViewAdmin";

export default function EditUserAdmin() {
  const { id } = useParams();
  const numericId = parseInt(id ?? "0");

  const navigate = useNavigate();

  if (isNaN(numericId) || numericId <= 0) {
    return <Error mensaje="ID de usuario inválido." />;
  }

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
          <FormViewAdmin isEdit={true} user_id={numericId} />
        </Grid>
      </Grid>
    </Box>
  );
}
