import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditService from "../EditService";

// Mock de ServiceForm
jest.mock("@forms/ServiceForm", () => {
  return ({ isEditMode, serviceId }: { isEditMode: boolean; serviceId?: number }) => (
    <div>
      ServiceForm - isEditMode: {isEditMode ? "true" : "false"}, serviceId: {serviceId}
    </div>
  );
});

describe("EditService", () => {
  it("renderiza correctamente con el ID del servicio", () => {
    render(
      <MemoryRouter initialEntries={["/edit-service/42"]}>
        <Routes>
          <Route path="/edit-service/:id" element={<EditService />} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica que el título se muestre
    expect(screen.getByText("Editar Servicio")).toBeInTheDocument();

    // Verifica que el form reciba los props correctos
    expect(screen.getByText("ServiceForm - isEditMode: true, serviceId: 42")).toBeInTheDocument();
  });
});
