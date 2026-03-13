import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@admin/ControlPanel";
import Profile from "@components/Profile";
import UsersList from "@/components/admin/UsersList";
import ServicesList from "@admin/ServicesList";
import EditService from "@admin/EditService";
import CreateService from "@/components/CreateService";
import CreateUserAdmin from "@admin/CreateUserAdmin";
import Appointment from "@/components/admin/Appointments";
import EditUserAdmin from "@/components/admin/EditUserAdmin";

export const AdminRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/editar/:id", element: <EditUserAdmin /> },
  { path: "/usuarios", element: <UsersList /> },
  { path: "/servicios", element: <ServicesList /> },
  { path: "/servicios/:id", element: <EditService /> },
  { path: "/nuevo-servicio", element: <CreateService /> },
  { path: "/nuevo-usuario", element: <CreateUserAdmin /> },
  { path: "/citas", element: <Appointment /> },
  ...SharedRoutes,
];
