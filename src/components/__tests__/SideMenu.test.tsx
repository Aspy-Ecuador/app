// src/components/__tests__/SideMenu.test.tsx

import { render, screen } from "@testing-library/react";
import SideMenu from "@/components/SideMenu";
import "@testing-library/jest-dom";

// Mocks para los subcomponentes que importas
jest.mock("@/components/SelectContent", () => () => <div>SelectContent</div>);
jest.mock("@/components/MenuContent", () => () => <div>MenuContent</div>);
jest.mock("@/components/OptionsMenu", () => () => <div>OptionsMenu</div>);
jest.mock("@shared-theme/ColorModeToggle", () => () => <div>ColorModeToggle</div>);
jest.mock("@shared-theme/ThemedLogo", () => () => <div>ThemedLogo</div>);

// Mocks para las funciones que devuelven datos
jest.mock("@/utils/store", () => ({
  getAuthenticatedUserName: () => "Carlos Salazar",
  getAuthenticatedUserEmail: () => "carlos@example.com",
}));

describe("SideMenu", () => {
  it("renders all expected elements", () => {
    render(<SideMenu />);

    // Verifica los subcomponentes renderizados
    expect(screen.getByText("SelectContent")).toBeInTheDocument();
    expect(screen.getByText("MenuContent")).toBeInTheDocument();
    expect(screen.getByText("OptionsMenu")).toBeInTheDocument();
    expect(screen.getByText("ColorModeToggle")).toBeInTheDocument();
    expect(screen.getByText("ThemedLogo")).toBeInTheDocument();

    // Verifica nombre y correo del usuario autenticado
    expect(screen.getByText("Carlos Salazar")).toBeInTheDocument();
    expect(screen.getByText("carlos@example.com")).toBeInTheDocument();

    // Verifica que el avatar esté presente por alt text
    expect(screen.getByAltText("Riley Carter")).toBeInTheDocument();
  });
});
