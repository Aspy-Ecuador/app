import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@professional/ControlPanel";
import Profile from "@components/Profile";
import Appointments from "@professional/Appointments";
import PatientsList from "@professional/PatientsList";
import History from "@professional/History";
import NewReport from "@professional/NewReport";
import Detail from "@professional/Detail";
import HorarioView from "@professional/Horarioview";
import EditUser from "@staff/EditUser";

export const ProfessionalRoutes = [
  { path: "/dashboard", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
<<<<<<< HEAD
  { path: "/editarProfesional/:id", element: <EditUserAdmin /> },
=======
  { path: "/editarProfesional/:id", element: <EditUser /> },
>>>>>>> fix-version-pruebas-aspy
  { path: "/pacientes", element: <PatientsList /> },
  { path: "/citas", element: <Appointments /> },
  { path: "/pacientes/:id", element: <History /> },
  { path: "/pacientes/:appointmentId/nuevoReporte", element: <NewReport /> },
  { path: "/pacientes/:id/:citaId", element: <Detail /> },
  { path: "/seleccionar-horario", element: <HorarioView /> },
  ...SharedRoutes,
];
