// Estilos compartidos de las pantallas de ingreso y registro (campos, botones y enlaces).
import { aspy, tone } from "@shared-theme/themePrimitives";
import { C } from "@components/landing/constants";

/** Etiqueta que va arriba de cada campo. */
export const authLabelSx = {
  display: "block",
  mb: 0.75,
  fontSize: "0.86rem",
  fontWeight: 600,
  lineHeight: 1.3,
  color: aspy.text,
} as const;

/** Campo de texto o lista (TextField de MUI sin etiqueta flotante). */
export const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 46,
    px: 1.75,
    fontSize: "0.95rem",
    borderRadius: "12px",
    bgcolor: aspy.surface,
    borderColor: aspy.border,
    transition: "border-color 0.15s, box-shadow 0.15s",
    "&:hover": { borderColor: C.blue },
    "&.Mui-focused": { borderColor: C.blueDark, outline: "none", boxShadow: `0 0 0 3px ${C.blue}55` },
    "&.Mui-error": { borderColor: "error.main" },
    "&.Mui-error.Mui-focused": { boxShadow: `0 0 0 3px ${tone.red.border}` },
    "&.Mui-disabled": { opacity: 0.6 },
  },
  "& .MuiOutlinedInput-input::placeholder": { color: aspy.muted, opacity: 0.8 },
  "& .MuiSelect-select": { display: "flex", alignItems: "center", minHeight: "unset", p: 0, pr: "28px !important" },
  "& .MuiFormHelperText-root": { mx: 0.25, mt: 0.5, minHeight: 18, fontSize: "0.78rem", lineHeight: 1.35 },
} as const;

const AZUL = `linear-gradient(135deg, #2C7F9C 0%, ${C.blueDark} 100%)`;
const VERDE = "linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)";

/** Botón principal (sólido con texto blanco: se ve bien en ambos modos). */
export const authButtonSx = (color: "azul" | "verde" = "azul") =>
  ({
    minHeight: 46,
    px: 3.5,
    borderRadius: "999px",
    border: 0,
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#fff",
    background: color === "verde" ? VERDE : AZUL,
    boxShadow: color === "verde" ? "0 8px 20px rgba(15,110,86,0.3)" : "0 8px 20px rgba(44,127,156,0.32)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      background: color === "verde" ? VERDE : AZUL,
      transform: "translateY(-1px)",
      boxShadow: color === "verde" ? "0 12px 26px rgba(15,110,86,0.4)" : "0 12px 26px rgba(44,127,156,0.42)",
    },
    "&.Mui-disabled": { background: tone.gray.bg, color: "text.disabled", boxShadow: "none" },
    "&.Mui-focusVisible": { outline: `3px solid ${C.blue}`, outlineOffset: "2px" },
    "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
  }) as const;

/** Enlace de texto dentro de las tarjetas. */
export const authLinkSx = {
  fontWeight: 700,
  color: C.blueDark,
  textDecoration: "none",
  "&::before": { display: "none" },
  "&:hover": { textDecoration: "underline", textUnderlineOffset: "3px" },
} as const;
