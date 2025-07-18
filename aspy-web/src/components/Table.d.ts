import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
export type TableProps<T> = {
    columns: GridColDef[];
    rows: T[];
    rowSelectionModel: GridRowSelectionModel;
    onRowSelectionChange: (newSelection: GridRowSelectionModel) => void;
};
export default function Table<T>({ columns, rows, rowSelectionModel, onRowSelectionChange, }: TableProps<T>): import("react/jsx-runtime").JSX.Element;
