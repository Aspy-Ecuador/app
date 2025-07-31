import * as React from "react";
import { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { WorkerSchedule } from "@/types/WorkerSchedule";

interface DateCalendarValueProps {
  availableSchedules: WorkerSchedule[];
  onScheduleSelect: (scheduleId: number) => void;
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
    availableSchedules.filter(
      (ws) => ws.schedule.date === selectedDate.format("YYYY-MM-DD")
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
    newScheduleId: string
  ) => {
    const id = parseInt(newScheduleId);
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
        {schedulesForSelectedDate?.map((ws) => {
          const label = `${ws.schedule.start_time.slice(0, 5)} - ${ws.schedule.end_time.slice(0, 5)}`;
          return (
            <ToggleButton
              key={ws.schedule_id}
              value={ws.schedule_id.toString()}
              aria-label={label}
              className="m-1 rounded-xl"
            >
              {label}
            </ToggleButton>
          );
        }) || (
          <p className="mt-2 text-sm text-gray-500">
            Seleccione una fecha válida
          </p>
        )}
      </ToggleButtonGroup>
    </div>
  );
}
