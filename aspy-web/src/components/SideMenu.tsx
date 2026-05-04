import { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import {
  getAuthenticatedUserName,
  getAuthenticatedUserEmail,
} from "@/utils/store";

const ASPY_DARK = "#1D2D44";
const drawerWidth = 224;

const PermanentDrawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: ASPY_DARK,
    borderRight: "none",
  },
});

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

interface DrawerContentProps {
  name: string;
  email: string;
  onNavigate?: () => void;
}

const DrawerContent = ({ name, email, onNavigate }: DrawerContentProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    {/* Logo */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 2.25,
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          flexShrink: 0,
          background: "linear-gradient(135deg, #4BA3D3, #F0919E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        A
      </Box>
      <Box>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.1 }}
        >
          Fundación ASPY
        </Typography>
        <Typography
          sx={{
            fontSize: 9,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Ecuador
        </Typography>
      </Box>
    </Box>

    {/* Nav — ocupa el espacio restante */}
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <MenuContent onNavigate={onNavigate} />
    </Box>

    {/* Brand dots */}
    <Box sx={{ display: "flex", gap: 0.5, px: 2, pb: 1.25, flexShrink: 0 }}>
      {["#4BA3D3", "#F0919E", "#F4C842"].map((c) => (
        <Box
          key={c}
          sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c }}
        />
      ))}
    </Box>

    {/* User footer */}
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        px: 1.5,
        py: 1.25,
        flexShrink: 0,
        borderTop: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg, #4BA3D3, #F0919E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {initials(name)}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 500,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {email}
        </Typography>
      </Box>
      <OptionsMenu />
    </Stack>
  </Box>
);

export default function SideMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = getAuthenticatedUserName();
  const email = getAuthenticatedUserEmail();

  return (
    <>
      {/* Botón hamburguesa — solo móvil */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 1300,
        }}
      >
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: ASPY_DARK,
            color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#243550" },
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Drawer temporal — móvil */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            backgroundColor: ASPY_DARK,
            border: "none",
          },
        }}
      >
        <DrawerContent
          name={name}
          email={email}
          onNavigate={() => setMobileOpen(false)}
        />
      </MuiDrawer>

      {/* Drawer permanente — desktop */}
      <PermanentDrawer
        variant="permanent"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <DrawerContent name={name} email={email} />
      </PermanentDrawer>
    </>
  );
}
