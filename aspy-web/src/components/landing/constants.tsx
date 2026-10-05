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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";

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
/** Google Maps (formatos públicos, sin clave de API). */
export const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
/** Mapa embebido; con `near` ("lat,lng") se centra en ese punto y marca el lugar por su nombre. */
export const mapsEmbedUrl = (query: string, near?: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}${near ? `&ll=${near}&z=17` : "&z=16"}&output=embed`;

/**
 * Lee el nombre y las coordenadas de un enlace de ficha de Google Maps
 * (https://www.google.com/maps/place/<Nombre>/@<lat>,<lng>,…). Los enlaces cortos no los traen.
 */
export function placeFromMapsUrl(url: string): { name: string; near: string } | null {
  const m = url.match(/\/maps\/place\/([^/]+)\/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const name = decodeURIComponent(m[1].replace(/\+/g, " "));
  return { name, near: `${m[2]},${m[3]}` };
}

/** Enlace que abre un chat de WhatsApp con el número y un mensaje ya escrito. */
export const whatsappUrl = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

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
  person: PersonRoundedIcon,
  chart: BarChartRoundedIcon,
  growth: TrendingUpRoundedIcon,
  calendar: CalendarMonthRoundedIcon,
  star: StarRoundedIcon,
  trophy: EmojiEventsRoundedIcon,
  home: HomeRoundedIcon,
  health: MedicalServicesRoundedIcon,
  smile: SentimentSatisfiedAltRoundedIcon,
  volunteer: VolunteerActivismRoundedIcon,
  world: PublicRoundedIcon,
  child: ChildCareRoundedIcon,
};

/** Estilo de foco visible para links y botones de la landing (teclado). */
export const focusRing = {
  "&:focus-visible": { outline: `3px solid ${C.blue}`, outlineOffset: 3 },
};
