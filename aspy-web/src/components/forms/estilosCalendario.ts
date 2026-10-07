// Aspecto de TODOS los calendarios de MUI X del sistema (ver "Mapa de pantallas" en CLAUDE.md):
// la ventana de `CampoFecha` y el calendario fijo de "Agendar cita" (`DateCalendarValue`).
// Si cambias algo aquí, cambia en todos a la vez.
import { aspy } from "@shared-theme/themePrimitives";
import { C, DISPLAY_FONT } from "@components/landing/constants";

export const AZUL = `linear-gradient(135deg, #2C7F9C 0%, ${C.blueDark} 100%)`;
/** Día, mes o año elegido (azul de la marca). */
export const seleccionAzul = { color: "#fff", background: AZUL, boxShadow: "0 6px 14px rgba(44,127,156,0.35)", "&:hover, &:focus": { background: AZUL } };
/** Variante verde: la usa "Agendar cita", donde el verde significa "día con horarios". */
export const seleccionVerde = { color: "#fff", background: "#1D9E75", boxShadow: "0 6px 14px rgba(15,110,86,0.32)", "&:hover, &:focus": { background: "#0F6E56" } };
export const botonRedondo = (lado: number) => ({ width: lado, height: lado, border: 0, borderRadius: "50%", bgcolor: "transparent", color: aspy.text, "&:hover": { bgcolor: C.blueLight } });

/**
 * Medidas. Con mouse el calendario es compacto; en pantallas táctiles tiene menos opciones por fila
 * y botones de 48 px (lo mínimo cómodo para tocar con el pulgar).
 */
export function medidasCalendario(tactil: boolean) {
  const dia = tactil ? 40 : 34; // lado de cada día
  const encabezado = tactil ? 62 : 54;
  return {
    dia,
    opcion: tactil ? 48 : 34, // alto de cada año o mes
    ancho: tactil ? "min(320px, calc(100vw - 34px))" : 292, // el de MUI es 320
    separacion: tactil ? 8 : 4,
    encabezado,
    // Alto fijo para las tres vistas (encabezado + días de la semana + 6 filas de días): si cambiara
    // al pasar de años a meses o días, la ventana quedaría mal ubicada y se cortaría contra el borde.
    alto: encabezado + 30 + 6 * (dia + 4),
  };
}

/** Interior del calendario: mes y flechas, días de la semana, días, y cuadrícula de años y meses. */
export function interiorCalendario(tactil: boolean, seleccion: object = seleccionAzul) {
  const { dia, opcion, separacion, encabezado, alto } = medidasCalendario(tactil);
  return {
    "& .MuiDayCalendar-slideTransition": { minHeight: 6 * (dia + 4) },
    // Mes y año, y flechas
    "& .MuiPickersCalendarHeader-root": { pl: 2.25, pr: 1.25, mt: 1.25, mb: 0.5 },
    "& .MuiPickersCalendarHeader-label": { fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: tactil ? "1.05rem" : "0.95rem", textTransform: "capitalize" },
    "& .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button": botonRedondo(tactil ? 44 : 32),
    "& .MuiDayCalendar-weekDayLabel": { width: dia, height: 30, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: aspy.muted },
    // Días
    "& .MuiPickersDay-root": {
      width: dia,
      height: dia,
      borderRadius: "11px",
      border: 0,
      fontSize: tactil ? "0.95rem" : "0.84rem",
      fontWeight: 500,
      bgcolor: "transparent",
      color: aspy.text,
      "&:hover": { bgcolor: C.blueLight },
      "&.MuiPickersDay-today": { border: `1.5px solid ${C.blue}` },
      "&.Mui-selected": seleccion,
      "&.Mui-disabled:not(.Mui-selected)": { color: aspy.muted, opacity: 0.45 },
    },
    // Años y meses: cuadrícula que siempre llena el ancho. Con el diseño de MUI (botones de ancho
    // fijo), la barra de desplazamiento de los años quitaba espacio y dejaba un hueco a la derecha.
    "& .MuiYearCalendar-root, & .MuiMonthCalendar-root": {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: `${separacion}px ${separacion + 2}px`,
      width: "100%",
      boxSizing: "border-box",
      px: 1.5,
      pt: 0.5,
      pb: 1.5,
    },
    "& .MuiYearCalendar-root": {
      gridTemplateColumns: `repeat(${tactil ? 3 : 4}, 1fr)`,
      maxHeight: alto - encabezado,
      scrollbarWidth: "thin",
    },
    "& .MuiPickersYear-root, & .MuiPickersMonth-root": { display: "block", flexBasis: "auto" },
    "& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton": {
      width: "100%",
      height: opcion,
      m: 0,
      borderRadius: tactil ? "14px" : "11px",
      fontSize: tactil ? "1.05rem" : "0.86rem",
      fontWeight: 600,
      textTransform: "capitalize",
      color: aspy.text,
      "&:hover": { bgcolor: C.blueLight },
      "&.Mui-selected": seleccion,
      "&.Mui-disabled": { color: aspy.muted, opacity: 0.45 },
    },
  };
}

/** Ventana (con mouse) o diálogo (táctil) del calendario que abre `CampoFecha`. */
export function estiloCalendario(tactil: boolean) {
  const { ancho, alto } = medidasCalendario(tactil);
  return {
    overflow: "hidden",
    mt: tactil ? 0 : 1,
    mx: tactil ? 2 : undefined,
    borderRadius: "20px",
    border: "1px solid",
    borderColor: aspy.border,
    bgcolor: aspy.card,
    backgroundImage: "none",
    color: aspy.text,
    boxShadow: "0 24px 60px rgba(18,38,58,0.22)",
    // Encabezado de color con la fecha elegida
    "& .MuiPickersToolbar-root": { px: 2.25, pt: 1.75, pb: 1.5, color: "#fff", background: AZUL },
    "& .MuiPickersToolbar-root .MuiTypography-overline": { color: "rgba(255,255,255,0.85)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", lineHeight: 1.6 },
    "& .MuiDatePickerToolbar-title": { fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: "1.25rem", lineHeight: 1.2, color: "#fff" },
    "& .MuiDateCalendar-root": { width: ancho, height: alto, maxHeight: "none" },
    ...interiorCalendario(tactil),
    // Botones del diálogo (pantallas táctiles)
    "& .MuiDialogActions-root": { px: 2, pb: 2, gap: 1 },
    "& .MuiDialogActions-root .MuiButton-root": { minHeight: 44, borderRadius: "999px", px: 2.5, fontSize: "0.95rem", fontWeight: 700, color: C.blueDark, textTransform: "none" },
  };
}
