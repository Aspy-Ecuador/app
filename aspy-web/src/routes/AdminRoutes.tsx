import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@admin/ControlPanel";
import Profile from "@components/Profile";
import UsersList from "@/components/admin/UsersList";
import ServicesList from "@/components/admin/ServicesList";
import EditService from "@/components/EditService";
import CreateService from "@/components/CreateService";
import CreateUserAdmin from "@admin/CreateUserAdmin";
import Appointment from "@/components/admin/Appointments";
import EditUser from "@staff/EditUser";

export const AdminRoutes = [
  { path: "/dashboard", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
<<<<<<< HEAD
  { path: "/editarCliente/:id", element: <EditUserAdmin /> },
  { path: "/editarProfesional/:id", element: <EditUserAdmin /> },
  { path: "/editarSecretario/:id", element: <EditUserAdmin /> },
  { path: "/editarAdmin/:id", element: <EditUserAdmin /> },
=======
  { path: "/editarCliente/:id", element: <EditUser /> },      // <- reemplaza /editar/:id
  { path: "/editarProfesional/:id", element: <EditUser /> },
  { path: "/editarStaff/:id", element: <EditUser /> },
  { path: "/editarAdmin/:id", element: <EditUser /> },
>>>>>>> fix-version-pruebas-aspy
  { path: "/usuarios", element: <UsersList /> },
  { path: "/servicios", element: <ServicesList /> },
  { path: "/servicios/:id", element: <EditService /> },
  { path: "/nuevo-servicio", element: <CreateService /> },
  { path: "/nuevo-usuario", element: <CreateUserAdmin /> },
  { path: "/citas", element: <Appointment /> },
  ...SharedRoutes,
];