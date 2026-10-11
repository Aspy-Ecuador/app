// FINAL
import { useRoleData } from "@/observer/RoleDataContext";
import { useMemo, useState } from "react";
import type { Service } from "@typesResponse/Service";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@components/Table";
import SimpleHeader from "@components/SimpleHeader";
import { tone } from "@shared-theme/themePrimitives";
import BarraFiltros from "@components/tabla/BarraFiltros";
import { coincide, useFiltros } from "@components/tabla/filtros";

const SIN_FILTROS = { buscar: "" };

export default function ServicesList() {
  const { data } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowId | null>(null);
  const { valores: filtros, cambiar, limpiar, hayFiltros } = useFiltros(SIN_FILTROS);

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
                color: tone.green.fg,
              }}
            >
              ${Number(params.value).toFixed(2)}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const services: Service[] = useMemo(() => (data?.services ?? []).filter((s: Service) => s.is_available), [data?.services]);
  const filtrados = useMemo(() => services.filter((s) => coincide(filtros.buscar, s.name, `#${s.service_id}`)), [services, filtros]);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Consultar servicios" chip="Servicios" />
        </Grid>

        <Grid size={12}>
          <BarraFiltros
            id="servicios"
            busqueda={{ value: filtros.buscar, onChange: (v) => cambiar("buscar", v), placeholder: "Nombre del servicio" }}
            total={services.length}
            mostrados={filtrados.length}
            que={["servicio", "servicios"]}
            hayFiltros={hayFiltros}
            onLimpiar={limpiar}
          />
        </Grid>

        <Grid size={12}>
          <Table<Service>
            columns={columns}
            rows={filtrados}
            getRowId={(row) => row.service_id}
            selectedId={rowSelection}
            onRowSelect={setRowSelection}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
