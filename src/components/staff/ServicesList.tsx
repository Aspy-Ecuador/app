import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { servicesList } from "@data/Servicios";
import { columnsServices } from "@utils/columns";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Header from "@components/Header";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function Services() {
  const rowSelection: GridRowSelectionModel = [];

  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  //Ruta para editar y crear
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = (id: number) => {
    const newPath = `${location.pathname}/${id}`;
    navigate(newPath);
  };

  const handleCreate = () => {
    const newPath = `/crear-servicio`;
    navigate(newPath);
  };

  const columnasExtra: GridColDef[] = [
    {
      field: "price",
      headerName: "Costo",
      flex: 2,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => {
        return <Typography variant="body1">$ {params.value}</Typography>;
      },
    },
    {
      field: "durationMinutes",
      headerName: "Duración",
      flex: 2,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => {
        return <Typography variant="body1">{params.value} min</Typography>;
      },
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
    {
      field: "acciones",
      headerName: "",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row.id)}
          variant="text"
          className="boton-editar"
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
  ];

  const newColumns: GridColDef[] = [...columnsServices, ...columnasExtra];

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Servicios"}
            isCreate={true}
            textIcon={"Agregar Servicio"}
            handle={handleCreate}
          />
        </Grid>

        <Grid size={12} className={themeClass + " grid-tabla"}>
          <Table
            columns={newColumns}
            rows={servicesList}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
