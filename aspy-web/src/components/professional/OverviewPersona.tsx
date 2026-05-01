// FINAL
import { getAge } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import photo from "@assets/user.png";

import InfoIcon from "@mui/icons-material/Info";
import type { Person } from "@/typesResponse/Person";

interface OverviewPersonaProps {
  selectedData: Person;
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
            {selectedData.person_id}
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
            src={photo}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="body1" className="class_nombres">
            {selectedData.first_name} {selectedData.last_name}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="body1" className="class_titulo">
            {selectedData.user_account.role.name}
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
                        {getAge(selectedData.birthdate)}
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
                        {selectedData.gender?.name}
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
