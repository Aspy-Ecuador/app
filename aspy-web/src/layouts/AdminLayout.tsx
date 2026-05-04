import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const AdminLayout = () => (
  <Box
    sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}
  >
    <SideMenu />

    <Box
      component="main"
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: "auto",
        bgcolor: "#F4F6F8",
        // En móvil, deja espacio para el botón hamburguesa
        pt: { xs: "56px", md: 0 },
      }}
    >
      <Outlet />
    </Box>
  </Box>
);

export default AdminLayout;
