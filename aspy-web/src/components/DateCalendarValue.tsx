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
import { interiorCalendario, medidasCalendario, seleccionVerde } from "@forms/estilosCalendario";

interface DateCalendarValueProps {
  availableSchedules: WorkerProfessional[];
  onScheduleSelect: (id: number) => void;
}

export default function DateCalendarValue({
  availableSchedules,
  onScheduleSelect,
}: DateCalendarValueProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );

  // Igual que CampoFecha: botones más grandes cuando se usa con el dedo
  const tactil = useMediaQuery("(pointer: coarse)");
  const { alto } = medidasCalendario(tactil);

  const enabledDates = [
    ...new Set(availableSchedules.map((wp) => wp.schedule.date.split("T")[0])),
  ];

  const schedulesForDate = selectedDate
    ? availableSchedules
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

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setSelectedScheduleId(null);
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
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                justifyContent: "center",
              }}
            >
              {schedulesForDate.map((wp) => {
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
