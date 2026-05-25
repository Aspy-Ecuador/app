// FINAL
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "@components/Header";
import FormViewUser from "@staff/FormViewUser";

export default function CreateUser() {
  const ruta = useLocation();

  let textheader = "";
  let rol = 0;

  if (ruta.pathname === "/registrarCliente") {
    textheader = "Crear nuevo cliente";
    rol = 3;
  } else if (ruta.pathname === "/registrarProfesional") {
    textheader = "Crear nuevo profesional";
    rol = 2;
  }

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={textheader}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        <Grid size={12}>
          <FormViewUser isEdit={false} role_id={rol} />
        </Grid>
      </Grid>
    </Box>
  );
}
