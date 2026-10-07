// Estilos compartidos de los formularios del panel (los de login y registro están en auth/estilos).
// Regla: la etiqueta va ARRIBA del campo. El tema del sistema quita el relleno del OutlinedInput,
// así que una etiqueta flotante (`label` en TextField / InputLabel) queda montada sobre el borde.
import { tone } from "@shared-theme/themePrimitives";
import { C } from "@components/landing/constants";

/** Etiqueta que va arriba de cada campo. */
export const etiquetaSx = {
  display: "block",
  mb: 0.75,
  fontSize: "0.86rem",
  fontWeight: 600,
  lineHeight: 1.3,
  color: "text.primary",
} as const;

/** Texto de ayuda o de error debajo del campo. */
export const ayudaSx = { mx: 0.25, mt: 0.5, fontSize: "0.78rem", lineHeight: 1.35 } as const;

const ALTO = 44;
const enfoque = { borderColor: C.blueDark, outline: "none", boxShadow: `0 0 0 3px ${C.blue}55` };

/** Campo de texto, fecha, hora o lista de MUI (TextField / Select sin etiqueta flotante). */
export const campoSx = {
  "& .MuiOutlinedInput-root, &.MuiOutlinedInput-root": {
    height: ALTO,
    px: 1.5,
    fontSize: "0.95rem",
    borderRadius: "12px",
    bgcolor: "background.default",
    borderColor: "divider",
    transition: "border-color 0.15s, box-shadow 0.15s",
    "&:hover": { borderColor: C.blue },
    "&.Mui-focused": enfoque,
    "&.Mui-error": { borderColor: "error.main" },
    "&.Mui-error.Mui-focused": { boxShadow: `0 0 0 3px ${tone.red.border}` },
    "&.Mui-disabled": { opacity: 0.6 },
  },
  "& .MuiSelect-select": { display: "flex", alignItems: "center", minHeight: "unset", p: 0, pr: "28px !important" },
  "& .MuiFormHelperText-root": ayudaSx,
  // Sin flechitas en los campos numéricos
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
  "& input[type=number]": { MozAppearance: "textfield" },
} as const;

const FLECHA =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a8794' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 15 5 5 5-5M7 9l5-5 5 5'/%3E%3C/svg%3E\")";

/** Lista nativa (<select>): en el celular abre el selector del sistema, cómodo para el dedo. */
export const selectNativoSx = {
  width: "100%",
  height: ALTO,
  pl: 1.5,
  pr: 4.5,
  fontFamily: "inherit",
  fontSize: "0.95rem",
  color: "text.primary",
  bgcolor: "background.default",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "12px",
  appearance: "none",
  backgroundImage: FLECHA,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  cursor: "pointer",
  transition: "border-color 0.15s, box-shadow 0.15s",
  "&:hover": { borderColor: C.blue },
  "&:focus": enfoque,
  "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
  "&[aria-invalid='true']": { borderColor: "error.main" },
} as const;

/** Botón principal de un formulario (verde con texto blanco: se ve bien en ambos modos). */
export const botonPrimarioSx = {
  minHeight: 44,
  minWidth: 150,
  px: 3.5,
  border: 0,
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "#fff",
  backgroundImage: "none",
  bgcolor: "#1D9E75",
  boxShadow: "0 6px 16px rgba(15,110,86,0.28)",
  transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
  "&:hover": { backgroundImage: "none", bgcolor: "#0F6E56", transform: "translateY(-1px)", boxShadow: "0 10px 22px rgba(15,110,86,0.36)" },
  "&.Mui-disabled": { bgcolor: tone.gray.bg, color: "text.disabled", boxShadow: "none" },
  "&.Mui-focusVisible": { outline: `3px solid ${C.blue}`, outlineOffset: "2px" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
} as const;

/** Botón secundario (Anterior, Cancelar). */
export const botonSecundarioSx = {
  minHeight: 44,
  px: 2.5,
  border: 0,
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "text.secondary",
  bgcolor: "transparent",
  backgroundImage: "none",
  boxShadow: "none",
  "&:hover": { color: "text.primary", bgcolor: "action.hover", backgroundImage: "none", boxShadow: "none" },
} as const;
