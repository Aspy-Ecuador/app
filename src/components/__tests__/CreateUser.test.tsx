import { render, screen } from "@testing-library/react";
jest.mock("@assets/visto.png", () => "test-file-stub");
jest.mock("@assets/cita.png", () => "test-file-stub");
import CreateUser from "../CreateUser";
import { MemoryRouter } from "react-router-dom";

// Mock del componente UserForm
jest.mock("@forms/UserForm", () => {
  return ({ isEditMode, role }: { isEditMode: boolean; role: string }) => (
    <div>
      UserForm - isEditMode: {isEditMode ? "true" : "false"}, role: {role}
    </div>
  );
});

describe("CreateUser", () => {
  it("renderiza correctamente con el rol proporcionado", () => {
    render(
      <MemoryRouter>
        <CreateUser role="admin" />
      </MemoryRouter>
    );

    expect(screen.getByText("Crear Usuario")).toBeInTheDocument();
    expect(
      screen.getByText("UserForm - isEditMode: false, role: admin")
    ).toBeInTheDocument();
  });
});
