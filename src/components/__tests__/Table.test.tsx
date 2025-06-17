import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../Table";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

type RowData = { id: number; name: string };

describe("Table component", () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
  ];

  const rows: RowData[] = [
    { id: 1, name: "Carlos" },
    { id: 2, name: "Ana" },
  ];

  let rowSelectionModel: GridRowSelectionModel = [];

  const handleRowSelectionChange = jest.fn((newSelection: GridRowSelectionModel) => {
    rowSelectionModel = newSelection;
  });

  test("renders all rows and columns", () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionChange={handleRowSelectionChange}
      />
    );

    // Verifica que las cabeceras de columna estén en el documento
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();

    // Verifica que las filas con los nombres estén visibles
    expect(screen.getByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  test("calls onRowSelectionChange when selecting a row", () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionChange={handleRowSelectionChange}
      />
    );

    // Simula selección de fila (en DataGrid es más complicado, pero podemos simular click en checkbox)
    const firstCheckbox = screen.getAllByRole("checkbox")[1]; // El primero es select all
    fireEvent.click(firstCheckbox);

    expect(handleRowSelectionChange).toHaveBeenCalled();
  });
});
