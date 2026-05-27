// FINAL
import { useRoleData } from "@/observer/RoleDataContext";
import { useState } from "react";
import type { Service } from "@typesResponse/Service";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@components/Table";
import SimpleHeader from "@components/SimpleHeader";

export default function ServicesList() {
  const { data } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowId | null>(null);

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
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography
              variant="body1"
              sx={{
                color: "#0F6E56",
              }}
            >
              ${Number(params.value).toFixed(2)}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const services: Service[] = (data?.services ?? []).filter(
    (s: Service) => s.is_available,
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Consultar servicios" chip="Servicios" />
        </Grid>

        <Grid size={12}>
          <Table<Service>
            columns={columns}
            rows={services}
            getRowId={(row) => row.service_id}
            selectedId={rowSelection}
            onRowSelect={setRowSelection}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
