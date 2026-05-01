import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Header from "@components/Header";
import Progress from "@components/Progress";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRoleData } from "@/observer/RoleDataContext";
import { useState } from "react";
import type { Service } from "@typesResponse/Service";

export default function Services() {
  const { data, loading } = useRoleData();
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const services: Service[] = data?.services ?? [];

  const handleEdit = (id: number) => {
    const newPath = `${location.pathname}/${id}`;
    navigate(newPath);
  };

  const handleCreate = () => {
    const newPath = `/crear-servicio`;
    navigate(newPath);
  };

  const columns: GridColDef[] = [
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
    {
      field: "price",
      headerName: "Costo",
      flex: 2,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => (
        <Typography variant="body1">$ {params.value}</Typography>
      ),
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
          {loading ? (
            <Progress />
          ) : (
            <Table<Service>
              columns={columns}
              rows={services}
              getRowId={(row) => row.service_id}
              selectedId={selectedId}
              onRowSelect={setSelectedId}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
