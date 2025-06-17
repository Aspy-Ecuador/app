import RoleBasedRoutes from "@routes/RoleBasedRoutes";
import SignInSide from "@components/SignInSide";
import SignUp from "@components/SignUp";
import AppTheme from "./shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Mapeo de rutas y títulos
const routeTitles: { [key: string]: string } = {
  "/": "Inicio",
  "/profesionales": "Profesionales",
  "/pacientes": "Pacientes",
  "/citas": "Citas",
  "/facturas": "Facturas",
  "/pagos": "Pagos",
  "/servicios": "Servicios",
  "/usuarios": "Usuarios",
  "/roles": "Roles",
  "/preferencias": "Preferencias",
  "/login": "Iniciar Sesión",
  "/register": "Registrarse",
  "/pago": "Pago",
  "/sobreAspy": "Mas información",
  "/contacto": "Contacto",
  "/404": "Página no encontrada",
};

const dynamicRoutes = [
  { prefix: "/usuarios/", title: "Detalle de Usuario" },
  { prefix: "/profesionales/", title: "Detalle de Profesional" },
  { prefix: "/pacientes/", title: "Detalle de Paciente" },
  { prefix: "/citas/", title: "Detalle de Cita" },
];

const getTitleFromPath = (pathname: string): string => {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const match = dynamicRoutes.find(({ prefix }) => pathname.startsWith(prefix));
  return match ? match.title : "ASPY";
};

const DocumentTitleUpdater = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = getTitleFromPath(location.pathname);
  }, [location.pathname]);
  return null;
};

const App = () => {
  const xThemeComponents = {};

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Router>
        <DocumentTitleUpdater />
        <Routes>
          {/* Rutas públicas sin layout */}
          <Route path="/app/login" element={<SignInSide />} />
          <Route path="/app/register" element={<SignUp />} />
          {/* Rutas privadas basadas en el rol */}
          {RoleBasedRoutes()}

          {/* Rutas no encontradas */}
          <Route path="*" element={<Navigate to="/app/" replace />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
