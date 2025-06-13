import AboutAspy from "@pages/AboutAspy";
import AspyContact from "@pages/ContactAspy";
import Preferences from "@pages/PreferencesAspy";

export const SharedRoutes = [
  { path: "/sobreAspy", element: <AboutAspy /> },
  { path: "/contacto", element: <AspyContact /> },
  { path: "/preferencias", element: <Preferences /> },
];
