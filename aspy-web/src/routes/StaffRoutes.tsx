import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@staff/ControlPanel";
import Profile from "@components/Profile";
import ProffesionalList from "@staff/ProffesionalList";
import ClientList from "@staff/ClientList";
import ReceiptList from "@components/ReceiptList";
import Appointments from "@staff/Appointments";
import PaymentsList from "@components/staff/PaymentsList";
import Services from "@components/staff/ServicesList";
import PaymentDetails from "@staff/PaymentDetails";
import CreateUser from "@staff/CreateUser";
import CreateService from "@components/CreateService";
import EditUser from "@staff/EditUser";
import EditService from "@components/EditService";
import AppointmentView from "@components/AppointmentView";
import CheckoutView from "@components/CheckoutView";
import EditUserAdmin from "@/components/admin/EditUserAdmin";

export const StaffRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/editar/:id", element: <EditUserAdmin /> },
  { path: "/profesionales", element: <ProffesionalList /> },
  { path: "/pacientes", element: <ClientList /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/pagos", element: <PaymentsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/servicios", element: <Services /> },
  { path: "/agendar-cita", element: <AppointmentView isClient={false} /> },
  { path: "/registrarUsuario", element: <CreateUser /> },
  { path: "/crear-servicio", element: <CreateService /> },
  { path: "/pagos/:id", element: <PaymentDetails /> },
  { path: "/pacientes/:id", element: <EditUser /> },
  { path: "/profesionales/:id", element: <EditUser /> },
  { path: "/servicios/:id", element: <EditService /> },
  {
    path: "/pago/:serviceId/:scheduleId/:clientId",
    element: <CheckoutView isClient={false} />,
  },
  ...SharedRoutes,
];
