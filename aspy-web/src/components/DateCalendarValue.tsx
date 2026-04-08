import { useState } from "react";
import { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

interface DateCalendarValueProps {
  availableSchedules: WorkerProfessional[];
  onScheduleSelect: (workerProfessionalId: number) => void;
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

  const schedulesForSelectedDate =
    selectedDate &&
    availableSchedules
      .filter(
        (wp) =>
          wp.schedule.date.split("T")[0] === selectedDate.format("YYYY-MM-DD"),
      )
      .sort((a, b) =>
        a.schedule.start_time.localeCompare(b.schedule.start_time),
      );

  console.log(
    "Available schedules for selected date:",
    schedulesForSelectedDate,
  );
  const shouldDisableDate = (day: Dayjs) => {
    return !enabledDates.includes(day.format("YYYY-MM-DD"));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setSelectedScheduleId(null);
  };

  const handleHourChange = (
    _: React.MouseEvent<HTMLElement>,
    newWorkerProfessionalId: string | null,
  ) => {
    if (newWorkerProfessionalId === null) return;
    const id = parseInt(newWorkerProfessionalId);
    setSelectedScheduleId(id);
    onScheduleSelect(id);
  };

  return (
    <div className="flex flex-col items-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar"]}>
          <DemoItem>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>

      <ToggleButtonGroup
        color="primary"
        value={selectedScheduleId?.toString() ?? null}
        exclusive
        onChange={handleHourChange}
        aria-label="Hora"
        className="flex flex-wrap justify-center w-3/5 mt-4"
      >
        {schedulesForSelectedDate && schedulesForSelectedDate.length > 0 ? (
          schedulesForSelectedDate.map((wp) => {
            const label = `${wp.schedule.start_time.slice(0, 5)} - ${wp.schedule.end_time.slice(0, 5)}`;
            return (
              <ToggleButton
                key={wp.worker_schedule_id}
                value={wp.worker_schedule_id}
                aria-label={label}
                className="m-1 rounded-xl"
              >
                {label}
              </ToggleButton>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" className="mt-2">
            Seleccione una fecha válida
          </Typography>
        )}
      </ToggleButtonGroup>
    </div>
  );
}
