// aspy-web/src/components/landing/constants.tsx
import { keyframes } from "@mui/material/styles";
import { aspy } from "@shared-theme/themePrimitives";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";

// ─── Paleta ───────────────────────────────────────────────────────
// Los acentos (blue, pink, yellow…) son hex fijos porque se combinan con
// sufijos de opacidad (`${C.blue}55`). Los neutros y tintes claros vienen
// del tema y cambian solos en modo oscuro.
export const C = {
  blue: "#5BB8D4",
  blueDark: "#3A9AB8",
  blueLight: aspy.blueLight,
  pink: "#E8A0B0",
  pinkDark: "#C9728A",
  pinkLight: aspy.pinkLight,
  yellow: "#F0C84A",
  yellowDark: "#C9A020",
  yellowLight: aspy.yellowLight,
  black: aspy.text,
  darkBg: "#12263A",
  offWhite: aspy.surface,
  muted: aspy.muted,
  border: aspy.border,
  card: aspy.card,
  navBg: aspy.navBg,
};

// ─── Animaciones ─────────────────────────────────────────────────
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

// ─── Helpers ─────────────────────────────────────────────────────
export const openLink = (url: string) => () =>
  window.open(url, "_blank", "noopener,noreferrer");

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// ─── Nav items ───────────────────────────────────────────────────
export const NAV = [
  { label: "Inicio",    id: "hero"      },
  { label: "Nosotros",  id: "nosotros"  },
  { label: "Servicios", id: "servicios" },
  { label: "ASPY Band", id: "aspyband"  },
];

// ─── Servicios ───────────────────────────────────────────────────
export const services = [
  {
    icon: <AccessibilityNewRoundedIcon sx={{ color: C.blue, fontSize: 26 }} />,
    iconBg: C.blueLight,
    title: "Atención y acompañamiento",
    desc: "Seguimiento personalizado para personas con discapacidad, especialmente dentro del espectro autista.",
  },
  {
    icon: <FavoriteRoundedIcon sx={{ color: C.pink, fontSize: 26 }} />,
    iconBg: C.pinkLight,
    title: "Terapia e inclusión",
    desc: "Actividades terapéuticas diseñadas para fomentar la inclusión social y el bienestar emocional.",
  },
  {
    icon: <SchoolRoundedIcon sx={{ color: C.yellowDark, fontSize: 26 }} />,
    iconBg: C.yellowLight,
    title: "Capacitación y habilidades",
    desc: "Programas de desarrollo de habilidades, incluyendo arte, tecnología y formación laboral.",
  },
  {
    icon: <HandshakeRoundedIcon sx={{ color: C.blue, fontSize: 26 }} />,
    iconBg: C.blueLight,
    title: "Alianzas institucionales",
    desc: "Proyectos conjuntos con el Municipio de Guayaquil para rehabilitación y apoyo comunitario.",
  },
  {
    icon: <GroupsRoundedIcon sx={{ color: C.pinkDark, fontSize: 26 }} />,
    iconBg: C.pinkLight,
    title: "Adultos mayores",
    desc: "Servicios de bienestar social para adultos mayores y personas en situación de vulnerabilidad.",
  },
  {
    icon: <MusicNoteRoundedIcon sx={{ color: C.yellowDark, fontSize: 26 }} />,
    iconBg: C.yellowLight,
    title: "Arte como terapia",
    desc: "La música y las artes como herramientas de expresión, terapia e integración social.",
  },
];