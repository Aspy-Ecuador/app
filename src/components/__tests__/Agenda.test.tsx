import { render, screen } from "@testing-library/react";
import Agenda from "@/components/Agenda";
import "@testing-library/jest-dom";
import { Appointment } from "@/types/Appointment";

// Mock específico solo para este test file
jest.mock("@aldabil/react-scheduler", () => ({
  Scheduler: ({ events }: { events: any[] }) => (
    <div data-testid="scheduler-mock">
      {events.map((event, idx) => (
        <div key={idx}>
          Paciente: {event.title} <br />
          Profesional: {event.professional}
        </div>
      ))}
    </div>
  ),
}));

describe("Agenda component", () => {
  const mockCitas: Appointment[] = [
    {
      id: 1,
      date: "2025-06-15",
      startTime: "09:00",
      endTime: "10:00",
      assist: true,
      report: "Paciente puntual",
      patient: {
        id: 101,
        first_name: "Carlos",
        last_name: "Salazar",
        email: "carlos@example.com",
        role: "paciente",
        age: 30,
        gender: "M",
      },
      professional: {
        id: 201,
        first_name: "Dayse",
        last_name: "Valverde",
        email: "dayse@example.com",
        role: "doctor",
        age: 35,
        gender: "F",
      },
    },
  ];

  test("renders scheduler mock", () => {
    render(<Agenda citas={mockCitas} />);
    expect(screen.getByTestId("scheduler-mock")).toBeInTheDocument();
  });

  test("renders event titles from citas", () => {
    render(<Agenda citas={mockCitas} />);
    // Aquí pruebas que el texto que generas está en el DOM
    expect(screen.getByText(/Paciente: Carlos Salazar/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Profesional: Dayse Valverde/i)
    ).toBeInTheDocument();
  });
});
