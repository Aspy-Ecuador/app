import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateService from "../CreateService";

// Mock del componente ServiceForm
jest.mock("../forms/ServiceForm", () => {
  return ({ isEditMode }: { isEditMode: boolean }) => (
    <div>ServiceForm - isEditMode: {isEditMode ? "true" : "false"}</div>
  );
});

describe("CreateService", () => {
  it("renderiza el título y el formulario correctamente", () => {
    render(
      <MemoryRouter>
        <CreateService />
      </MemoryRouter>
    );

    // Verifica que el título se muestre (ajusta si el texto no es exacto)
    expect(screen.getByText("Registrar Servicio")).toBeInTheDocument();

    // Verifica que el formulario se renderice con isEditMode = false
    expect(
      screen.getByText("ServiceForm - isEditMode: false")
    ).toBeInTheDocument();
  });
});
