import { render, screen } from "@testing-library/react";
import Steps from "../Steps";

describe("Steps component", () => {
  const steps = ["Paso 1", "Paso 2", "Paso 3", "Paso 4"];

  test("renders all steps", () => {
    render(<Steps activeStep={1} steps={steps} />);

    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  test("highlights the active step", () => {
    render(<Steps activeStep={2} steps={steps} />);

    const activeStepLabel = screen.getByText(steps[2]);

    // El Step activo tiene un ancestro con la clase Mui-active (puede ser un div)
    const activeStep = activeStepLabel.closest(".Mui-active");

    expect(activeStep).toBeInTheDocument();
  });
});
