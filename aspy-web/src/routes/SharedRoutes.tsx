// FINAL
import AboutAspy from "@pages/AboutAspy";
import Avisos from "@pages/Avisos";
import Manuales from "@pages/Manuales";
import Privacidad from "@pages/Privacidad";

export const SharedRoutes = [
  { path: "/sobreAspy", element: <AboutAspy /> },
  { path: "/avisos", element: <Avisos /> },
  { path: "/manual", element: <Manuales /> },
  { path: "/privacidad", element: <Privacidad /> },
];
