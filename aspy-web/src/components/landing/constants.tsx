// aspy-web/src/components/landing/constants.tsx
import { keyframes } from "@mui/material/styles";
import { aspy } from "@shared-theme/themePrimitives";
import type { NavSectionId, ServiceIconName } from "@/content/landing/types";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";

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
  darkBg2: "#1B3A52",
  offWhite: aspy.surface,
  muted: aspy.muted,
  border: aspy.border,
  card: aspy.card,
  navBg: aspy.navBg,
};

/** Acento → colores (sólido, oscuro y tinte suave). */
export const ACCENTS = {
  blue: { main: C.blue, dark: C.blueDark, soft: C.blueLight },
  pink: { main: C.pink, dark: C.pinkDark, soft: C.pinkLight },
  yellow: { main: C.yellow, dark: C.yellowDark, soft: C.yellowLight },
} as const;

/** Fuente de títulos de la landing (cargada en index.html). */
export const DISPLAY_FONT = '"Plus Jakarta Sans", Inter, sans-serif';

/** Altura del navbar fijo: las secciones la usan como margen al saltar con anclas. */
export const NAV_HEIGHT = 92;

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

/**
 * Pantallas grandes (TV Full HD, 2K, 4K): agranda toda la landing de forma proporcional,
 * para que no quede una columna pequeña en el centro al presentarla en un televisor.
 */
export const largeScreenZoom = {
  "@media (min-width: 1800px)": { zoom: 1.15 },
  "@media (min-width: 2400px)": { zoom: 1.5 },
  "@media (min-width: 3200px)": { zoom: 2 },
};

/** Desactiva animaciones si el usuario pidió "reducir movimiento" en su sistema. */
export const reducedMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────
export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// ─── Nav items ───────────────────────────────────────────────────
// Secciones del menú: `key` busca el texto en el CMS (navigation.labels) y `id` es el ancla HTML.
export const NAV_ITEMS: { key: NavSectionId; id: string }[] = [
  { key: "nosotros", id: "nosotros" },
  { key: "servicios", id: "servicios" },
  { key: "comoAgendar", id: "como-agendar" },
  { key: "aspyband", id: "aspyband" },
  { key: "contacto", id: "contacto" },
];

// ─── Íconos por nombre (los elige el CMS) ────────────────────────
export const SERVICE_ICONS: Record<ServiceIconName, typeof FavoriteRoundedIcon> = {
  accessibility: AccessibilityNewRoundedIcon,
  heart: FavoriteRoundedIcon,
  school: SchoolRoundedIcon,
  handshake: HandshakeRoundedIcon,
  groups: GroupsRoundedIcon,
  music: MusicNoteRoundedIcon,
  psychology: PsychologyRoundedIcon,
  family: FamilyRestroomRoundedIcon,
};

/** Estilo de foco visible para links y botones de la landing (teclado). */
export const focusRing = {
  "&:focus-visible": { outline: `3px solid ${C.blue}`, outlineOffset: 3 },
};
