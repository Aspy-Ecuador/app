import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthenticatedUserRole } from "@store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import SwitchAccountRoundedIcon from "@mui/icons-material/SwitchAccountRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";

interface MenuContentProps {
  onNavigate?: () => void;
}

type NavItem = { text: string; route: string; icon: ReactNode };

const adminListItems: NavItem[] = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  { text: "Usuarios", route: "/usuarios", icon: <GroupRoundedIcon /> },
  { text: "Servicios", route: "/servicios", icon: <AssignmentRoundedIcon /> },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
];

const staffListItems: NavItem[] = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  {
    text: "Profesionales",
    route: "/profesionales",
    icon: <SwitchAccountRoundedIcon />,
  },
  {
    text: "Pacientes",
    route: "/pacientes",
    icon: <AssignmentIndRoundedIcon />,
  },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
  { text: "Recibos", route: "/recibos", icon: <ReceiptLongRoundedIcon /> },
  { text: "Pagos", route: "/pagos", icon: <PaymentRoundedIcon /> },
  { text: "Servicios", route: "/servicios", icon: <AssignmentRoundedIcon /> },
];

const professionalListItems: NavItem[] = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  {
    text: "Pacientes",
    route: "/pacientes",
    icon: <AssignmentIndRoundedIcon />,
  },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
];

const clientListItems: NavItem[] = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  {
    text: "Nueva cita",
    route: "/agendar-cita",
    icon: <CalendarMonthRoundedIcon />,
  },
  { text: "Recibos", route: "/recibos", icon: <ReceiptLongRoundedIcon /> },
  {
    text: "Servicios",
    route: "/consultarServicios",
    icon: <AssignmentRoundedIcon />,
  },
  { text: "Reportes", route: "/reportes", icon: <ArticleRoundedIcon /> },
];

const ROLE_MAP: Record<string, NavItem[]> = {
  Admin: adminListItems,
  Staff: staffListItems,
  Professional: professionalListItems,
  Client: clientListItems,
};

export default function MenuContent({ onNavigate }: MenuContentProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = getAuthenticatedUserRole();
  const items = ROLE_MAP[role] ?? [];

  const handleNav = (route: string) => {
    navigate(route.trim());
    onNavigate?.(); // cierra el drawer móvil si se pasa el callback
  };

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 0.25 }}>
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          px: 1,
          pt: 1,
          pb: 0.5,
        }}
      >
        Menú principal
      </Typography>

      {items.map((item, index) => {
        const isActive =
          item.route === "/"
            ? pathname === "/"
            : pathname.startsWith(item.route.trim());

        return (
          <ButtonBase
            key={index}
            onClick={() => handleNav(item.route)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.25,
              py: 0.875,
              borderRadius: 2,
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start",
              bgcolor: isActive ? "rgba(75,163,211,0.18)" : "transparent",
              transition: "background 0.15s",
              "&:hover": {
                bgcolor: isActive
                  ? "rgba(75,163,211,0.22)"
                  : "rgba(255,255,255,0.06)",
              },
            }}
          >
            {/* Icono */}
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "7px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isActive ? "rgba(75,163,211,0.25)" : "transparent",
                color: isActive ? "#4BA3D3" : "rgba(255,255,255,0.4)",
                "& svg": { fontSize: 16 },
              }}
            >
              {item.icon}
            </Box>

            {/* Label */}
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                flex: 1,
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
              }}
            >
              {item.text}
            </Typography>

            {/* Barra activa */}
            {isActive && (
              <Box
                sx={{
                  width: 3,
                  height: 16,
                  borderRadius: "2px",
                  bgcolor: "#4BA3D3",
                  flexShrink: 0,
                }}
              />
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
