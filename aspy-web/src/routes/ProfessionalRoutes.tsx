import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@professional/ControlPanel";
import Profile from "@components/Profile";
import Appointments from "@professional/Appointments";
import PatientsList from "@professional/PatientsList";
import History from "@professional/History";
import NewReport from "@professional/NewReport";
import Detail from "@professional/Detail";

export const ProfessionalRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/pacientes", element: <PatientsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/pacientes/:id", element: <History /> },
  { path: "/pacientes/:id/:appointment/nuevoReporte", element: <NewReport /> },
  { path: "/pacientes/:id/:citaId", element: <Detail /> },
  ...SharedRoutes,
];
