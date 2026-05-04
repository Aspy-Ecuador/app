import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const StaffLayout = () => (
  <Box
    sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}
  >
    <SideMenu />

    {/* Área de contenido */}
    <Box
      component="main"
      sx={{
        flex: 1,
        minWidth: 0, // evita overflow en flex
        overflow: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.default" : "#F4F6F8", // gris muy suave, distinto al blanco del sidebar
      }}
    >
      <Outlet />
    </Box>
  </Box>
);

export default StaffLayout;
