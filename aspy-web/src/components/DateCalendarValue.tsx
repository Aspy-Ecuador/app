// FINAL
import { useState } from "react";
import type { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { esES } from "@mui/x-date-pickers/locales";
import "dayjs/locale/es";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tone } from "@shared-theme/themePrimitives";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { modalidadDe } from "@utils/citaVirtual";
import type { Modalidad } from "@/typesResponse/WorkerSchedule";
import { interiorCalendario, medidasCalendario, seleccionVerde } from "@forms/estilosCalendario";

interface DateCalendarValueProps {
  availableSchedules: WorkerProfessional[];
  /** null = se quitó la hora elegida (al cambiar de día o de modalidad). */
  onScheduleSelect: (id: number | null) => void;
}

type Filtro = "todas" | Modalidad;

const FILTROS: [Filtro, string][] = [
  ["todas", "Todas"],
  ["presencial", "Presenciales"],
  ["virtual", "Virtuales"],
];

/** Los dos apartados en que se muestran las horas de un día. */
const APARTADOS: { modalidad: Modalidad; titulo: string; icono: React.ReactNode }[] = [
  { modalidad: "presencial", titulo: "Citas presenciales", icono: <PlaceRoundedIcon sx={{ fontSize: 14 }} /> },
  { modalidad: "virtual", titulo: "Citas virtuales", icono: <VideocamRoundedIcon sx={{ fontSize: 14 }} /> },
];

export default function DateCalendarValue({
  availableSchedules,
  onScheduleSelect,
}: DateCalendarValueProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );
  // Presencial o virtual: la elige el profesional al crear cada horario y la revisa Secretaría
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const ofrecidos = filtro === "todas" ? availableSchedules : availableSchedules.filter((wp) => modalidadDe(wp) === filtro);
  const cuantos = (m: Filtro) => (m === "todas" ? availableSchedules.length : availableSchedules.filter((wp) => modalidadDe(wp) === m).length);

  // Igual que CampoFecha: botones más grandes cuando se usa con el dedo
  const tactil = useMediaQuery("(pointer: coarse)");
  const { alto } = medidasCalendario(tactil);

  const enabledDates = [
    ...new Set(ofrecidos.map((wp) => wp.schedule.date.split("T")[0])),
  ];

  const schedulesForDate = selectedDate
    ? ofrecidos
        .filter(
          (wp) =>
            wp.schedule.date.split("T")[0] ===
            selectedDate.format("YYYY-MM-DD"),
        )
        .sort((a, b) =>
          a.schedule.start_time.localeCompare(b.schedule.start_time),
        )
    : [];

  const shouldDisableDate = (day: Dayjs) =>
    !enabledDates.includes(day.format("YYYY-MM-DD"));

  // Al cambiar de día o de modalidad se suelta la hora elegida: si no, se podía seguir al pago con una
  // hora que ya no está a la vista
  const soltarHora = () => {
    setSelectedScheduleId(null);
    onScheduleSelect(null);
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    soltarHora();
  };

  const handleFiltro = (nuevo: Filtro) => {
    setFiltro(nuevo);
    soltarHora();
    // Si el día elegido no tiene horarios de esa modalidad, se vuelve a elegir el día
    const dia = selectedDate?.format("YYYY-MM-DD");
    const quedan = nuevo === "todas" ? availableSchedules : availableSchedules.filter((wp) => modalidadDe(wp) === nuevo);
    if (dia && !quedan.some((wp) => wp.schedule.date.split("T")[0] === dia)) setSelectedDate(null);
  };

  const handleHourSelect = (id: number) => {
    setSelectedScheduleId(id);
    onScheduleSelect(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {/* Modalidad: qué horarios se ven en el calendario */}
      <Box sx={{ width: "100%" }}>
        <Typography id="cita-modalidad-etiqueta" sx={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled", mb: 0.75, textAlign: "center" }}>
          Modalidad de la cita
        </Typography>
        <Box role="group" aria-labelledby="cita-modalidad-etiqueta" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, justifyContent: "center" }}>
          {FILTROS.map(([valor, texto]) => {
            const activo = filtro === valor;
            const n = cuantos(valor);
            return (
              <ButtonBase
                key={valor}
                aria-pressed={activo}
                disabled={n === 0 && !activo}
                onClick={() => handleFiltro(valor)}
                sx={{
                  px: 1.5,
                  minHeight: 32,
                  borderRadius: "999px",
                  border: "0.5px solid",
                  borderColor: activo ? tone.blue.fg : "divider",
                  bgcolor: activo ? tone.blue.fg : "transparent",
                  color: activo ? "background.paper" : "text.secondary",
                  fontSize: 12,
                  fontWeight: 600,
                  "&.Mui-disabled": { opacity: 0.5 },
                }}
              >
                {texto} ({n})
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* Calendario en español: meses, días y botones */}
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          sx={{
            ...interiorCalendario(tactil, seleccionVerde),
            width: "100%",
            maxWidth: tactil ? 320 : 300,
            height: alto,
            maxHeight: "none",
            m: 0,
            // Verde = día con horarios disponibles
            "& .MuiPickersDay-root:not(.Mui-disabled):not(.Mui-selected)": {
              bgcolor: tone.green.bg,
              color: tone.green.fg,
              fontWeight: 600,
              "&:hover": { bgcolor: tone.green.border },
            },
          }}
        />
      </LocalizationProvider>

      {/* Horarios */}
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.disabled",
            mb: 1,
            textAlign: "center",
          }}
        >
          Horarios disponibles
        </Typography>

        {selectedDate ? (
          schedulesForDate.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {APARTADOS.map(({ modalidad, titulo, icono }) => {
              const delApartado = schedulesForDate.filter((wp) => modalidadDe(wp) === modalidad);
              if (delApartado.length === 0) return null;
              const color = modalidad === "virtual" ? tone.blue : tone.green;
              return (
            <Box key={modalidad} component="section" aria-label={titulo}>
              <Typography component="h3" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, fontSize: 12, fontWeight: 600, color: color.fg, mb: 0.75 }}>
                {icono}
                {titulo}
              </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                justifyContent: "center",
              }}
            >
              {delApartado.map((wp) => {
                const label = `${wp.schedule.start_time.slice(0, 5)} — ${wp.schedule.end_time.slice(0, 5)}`;
                const isSelected = selectedScheduleId === wp.worker_schedule_id;
                return (
                  <ButtonBase
                    key={wp.worker_schedule_id}
                    onClick={() => handleHourSelect(wp.worker_schedule_id)}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      border: "0.5px solid",
                      borderColor: isSelected ? tone.green.main : "divider",
                      bgcolor: isSelected ? tone.green.bg : "action.hover",
                      color: isSelected ? tone.green.fg : "text.secondary",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "monospace",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: tone.green.border,
                        color: tone.green.fg,
                        bgcolor: tone.green.bg,
                      },
                    }}
                  >
                    {label}
                  </ButtonBase>
                );
              })}
            </Box>
            </Box>
              );
            })}
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: 12,
                color: "text.disabled",
                textAlign: "center",
                py: 2,
              }}
            >
              No hay horarios disponibles para esta fecha
            </Typography>
          )
        ) : (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.disabled",
              textAlign: "center",
              py: 2,
            }}
          >
            Selecciona una fecha para ver los horarios
          </Typography>
        )}
      </Box>
    </Box>
  );
}
