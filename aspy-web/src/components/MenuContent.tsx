import { useEffect, useState, type ReactNode } from "react";
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
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import professionalAPI from "@API/professionalAPI";

interface MenuContentProps {
  onNavigate?: () => void;
}

type NavItem = { text: string; route: string; icon: ReactNode };

const adminListItems: NavItem[] = [
  { text: "Vista General", route: "/dashboard", icon: <HomeRoundedIcon /> },
  { text: "Usuarios", route: "/usuarios", icon: <GroupRoundedIcon /> },
  { text: "Servicios", route: "/servicios", icon: <AssignmentRoundedIcon /> },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
  {
    text: "Datos bancarios",
    route: "/datos-bancarios",
    icon: <AccountBalanceRoundedIcon />,
  },
];

const staffListItems: NavItem[] = [
  { text: "Vista General", route: "/dashboard", icon: <HomeRoundedIcon /> },
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

// Solo aparece en el menú de Secretaría si el Admin le habilitó gestionar horarios (ajuste `horario_secretaria`)
const horariosDeSecretaria: NavItem = { text: "Horarios", route: "/horarios", icon: <EditCalendarRoundedIcon /> };

const professionalListItems: NavItem[] = [
  { text: "Vista General", route: "/dashboard", icon: <HomeRoundedIcon /> },
  {
    text: "Pacientes",
    route: "/pacientes",
    icon: <AssignmentIndRoundedIcon />,
  },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
  {
    text: "Crear Horarios",
    route: "/seleccionar-horario",
    icon: <EditCalendarRoundedIcon />,
  },
];

const clientListItems: NavItem[] = [
  { text: "Vista General", route: "/dashboard", icon: <HomeRoundedIcon /> },
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
  const [conHorarios, setConHorarios] = useState(false);

  useEffect(() => {
    if (role !== "Staff") return;
    let vigente = true;
    professionalAPI
      .reglasHorario()
      .then((reglas) => vigente && setConHorarios(reglas.puede_gestionar))
      .catch(() => {});
    return () => {
      vigente = false;
    };
    // Se vuelve a preguntar al cambiar de pantalla (la respuesta se recuerda un minuto)
  }, [role, pathname]);

  const base: NavItem[] =
    typeof role === 'string' && role in ROLE_MAP ? ROLE_MAP[role as keyof typeof ROLE_MAP] : [];
  // "Horarios" va justo después de "Citas"
  const items: NavItem[] =
    role === "Staff" && conHorarios ? base.flatMap((item) => (item.route === "/citas" ? [item, horariosDeSecretaria] : [item])) : base;

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

      {items.map((item: NavItem, index: number) => {
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
