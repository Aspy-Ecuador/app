import * as React from "react";
import { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";

interface DateCalendarValueProps {
  availableSchedules: WorkerScheduleResponse[];
  onScheduleSelect: (workerScheduleId: number) => void;
}

export default function DateCalendarValue({
  availableSchedules,
  onScheduleSelect,
}: DateCalendarValueProps) {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<
    number | null
  >(null);

  const enabledDates = [
    ...new Set(availableSchedules.map((ws) => ws.schedule.date)),
  ];

  const schedulesForSelectedDate =
    selectedDate &&
    availableSchedules
      .filter((ws) => ws.schedule.date === selectedDate.format("YYYY-MM-DD"))
      .sort((a, b) =>
        a.schedule.start_time.localeCompare(b.schedule.start_time)
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
    newWorkerScheduleId: string | null
  ) => {
    if (newWorkerScheduleId === null) return;
    const id = parseInt(newWorkerScheduleId);
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
        value={selectedScheduleId}
        exclusive
        onChange={handleHourChange}
        aria-label="Hora"
        className="flex flex-wrap justify-center w-3/5 mt-4"
      >
        {schedulesForSelectedDate && schedulesForSelectedDate.length > 0 ? (
          schedulesForSelectedDate.map((ws) => {
            const label = `${ws.schedule.start_time.slice(0, 5)} - ${ws.schedule.end_time.slice(0, 5)}`;
            return (
              <ToggleButton
                key={ws.worker_schedule_id}
                value={ws.worker_schedule_id.toString()} // ✅ ahora usamos el ID del workerSchedule
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
