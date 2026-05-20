import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@staff/ControlPanel";
import Profile from "@components/Profile";
import ProffesionalList from "@staff/ProffesionalList";
import ClientList from "@staff/ClientList";
import ReceiptList from "@staff/ReceiptList";
import Appointments from "@staff/Appointments";
import PaymentsList from "@components/staff/PaymentsList";
import Services from "@components/staff/ServicesList";
import PaymentDetails from "@staff/PaymentDetails";
import CreateUserAdmin from "@admin/CreateUserAdmin";
import CreateService from "@components/CreateService";
import EditService from "@components/EditService";
import AppointmentView from "@components/AppointmentView";
import CheckoutView from "@components/CheckoutView";
import EditUserAdmin from "@/components/admin/EditUserAdmin";

export const StaffRoutes = [
  { path: "/dashboard", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/editar/:id", element: <EditUserAdmin /> },
  { path: "/profesionales", element: <ProffesionalList /> },
  { path: "/pacientes", element: <ClientList /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/pagos", element: <PaymentsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/servicios", element: <Services /> },
  { path: "/agendar-cita", element: <AppointmentView isClient={false} /> },
  { path: "/registrarUsuario", element: <CreateUserAdmin /> },
  { path: "/crear-servicio", element: <CreateService /> },
  { path: "/pagos/:id", element: <PaymentDetails /> },
  { path: "/servicios/:id", element: <EditService /> },
  {
    path: "/pago/:serviceId/:workerId/:clientId/:professionalId",
    element: <CheckoutView isClient={false} />,
  },
  ...SharedRoutes,
];
