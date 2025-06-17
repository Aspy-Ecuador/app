import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function DateCalendarValue() {
  const [value] = React.useState<Dayjs | null>(dayjs()); // I removed setValue since it was not used
  const hours = [
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const [hora] = React.useState<string | null>(null); // I removed setHora since it was not used

  /*
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    console.log(newValue?.format("YYYY-MM-DD"));
  };*/  //Not used in the current implementation

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar", "DateCalendar"]}>
          <DemoItem>
            <DateCalendar value={value} />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      <ToggleButtonGroup
        color="primary"
        value={hora}
        exclusive
        aria-label="Hora"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "60%",
        }}
      >
        {hours.map((hour) => (
          <ToggleButton
            style={{
              margin: "5px",
              borderRadius: "10px",
            }}
            value={hour}
            aria-label={hour}
            key={hour}
            disabled={false}
          >
            {hour}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
