import { useNavigate, useLocation } from "react-router-dom";
import { columnsServiceAdmin } from "@utils/columns";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Header from "@components/Header";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRoleData } from "@/observer/RoleDataContext";
import { useState } from "react";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";

export default function Services() {
  const { data } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

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

  const columnsExtra: GridColDef[] = [
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
          onClick={() => handleEdit(params.row.service_id)}
          variant="text"
          className="boton-editar"
        >
          <EditOutlinedIcon />
        </Button>
      ),
    },
  ];

  const newColumns: GridColDef[] = [...columnsServiceAdmin, ...columnsExtra];

  const services: ServiceResponse[] = data.services;

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

        <Grid size={12}>
          <Table<ServiceResponse>
            columns={newColumns}
            rows={services}
            getRowId={(row) => row.service_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
