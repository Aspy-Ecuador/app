import { render, screen } from "@testing-library/react";
import ShowAppointment from "@/components/ShowAppointment";
import { Appointment } from "@/types/Appointment";
import "@testing-library/jest-dom";

describe("ShowAppointment component", () => {
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

  test("renders appointment data correctly", () => {
    render(<ShowAppointment citas={mockCitas} />);

    // Verifica que el nombre del paciente esté en el documento
    expect(screen.getByText("Paciente: Carlos Salazar")).toBeInTheDocument();

    // Verifica que el nombre del doctor esté en el documento
    expect(screen.getByText("Profesional: Dayse Valverde")).toBeInTheDocument();

    // Verifica que la hora de inicio esté en el documento
    expect(screen.getByText("09:00")).toBeInTheDocument();

    // Verifica que la fecha esté en el documento
    expect(screen.getByText("2025-06-15")).toBeInTheDocument();
  });

  test("renders multiple appointments", () => {
    const multipleCitas: Appointment[] = [
      ...mockCitas,
      {
        id: 2,
        date: "2025-06-15",
        startTime: "09:00",
        endTime: "10:00",
        assist: false,
        patient: {
          id: 101,
          first_name: "Laura",
          last_name: "Gómez",
          email: "carlos@example.com",
          role: "paciente",
          age: 30,
          gender: "M",
        },
        professional: {
          id: 201,
          first_name: "Carlos",
          last_name: "Salazar",
          email: "dayse@example.com",
          role: "doctor",
          age: 35,
          gender: "F",
        },
      },
    ];

    render(<ShowAppointment citas={multipleCitas} />);

    expect(screen.getByText("Paciente: Carlos Salazar")).toBeInTheDocument();
    expect(screen.getByText("Profesional: Dayse Valverde")).toBeInTheDocument();
    expect(screen.getAllByText("09:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2025-06-15").length).toBeGreaterThan(0);

    expect(screen.getByText("Paciente: Laura Gómez")).toBeInTheDocument();
    expect(screen.getByText("Profesional: Carlos Salazar")).toBeInTheDocument();
    expect(screen.getAllByText("09:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2025-06-15").length).toBeGreaterThan(0);
  });
});
