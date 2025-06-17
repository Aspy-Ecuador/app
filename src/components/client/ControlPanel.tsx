/*import { ReactNode } from "react";*/

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import { getAuthenticatedUserName } from "@store";
import { citas } from "@data/Citas";
import Agenda from "@components/Agenda";
import WelcomePanel from "@components/WelcomePanel";

export default function ControlPanel() {
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        <Grid size={12} sx={{ padding: 5 }}>
          <WelcomePanel user={"Estimado" + getAuthenticatedUserName()} />
        </Grid>

        <Grid size={12} className={themeClass}>
          <Agenda citas={citas} />
        </Grid>
      </Grid>
    </Box>
  );
}
