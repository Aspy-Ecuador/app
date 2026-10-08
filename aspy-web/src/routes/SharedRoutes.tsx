// FINAL
import AboutAspy from "@pages/AboutAspy";
import Manuales from "@pages/Manuales";
import Privacidad from "@pages/Privacidad";

export const SharedRoutes = [
  { path: "/sobreAspy", element: <AboutAspy /> },
  { path: "/manual", element: <Manuales /> },
  { path: "/privacidad", element: <Privacidad /> },
];
