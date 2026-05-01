// FINAL
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridRowSelectionModel,
  GridRowId,
} from "@mui/x-data-grid";

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
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) => {
          const clickedId = [...newSelection.ids][0] ?? null;
          onRowSelect(
            String(clickedId) === String(selectedId) ? null : clickedId,
          );
        }}
        disableMultipleRowSelection
        checkboxSelection={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        sx={{
          border: "none",
          fontFamily: "inherit",
          fontSize: 13,

          /* ── Header ── */
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "background.default",
            borderBottom: "0.5px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeader": {
            bgcolor: "background.default",
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "text.secondary",
          },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-sortIcon": { fontSize: 14 },

          /* ── Filas ── */
          "& .MuiDataGrid-row": {
            borderBottom: "0.5px solid",
            borderColor: "divider",
            transition: "background 0.12s",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
            "&:last-child": { borderBottom: "none" },
          },
          "& .MuiDataGrid-row.Mui-selected": {
            bgcolor: "#E6F1FB",
            "&:hover": { bgcolor: "#daeaf8" },
            "& .MuiDataGrid-cell": { color: "#185FA5" },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: 13,
            color: "text.primary",
            "&:focus, &:focus-within": { outline: "none" },
          },

          /* ── Footer / paginación ── */
          "& .MuiDataGrid-footerContainer": {
            borderTop: "0.5px solid",
            borderColor: "divider",
            bgcolor: "background.default",
            minHeight: 44,
          },
          "& .MuiTablePagination-root": { fontSize: 12 },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { fontSize: 12, color: "text.secondary" },

          /* ── Sin datos ── */
          "& .MuiDataGrid-overlayWrapper": { minHeight: 160 },
        }}
      />
    </Paper>
  );
}
