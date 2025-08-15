import { useRoleData } from "@/observer/RoleDataContext";
import { useState } from "react";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@components/Table";
import SimpleHeader from "@components/SimpleHeader";

export default function ServicesList() {
  const { data } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

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
      renderCell: (params) => {
        return <Typography variant="body1">$ {params.value}</Typography>;
      },
    },
  ];

  const services: ServiceResponse[] = data.services;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Consultar servicios" />
        </Grid>

        <Grid size={12}>
          <Table<ServiceResponse>
            columns={columns}
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
