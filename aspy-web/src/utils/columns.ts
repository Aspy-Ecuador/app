import { GridColDef } from "@mui/x-data-grid";

export const columnsServiceAdmin: GridColDef[] = [
  {
    field: "service_id",
    headerName: "ID",
    flex: 1,
    disableColumnMenu: true,
    resizable: false,
  },
  {
    field: "name",
    headerName: "Nombre",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
  },
  /*
  {
    field: "description",
    headerName: "Descripción",
    flex: 3,
    disableColumnMenu: true,
    resizable: false,
  },
  {
    field: "serviceType",
    headerName: "Tipo",
    flex: 3,
    disableColumnMenu: true,
    resizable: false,
  },
  {
    field: "active",
    headerName: "Activo",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
    renderCell: (params) => (params.value ? "Sí" : "No"),
  },
  {
    field: "updated_on",
    headerName: "Últ. Act.",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
    valueFormatter: (params) => new Date(params).toLocaleDateString("es-ES"),
  },
  */
];

export const columnsProfessional: GridColDef[] = [
  /* {
    field: "identity",
    headerName: "Cédula",
    disableColumnMenu: true,
    width: 140,
    resizable: false,
  }, */
  {
    field: "first_name",
    headerName: "Nombres",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "last_name",
    headerName: "Apellidos",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "title",
    headerName: "Título",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "specialty",
    headerName: "Especialidad",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
];

export const columnsServices: GridColDef[] = [
  /* {
    field: "id",
    headerName: "ID",
    flex: 1,
    disableColumnMenu: true,
    resizable: false,
  }, */
  {
    field: "name",
    headerName: "Nombre",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
  },
  {
    field: "description",
    headerName: "Descripción",
    flex: 3,
    disableColumnMenu: true,
    resizable: false,
  },
  /* {
    field: "serviceType",
    headerName: "Tipo",
    flex: 3,
    disableColumnMenu: true,
    resizable: false,
  }, */
];
