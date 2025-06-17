import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUserRole } from "@store";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import SwitchAccountRoundedIcon from "@mui/icons-material/SwitchAccountRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";

type ListItem = {
  text: string;
  route: string;
  icon: ReactNode;
};

const adminListItems = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  { text: "Usuarios", route: "/usuarios", icon: <GroupRoundedIcon /> },
  { text: "Servicios ", route: "/servicios", icon: <AssignmentRoundedIcon /> },
  { text: "Citas ", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
];

const staffListItems = [
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
  { text: "Pagos", route: "/pagos ", icon: <PaymentRoundedIcon /> },
  { text: "Servicios ", route: "/servicios", icon: <AssignmentRoundedIcon /> },
];

const professionalListItems = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  {
    text: "Pacientes",
    route: "/pacientes",
    icon: <AssignmentIndRoundedIcon />,
  },
  { text: "Citas", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
  { text: "Pagos", route: "/pagos", icon: <CreditScoreRoundedIcon /> },
];

const clientListItems = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  {
    text: "Nueva cita",
    route: "/agendar-cita",
    icon: <CalendarMonthRoundedIcon />,
  },
  { text: "Recibos", route: "/recibos", icon: <ReceiptLongRoundedIcon /> },
];

const secondaryListItems = [
  {
    text: "Preferencias",
    route: "/preferencias",
    icon: <SettingsRoundedIcon />,
  },
  { text: "Sobre ASPY", route: "/sobreAspy", icon: <InfoRoundedIcon /> },
  { text: "Contactos", route: "/contacto", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const userRole = getAuthenticatedUserRole();
  let mainListItems: ListItem[];

  if (userRole === "Admin") {
    mainListItems = adminListItems;
  } else if (userRole === "Staff") {
    mainListItems = staffListItems;
  } else if (userRole === "Professional") {
    mainListItems = professionalListItems;
  } else if (userRole === "Client") {
    mainListItems = clientListItems;
  } else {
    mainListItems = [];
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={
                item.route === "/"
                  ? window.location.pathname === item.route
                  : window.location.pathname.startsWith(item.route)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={
                item.route === "/"
                  ? window.location.pathname === item.route
                  : window.location.pathname.startsWith(item.route)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
