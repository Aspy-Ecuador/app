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
import CreateUser from "@components/CreateUser";
import CreateService from "@components/CreateService";
import EditUser from "@components/EditUser";
import EditService from "@components/EditService";
import AppointmentView from "@components/AppointmentView";
import CheckoutView from "@components/CheckoutView";

export const StaffRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/profesionales", element: <ProffesionalList /> },
  { path: "/pacientes", element: <ClientList /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/pagos", element: <PaymentsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/servicios", element: <Services /> },
  { path: "/agendar-cita", element: <AppointmentView /> },
  { path: "/crear-paciente", element: <CreateUser role="Paciente" /> },
  { path: "/crear-profesional", element: <CreateUser role="Profesional" /> },
  { path: "/crear-servicio", element: <CreateService /> },
  { path: "/pagos/:id", element: <PaymentDetails /> },
  { path: "/pacientes/:id", element: <EditUser /> },
  { path: "/profesionales/:id", element: <EditUser /> },
  { path: "/servicios/:id", element: <EditService /> },
  { path: "/pago", element: <CheckoutView /> },
  ...SharedRoutes,
];
