import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@client/ControlPanel";
import Profile from "@components/Profile";
import AppointmentCreation from "@components/AppointmentCreation";
import Appointments from "@staff/Appointments";
import ReceiptList from "@staff/ReceiptList";

export const ClientRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/agendar-cita", element: <AppointmentCreation /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/facturas", element: <ReceiptList /> },
  ...SharedRoutes,
];
