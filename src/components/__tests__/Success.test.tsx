import { render, screen, fireEvent } from "@testing-library/react";
jest.mock("@assets/visto.png", () => "test-file-stub"); // Mockea la importación de la imagen visto.png para que Jest no intente procesar el archivo real durante las pruebas
jest.mock("@assets/cita.png", () => "test-file-stub"); 
import Success from "../Success";

describe("Successo component", () => {
  const handleClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders success message for card=true", () => {
    render(<Success open={true} handleClose={handleClose} isRegister={true} message="Cita agendada con éxito" />);
    
    expect(screen.getByAltText("Success")).toBeInTheDocument();
    expect(screen.getByText("Cita agendada con éxito")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /aceptar/i })).toBeInTheDocument();
  });

  test("renders success message for card=false", () => {
    render(<Success open={true} handleClose={handleClose} isRegister={false} message="Todo mal" />);
    
    expect(screen.getByText("Todo mal")).toBeInTheDocument();
  });

  test("does not render dialog when open is false", () => {
    render(<Success open={false} handleClose={handleClose} isRegister={true} message="Cita agendada con éxito" />);
    
    expect(screen.queryByText("Cita agendada con éxito")).not.toBeInTheDocument();
  });

  test("calls handleClose when clicking Aceptar button", () => {
    render(<Success open={true} handleClose={handleClose} isRegister={true} message="Todo bien" />);
    
    const button = screen.getByRole("button", { name: /aceptar/i });
    fireEvent.click(button);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
