import * as React from "react";
import { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AvailableDateTime } from "@/types/AvailableDateTime";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface DateCalendarValueProps {
  fetchAvailableDates: () => Promise<AvailableDateTime[]>;
  onDateChange: (date: string) => void;
  onHourChange: (hour: string) => void;
}

export default function DateCalendarValue({
  fetchAvailableDates,
  onDateChange,
  onHourChange,
}: DateCalendarValueProps) {
  const [available, setAvailable] = React.useState<AvailableDateTime[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedHour, setSelectedHour] = React.useState<string | null>(null);

  // Cargar las fechas disponibles al montar el componente
  React.useEffect(() => {
    fetchAvailableDates().then((data) => setAvailable(data));
  }, [fetchAvailableDates]);

  // Extraer fechas disponibles
  const enabledDates = available.map((item) => item.date);

  // Filtrar horas según fecha seleccionada
  const hoursForSelectedDate =
    selectedDate &&
    available.find((item) => item.date === selectedDate.format("YYYY-MM-DD"))
      ?.hours;

  // Habilitar solo los días disponibles
  const shouldDisableDate = (day: Dayjs) => {
    return !enabledDates.includes(day.format("YYYY-MM-DD"));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setSelectedHour(null);
    if (newValue) {
      onDateChange(newValue.format("YYYY-MM-DD"));
    }
  };

  const handleHourChange = (
    _: React.MouseEvent<HTMLElement>,
    newHour: string
  ) => {
    setSelectedHour(newHour);
    onHourChange(newHour);
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
        value={selectedHour}
        exclusive
        onChange={handleHourChange}
        aria-label="Hora"
        className="flex flex-wrap justify-center w-3/5 mt-4"
      >
        {hoursForSelectedDate?.map((hour) => (
          <ToggleButton
            key={hour}
            value={hour}
            aria-label={hour}
            className="m-1 rounded-xl"
          >
            {hour}
          </ToggleButton>
        )) || (
          <p className="mt-2 text-sm text-gray-500">
            Seleccione una fecha válida
          </p>
        )}
      </ToggleButtonGroup>
    </div>
  );
}
