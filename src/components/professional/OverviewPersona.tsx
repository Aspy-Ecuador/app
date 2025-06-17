import { User } from "@/types/User";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import InfoIcon from "@mui/icons-material/Info";

interface OverviewPersonaProps {
  selectedData: User;
  moreInfo: () => void;
}

export default function Overview_persona({
  selectedData,
  moreInfo,
}: OverviewPersonaProps) {
  return (
    <Box className="contenedor-overview">
      <Grid container rowSpacing={6} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12}>
          <Typography variant="body1" className="class_id">
            {selectedData.id}
          </Typography>
        </Grid>
        <Grid
          size={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="Foto de perfil"
            src={selectedData.photo}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="body1" className="class_nombres">
            {selectedData.firstName} {selectedData.lastName}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="body1" className="class_titulo">
            {selectedData.role}
          </Typography>
        </Grid>
        <Grid
          size={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={moreInfo}
            className="button-info"
            startIcon={<InfoIcon className="icon-info" />}
          >
            Información
          </Button>
        </Grid>
        <Grid size={12}>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={0}>
              <Grid size={12}>
                <Typography variant="body1" className="class_sobremi">
                  Sobre mi
                </Typography>
              </Grid>
              <Grid size={12} sx={{ width: "100%" }}>
                <Typography variant="body1" className="class_descripcion">
                  {selectedData.aboutme}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={12}>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={0}>
              <Grid size={6}>
                <Box sx={{ width: "100%" }}>
                  <Grid container spacing={0}>
                    <Grid size={12}>
                      <Typography variant="body1" className="class_edad_titulo">
                        Edad
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body1" className="class_edad">
                        {selectedData.age}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ width: "100%" }}>
                  <Grid container spacing={0}>
                    <Grid size={12}>
                      <Typography
                        variant="body1"
                        className="class_genero_titulo"
                      >
                        Género
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body1" className="class_genero">
                        {selectedData.gender}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
