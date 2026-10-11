// Fecha con calendario propio (MUI X, en español) en lugar del selector del navegador.
// Es el ÚNICO campo de fecha del sistema: registro, alta y edición de usuarios, "Mis horarios" y el
// filtro de citas de secretaría (ver "Mapa de pantallas" en CLAUDE.md). No uses <input type="date">.
// Guarda la fecha como texto "AAAA-MM-DD", igual que un <input type="date">.
// En pantallas táctiles (celular y tablet) se abre como diálogo, con botones grandes para el dedo.
import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { authFieldSx } from "@components/auth/estilos";
import { C } from "@components/landing/constants";
import { botonRedondo, estiloCalendario } from "./estilosCalendario";
import { hoyEcuador } from "@utils/utils";

/**
 * Qué fechas se pueden elegir:
 * - `nacimiento`: abre en los años (del más reciente al más antiguo) y no deja elegir días futuros.
 * - `futura`: de hoy en adelante (p. ej., un horario nuevo).
 * - `cualquiera`: pasadas y futuras (p. ej., un filtro).
 */
type TipoFecha = "nacimiento" | "futura" | "cualquiera";

interface CampoFechaProps {
  id: string;
  name?: string;
  /** Texto del encabezado del calendario (p. ej., "Fecha de nacimiento"). */
  titulo: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  tipo?: TipoFecha;
  /** Última fecha que se puede elegir ("AAAA-MM-DD"), si es antes que el límite del tipo. */
  max?: string;
  /** Muestra una ✕ para borrar la fecha (útil en filtros). */
  limpiable?: boolean;
  /** Estilo del campo de texto (por defecto, el de login y registro). */
  fieldSx?: object;
}

const limites = (tipo: TipoFecha) => {
  // "Hoy" es el día de Ecuador (hora del sistema), no el del dispositivo
  const hoy = dayjs(hoyEcuador());
  if (tipo === "nacimiento") return { minDate: dayjs("1900-01-01"), maxDate: hoy, openTo: "year" as const, yearsOrder: "desc" as const };
  return { minDate: tipo === "futura" ? hoy : dayjs("2020-01-01"), maxDate: hoy.add(2, "year").endOf("year"), openTo: "day" as const, yearsOrder: "asc" as const };
};

// Una fecha a medio escribir (o con el año todavía en "0002") no se entrega: vale como campo vacío
const aTexto = (v: Dayjs | null) => (v?.isValid() && v.year() >= 1000 ? v.format("YYYY-MM-DD") : "");

export default function CampoFecha({
  id,
  name,
  titulo,
  value,
  onChange,
  onBlur,
  inputRef,
  error = false,
  helperText = "",
  disabled,
  tipo = "nacimiento",
  max,
  limpiable = false,
  fieldSx = authFieldSx,
}: CampoFechaProps) {
  // Lo que hay en el campo mientras se escribe, que puede ser una fecha incompleta. Si por cada tecla se
  // le devolviera a MUI el valor de afuera (vacío, o la fecha anterior), borraría lo ya escrito: por eso
  // reescribir una fecha encima de otra la dejaba en blanco al llegar al año.
  const [interno, setInterno] = useState<Dayjs | null>(() => (value ? dayjs(value) : null));
  // Un valor nuevo que llega de afuera (otro día, o se limpió el filtro) sí reemplaza lo escrito
  const [valorVisto, setValorVisto] = useState(value);
  if (value !== valorVisto) {
    setValorVisto(value);
    if (aTexto(interno) !== value) setInterno(value ? dayjs(value) : null);
  }
  // MUI no vuelve a seleccionar una parte de la fecha (día, mes o año) si se hace clic sobre la que ya
  // estaba seleccionada, por ejemplo después de borrarla con la ✕: queda el cursor en medio y la primera
  // tecla se pierde. Aquí se selecciona la parte donde quedó el cursor, con el mismo criterio de MUI
  // (un clic después del último carácter selecciona la primera parte): un momento después del clic,
  // cuando el navegador ya puso el cursor, y también justo antes de escribir.
  const reseleccionarParte = () => {
    const input = document.getElementById(id);
    if (!(input instanceof HTMLInputElement) || document.activeElement !== input || input.selectionStart !== input.selectionEnd) return;
    const pos = (input.selectionStart ?? 0) >= input.value.length ? 0 : (input.selectionStart ?? 0);
    let inicio = 0;
    for (const parte of input.value.split("/")) {
      const fin = inicio + parte.length;
      if (pos <= fin) {
        input.setSelectionRange(inicio, fin);
        return;
      }
      inicio = fin + 1;
    }
  };
  const alEscribir = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Delete") reseleccionarParte();
  };
  const rango = limites(tipo);
  const tope = max ? dayjs(max) : null;
  if (tope?.isValid() && tope.isBefore(rango.maxDate)) rango.maxDate = tope;
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
      localeText={{ ...esES.components.MuiLocalizationProvider.defaultProps.localeText, datePickerToolbarTitle: titulo, okButtonLabel: "Aceptar", fieldClearLabel: "Borrar la fecha" }}
    >
      {/* Envoltura sin caja propia: escucha el clic y las teclas sin quitarle a MUI sus propios manejadores
          (en pantallas táctiles, el clic sobre el campo es el que abre el calendario) */}
      <Box sx={{ display: "contents" }} onClick={() => window.setTimeout(reseleccionarParte)} onKeyDownCapture={alEscribir}>
        <DatePicker
          value={interno}
          onChange={(v) => {
            setInterno(v);
            onChange(aTexto(v));
          }}
          format="DD/MM/YYYY"
          disabled={disabled}
          views={["year", "month", "day"]}
          {...rango}
          slots={{ openPickerIcon: CalendarMonthRoundedIcon }}
          slotProps={{
            // `error` solo se fija cuando el formulario lo pide: sin eso, MUI marca por su cuenta una fecha
            // imposible (31/02) o fuera del rango permitido
            textField: { id, name, fullWidth: true, error: error || undefined, helperText, onBlur, inputRef, sx: fieldSx },
            field: { clearable: limpiable },
            clearButton: { size: "small", sx: botonRedondo(28) },
            openPickerButton: { size: "small", sx: { ...botonRedondo(32), color: C.blueDark }, "aria-label": "Abrir el calendario" },
            toolbar: { hidden: false, toolbarFormat: "D [de] MMMM [de] YYYY", toolbarPlaceholder: "Elige una fecha" },
            desktopPaper: { sx: estiloCalendario(false) },
            mobilePaper: { sx: estiloCalendario(true) },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
