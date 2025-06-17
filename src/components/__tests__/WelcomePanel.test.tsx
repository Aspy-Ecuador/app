import { render, screen } from "@testing-library/react";
import WelcomePanel from "../WelcomePanel";

describe("WelcomePanel component", () => {
  test("renders welcome message with user name", () => {
    const userName = "Carlos";

    render(<WelcomePanel user={userName} />);

    // Verifica el texto fijo
    expect(screen.getByText(/Bienvenid@ al Panel de Control, ASPY/i)).toBeInTheDocument();

    // Verifica que el nombre del usuario esté presente
    expect(screen.getByText(userName)).toBeInTheDocument();
  });
});
