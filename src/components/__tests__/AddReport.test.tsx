import { render, screen } from "@testing-library/react";
import AddReport from "../professional/AddReport";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

describe("AddReport component", () => {
  test("renders correctly and allows uploading a file and writing a comment", () => {
    render(<MemoryRouter>
      <AddReport />
    </MemoryRouter>);
    // Check for titles
    expect(screen.getByText("Firma del profesional")).toBeInTheDocument();
  });
});
