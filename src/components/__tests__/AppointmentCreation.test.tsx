import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppointmentCreation from "../AppointmentCreation";

// Mocks
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

jest.mock("../DateCalendarValue", () => (props: any) => {
  // Simula selección de fecha y hora
  props.onDateChange("2025-06-15");
  props.onHourChange("10:00");
  return <div>Mocked Calendar</div>;
});

jest.mock("@utils/utils", () => ({
  getServicesAppointment: () => [
    { id: 1, name: "Terapia" },
    { id: 2, name: "Psicología" },
  ],
  getProfessionalAppointment: () => [
    { id: 1, name: "Dr. House" },
    { id: 2, name: "Dra. Grey" },
  ],
  getDates: () => Promise.resolve([]),
}));

describe("AppointmentCreation", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders form and calendar", () => {
    render(
      <MemoryRouter>
        <AppointmentCreation />
      </MemoryRouter>
    );

    // Hay 2 selects (combobox): servicio y profesional
    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(2);

    // Hay 1 input para la cédula
    const cedulaInput = screen.getByRole("textbox");
    expect(cedulaInput).toBeInTheDocument();

    expect(screen.getByLabelText("Presencial")).toBeInTheDocument();
    expect(screen.getByLabelText("Virtual")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proceder a pagar/i })).toBeInTheDocument();
    expect(screen.getByText("Mocked Calendar")).toBeInTheDocument();
  });

  it("shows error if fields are missing", () => {
    render(
      <MemoryRouter>
        <AppointmentCreation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /proceder a pagar/i }));

    expect(screen.getByText(/por favor, complete todos los campos/i)).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /pago when all fields are filled", () => {
    render(
      <MemoryRouter>
        <AppointmentCreation />
      </MemoryRouter>
    );

    const selects = screen.getAllByRole("combobox");
    const cedulaInput = screen.getByRole("textbox");

    // Selecciona servicio y profesional
    fireEvent.change(selects[0], { target: { value: "1" } });
    fireEvent.change(selects[1], { target: { value: "1" } });

    // Tipo de consulta
    fireEvent.click(screen.getByLabelText("Virtual"));

    // Cédula
    fireEvent.change(cedulaInput, { target: { value: "1234567890" } });

    // Click al botón
    fireEvent.click(screen.getByRole("button", { name: /proceder a pagar/i }));

    expect(mockedNavigate).toHaveBeenCalledWith("/pago");
  });
});
