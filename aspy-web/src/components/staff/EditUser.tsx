// FINAL
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "@components/Header";
import FormViewUser from "@staff/FormViewUser";

export default function EditUserAdmin() {
  const { id } = useParams();
  const numericId = parseInt(id!);

  const ruta = useLocation();

  let textheader = "";
  let rol = 0;

  if (ruta.pathname.includes("/editarCliente")) {
    textheader = "Editar cliente";
    rol = 3;
  } else if (ruta.pathname.includes("/editarProfesional")) {
    textheader = "Editar profesional";
    rol = 2;
  } else if (ruta.pathname.includes("/editarStaff")) {
    textheader = "Editar Secretario/a";
    rol = 4;
  } else if (ruta.pathname.includes("/editarAdmin")) {
    textheader = "Editar admin";
    rol = 1;
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
          <FormViewUser isEdit={true} user_id={numericId} role_id={rol} />
        </Grid>
      </Grid>
    </Box>
  );
}
