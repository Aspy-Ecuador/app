import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppointmentView from "../AppointmentView";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Opcional: mockeamos AppointmentCreation para evitar testearlo aquí
jest.mock("../AppointmentCreation", () => () => <div>Mocked AppointmentCreation</div>);

describe("AppointmentView", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders title and back button", () => {
    render(
      <MemoryRouter>
        <AppointmentView />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /agendar cita/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
    expect(screen.getByText("Mocked AppointmentCreation")).toBeInTheDocument();
  });

  it("calls navigate(-1) when clicking back button", () => {
    render(
      <MemoryRouter>
        <AppointmentView />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: /volver/i });
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
