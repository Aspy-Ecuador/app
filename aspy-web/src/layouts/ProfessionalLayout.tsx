import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const ProfessionalLayout = () => (
  <Box
    sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}
  >
    <SideMenu />

    {/* Área de contenido */}
    <Box
      component="main"
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: "auto",
        bgcolor: "background.default",
        pt: { xs: "56px", md: 0 },
      }}
    >
      <Outlet />
    </Box>
  </Box>
);

export default ProfessionalLayout;
