import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import FormView from "@staff/FormView";

export default function CreateUser() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Registrar nuevo usuario"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        <Grid size={12}>
          <FormView isEdit={false} />
        </Grid>
      </Grid>
    </Box>
  );
}
