import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CheckoutView from "../CheckoutView";

// Mocks de los componentes usados internamente
jest.mock("@components/PaymentForm", () => {
  return (props: { setIsValid: (val: boolean) => void }) => {
    props.setIsValid(true); // Simula un formulario válido
    return <div>Payment Form</div>;
  };
});

jest.mock("@components/Review", () => {
  return () => <div>Review Component</div>;
});

jest.mock("@components/Steps", () => {
  return ({ steps, activeStep }: { steps: string[]; activeStep: number }) => (
    <div>Steps: {steps[activeStep]}</div>
  );
});

jest.mock("@components/Success", () => {
  return ({
    open: _open,
    handleClose: _handleClose,
    card: _card,
  }: {
    open: boolean;
    handleClose: () => void;
    card: boolean;
  }) => <div>Success Modal</div>;
});

describe("CheckoutView", () => {
  it("renderiza y navega entre los pasos correctamente", () => {
    render(
      <MemoryRouter>
        <CheckoutView />
      </MemoryRouter>
    );

    // Paso inicial
    expect(screen.getByText("Pagar")).toBeInTheDocument();
    expect(screen.getByText("Payment Form")).toBeInTheDocument();
    expect(screen.getByText("Steps: Detalles de Pago")).toBeInTheDocument();

    // Avanza al paso 2 (Review)
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText("Review Component")).toBeInTheDocument();
    expect(screen.getByText("Steps: Revisar cita")).toBeInTheDocument();

    // Clic en "Finalizar"
    const finalizarButton = screen.getByRole("button", { name: /finalizar/i });
    fireEvent.click(finalizarButton);

    // Modal Successo debería mostrarse
    expect(screen.getByText("Success Modal")).toBeInTheDocument();
  });
});
