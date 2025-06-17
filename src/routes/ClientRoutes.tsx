import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@client/ControlPanel";
import Profile from "@components/Profile";
import AppointmentView from "@components/AppointmentView";
import ReceiptList from "@components/ReceiptList";
import CheckoutView from "@components/CheckoutView";

export const ClientRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/agendar-cita", element: <AppointmentView /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/pago", element: <CheckoutView /> },
  ...SharedRoutes,
];
