// Fecha con calendario propio (MUI X, en español) en lugar del selector del navegador.
// Es el ÚNICO campo de fecha del sistema: registro, alta y edición de usuarios, "Mis horarios" y el
// filtro de citas de secretaría (ver "Mapa de pantallas" en CLAUDE.md). No uses <input type="date">.
// Guarda la fecha como texto "AAAA-MM-DD", igual que un <input type="date">.
// En pantallas táctiles (celular y tablet) se abre como diálogo, con botones grandes para el dedo.
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { authFieldSx } from "@components/auth/estilos";
import { C } from "@components/landing/constants";
import { botonRedondo, estiloCalendario } from "./estilosCalendario";

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
  /** Muestra una ✕ para borrar la fecha (útil en filtros). */
  limpiable?: boolean;
  /** Estilo del campo de texto (por defecto, el de login y registro). */
  fieldSx?: object;
}

const limites = (tipo: TipoFecha) => {
  const hoy = dayjs();
  if (tipo === "nacimiento") return { minDate: dayjs("1900-01-01"), maxDate: hoy, openTo: "year" as const, yearsOrder: "desc" as const };
  return { minDate: tipo === "futura" ? hoy : dayjs("2020-01-01"), maxDate: hoy.add(2, "year").endOf("year"), openTo: "day" as const, yearsOrder: "asc" as const };
};

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
  limpiable = false,
  fieldSx = authFieldSx,
}: CampoFechaProps) {
  const fecha = value ? dayjs(value) : null;
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
      localeText={{ ...esES.components.MuiLocalizationProvider.defaultProps.localeText, datePickerToolbarTitle: titulo, okButtonLabel: "Aceptar", fieldClearLabel: "Borrar la fecha" }}
    >
      <DatePicker
        value={fecha?.isValid() ? fecha : null}
        onChange={(v) => onChange(v?.isValid() ? v.format("YYYY-MM-DD") : "")}
        format="DD/MM/YYYY"
        disabled={disabled}
        views={["year", "month", "day"]}
        {...limites(tipo)}
        slots={{ openPickerIcon: CalendarMonthRoundedIcon }}
        slotProps={{
          textField: { id, name, fullWidth: true, error, helperText, onBlur, inputRef, sx: fieldSx },
          field: { clearable: limpiable },
          clearButton: { size: "small", sx: botonRedondo(28) },
          openPickerButton: { size: "small", sx: { ...botonRedondo(32), color: C.blueDark }, "aria-label": "Abrir el calendario" },
          toolbar: { hidden: false, toolbarFormat: "D [de] MMMM [de] YYYY", toolbarPlaceholder: "Elige una fecha" },
          desktopPaper: { sx: estiloCalendario(false) },
          mobilePaper: { sx: estiloCalendario(true) },
        }}
      />
    </LocalizationProvider>
  );
}
