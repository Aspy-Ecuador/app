// FINAL
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { GridRowId } from "@mui/x-data-grid";

export type TableProps<T> = {
  columns: GridColDef[];
  rows: T[];
  getRowId: (row: T) => GridRowId;
  selectedId: GridRowId | null;
  onRowSelect: (id: GridRowId | null) => void;
};

export default function Table<T>({
  columns,
  rows,
  getRowId,
  selectedId,
  onRowSelect,
}: TableProps<T>) {
  const rowSelectionModel: GridRowSelectionModel = {
    type: "include",
    ids: new Set(selectedId !== null ? [selectedId] : []),
  };

  return (
    <Paper sx={{ height: "auto", width: "98%" }}>
      <DataGrid
        className="data-grid-custom"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          const clickedId = [...newSelection.ids][0] ?? null;
          // Toggle: click en la misma fila deselecciona
          onRowSelect(
            String(clickedId) === String(selectedId) ? null : clickedId,
          );
        }}
        disableMultipleRowSelection
        checkboxSelection={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </Paper>
  );
}
