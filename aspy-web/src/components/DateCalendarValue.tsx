// FINAL
import { useState } from "react";
import type { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          sx={{
            width: "100%",
            maxWidth: 300,
            m: 0,
            "& .MuiPickersDay-root": { fontSize: 12, borderRadius: "50%" },
            "& .MuiPickersDay-root:not(.Mui-disabled)": { fontWeight: 500 },
            "& .MuiPickersDay-root.Mui-selected": {
              bgcolor: "#1D9E75",
              "&:hover": { bgcolor: "#0F6E56" },
            },
            "& .MuiPickersDay-root:not(.Mui-disabled):not(.Mui-selected)": {
              bgcolor: "#E1F5EE",
              color: "#0F6E56",
              "&:hover": { bgcolor: "#9FE1CB" },
            },
            "& .MuiDayCalendar-weekDayLabel": {
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "text.disabled",
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
                      borderColor: isSelected ? "#1D9E75" : "divider",
                      bgcolor: isSelected ? "#E1F5EE" : "action.hover",
                      color: isSelected ? "#0F6E56" : "text.secondary",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "monospace",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: "#9FE1CB",
                        color: "#0F6E56",
                        bgcolor: "#E1F5EE",
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
