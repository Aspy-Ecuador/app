import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@client/ControlPanel";
import Profile from "@components/Profile";
import AppointmentView from "@components/AppointmentView";
import ReceiptList from "@client/ReceiptList";
import CheckoutView from "@components/CheckoutView";
import EditUserAdmin from "@/components/admin/EditUserAdmin";
import ServicesList from "@client/ServicesList";
import History from "@client/History";

export const ClientRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/editar/:id", element: <EditUserAdmin /> },
  { path: "/agendar-cita", element: <AppointmentView isClient={true} /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/consultarServicios", element: <ServicesList /> },
  { path: "/reportes", element: <History /> },
  {
    path: "/pago/:serviceId/:scheduleId",
    element: <CheckoutView isClient={true} />,
  },

  ...SharedRoutes,
];
