import { render, screen } from "@testing-library/react";
jest.mock("@assets/visto.png", () => "test-file-stub");
jest.mock("@assets/cita.png", () => "test-file-stub");
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditRole from "../EditUser";

// Mock del formulario de usuario
jest.mock("@forms/UserForm", () => {
  return ({ isEditMode, userId }: { isEditMode: boolean; userId: number }) => (
    <div>
      UserForm - isEditMode: {isEditMode ? "true" : "false"}, userId: {userId}
    </div>
  );
});

describe("EditRole (Editar Usuario)", () => {
  it("renderiza correctamente con el ID del usuario", () => {
    render(
      <MemoryRouter initialEntries={["/edit-user/77"]}>
        <Routes>
          <Route path="/edit-user/:id" element={<EditRole />} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica que el título se muestre
    expect(screen.getByText("Editar Usuario")).toBeInTheDocument();
    // Verifica que el UserForm se haya renderizado con los props correctos
    expect(screen.getByText("UserForm - isEditMode: true, userId: 77")).toBeInTheDocument();
  });
});
