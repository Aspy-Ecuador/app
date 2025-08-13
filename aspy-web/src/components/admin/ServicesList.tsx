import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { columnsServiceAdmin } from "@utils/columns";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { useRoleData } from "@/observer/RoleDataContext";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Progress from "@components/Progress";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function ServicesList() {
  const { data, loading  } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Ruta para editar y crear
  const navigate = useNavigate();
  const location = useLocation();

  const services: ServiceResponse[] = data?.services ?? [];

  const handleEdit = (id: number) => {
    const newPath = `${location.pathname}/${id}`;
    navigate(newPath);
  };

  const handleCreate = () => {
    const newPath = `/nuevo-servicio`;
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

 

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Lista de Servicios"} />
        </Grid>

        <Grid size={12}>
          <Stack direction="row" spacing={2}>
            <IconButton size="large" className="botones-admin">
              <AssignmentTurnedInRoundedIcon fontSize="inherit" />
              <Grid container sx={{ marginLeft: 2 }}>
                <Grid size={12}>
                  <Typography variant="body1" className="typo-tittle-boton">
                    Total Servicios
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" className="typo-number-boton">
                    {services.length}
                  </Typography>
                </Grid>
              </Grid>
            </IconButton>
            <IconButton
              size="large"
              className="botones-admin"
              onClick={handleCreate}
            >
              <AddCircleOutlineOutlinedIcon fontSize="inherit" />
              <Typography
                variant="body1"
                className="typo-tittle-boton"
                sx={{ marginLeft: 2 }}
              >
                Agregar Servicio
              </Typography>
            </IconButton>
          </Stack>
        </Grid>

        <Grid size={12}>
           {loading ? (
              <Progress /> 
            ) : (
          <Table<ServiceResponse>
            columns={newColumns}
            rows={services}
            getRowId={(row) => row.service_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
            )}
        </Grid>
      </Grid>
    </Box>
  );
}
