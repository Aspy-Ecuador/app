import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { largeScreenZoom, vh } from "@shared-theme/pantallaGrande";

const StaffLayout = () => (
  <Box
    sx={{ display: "flex", minHeight: vh(100), bgcolor: "background.default", ...largeScreenZoom }}
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

export default StaffLayout;
