import { render, screen, fireEvent } from "@testing-library/react";
import ButtonList from "../ButtonList";
import { ButtonControl } from "@/types/ButtonControl";


describe("ButtonList", () => {
  const mockAccion1 = jest.fn();
  const mockAccion2 = jest.fn();

  const botones: ButtonControl[] = [
    { text: "Botón 1", accion: mockAccion1, icon: <span>Icon1</span> },
    { text: "Botón 2", accion: mockAccion2, icon: <span>Icon2</span> },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza la lista con los botones", () => {
    render(<ButtonList botones={botones} />);

    // Verifica que los textos estén en pantalla
    expect(screen.getByText("Botón 1")).toBeInTheDocument();
    expect(screen.getByText("Botón 2")).toBeInTheDocument();

    // Verifica que los íconos estén
    expect(screen.getByText("Icon1")).toBeInTheDocument();
    expect(screen.getByText("Icon2")).toBeInTheDocument();
  });

  it("ejecuta la acción al hacer clic en el botón", () => {
    render(<ButtonList botones={botones} />);

    const boton1 = screen.getByText("Botón 1");
    const boton2 = screen.getByText("Botón 2");

    fireEvent.click(boton1);
    expect(mockAccion1).toHaveBeenCalledTimes(1);

    fireEvent.click(boton2);
    expect(mockAccion2).toHaveBeenCalledTimes(1);
  });
});
