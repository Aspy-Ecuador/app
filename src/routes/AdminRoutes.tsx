import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@admin/ControlPanel";
import Profile from "@components/Profile";
import UsersList from "@/components/admin/UsersList";
import ServicesList from "@/components/admin/ServicesList";
import EditUser from "@/components/EditUser";
import EditService from "@/components/EditService";
import CreateService from "@/components/CreateService";
import CreateUser from "@/components/CreateUser";
import Appointment from "@/components/admin/Appointments";

export const AdminRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/usuarios", element: <UsersList /> },
  { path: "/servicios", element: <ServicesList /> },
  { path: "/usuarios/:id", element: <EditUser /> },
  { path: "/servicios/:id", element: <EditService /> },
  { path: "/nuevo-servicio", element: <CreateService /> },
  { path: "/nuevo-usuario", element: <CreateUser role="" /> },
  { path: "/citas", element: <Appointment /> },
  ...SharedRoutes,
];
