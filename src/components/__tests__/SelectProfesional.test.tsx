import { render, screen, fireEvent } from "@testing-library/react";
import SelectProfessional from "@/components/SelectProfessional";
import "@testing-library/jest-dom";

// Mock simple de los profesionales
jest.mock("../../utils/utils", () => ({
  getProfesionales: () => [
    { id: 1, firstName: "Carlos", lastName: "Salazar" },
    { id: 2, firstName: "Dayse", lastName: "Valverde" },
  ],
}));

describe("SelectProfessional component", () => {
  test("renders and displays professionals", () => {
    render(<SelectProfessional onSelect={() => { }} />);
    expect(screen.getByText("Profesionales")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Seleccione una opción");
  });

  test("lets user select an option", () => {
    render(<SelectProfessional onSelect={() => { }} />);
    // Abre el menú desplegable
    fireEvent.mouseDown(screen.getByRole("combobox"));

    // Selecciona una opción
    fireEvent.click(screen.getByText("Dayse Valverde"));

    // Opcional: verifica que el valor seleccionado cambió
    expect(screen.getByRole("combobox")).toHaveTextContent("Dayse Valverde");
  });
});
