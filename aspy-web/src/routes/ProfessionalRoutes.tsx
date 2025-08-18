import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@professional/ControlPanel";
import Profile from "@components/Profile";
import Appointments from "@professional/Appointments";
import PatientsList from "@professional/PatientsList";
import History from "@professional/History";
import NewReport from "@professional/NewReport";
import Detail from "@professional/Detail";
import EditUserAdmin from "@/components/admin/EditUserAdmin";

export const ProfessionalRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/editar/:id", element: <EditUserAdmin /> },
  { path: "/pacientes", element: <PatientsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/pacientes/:id", element: <History /> },
  { path: "/pacientes/:appointment/nuevoReporte", element: <NewReport /> },
  { path: "/pacientes/:id/:citaId", element: <Detail /> },
  ...SharedRoutes,
];
