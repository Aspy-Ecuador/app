// FINAL
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip"; // Añadido para mejor UX en los iconos
import Table from "@components/Table";
import { fechaLocal, montoPago } from "@utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "../Progress";
import type { Payment } from "@/typesResponse/Payment";
import { tone } from "@shared-theme/themePrimitives";
import BarraFiltros from "@components/tabla/BarraFiltros";
import { coincide, enPeriodo, useFiltros } from "@components/tabla/filtros";

const SIN_FILTROS = { buscar: "", estado: "", desde: "", hasta: "" };

// Estados de pago (ids fijos: 1 Aprobado, 2 Pendiente, 3 Rechazado)
const ESTADOS_DE_PAGO = [
  { value: "2", texto: "Pendiente" },
  { value: "1", texto: "Aprobado" },
  { value: "3", texto: "Rechazado" },
];

export default function PaymentsList() {
  const { data, loading } = useRoleData();
  const payments: Payment[] = useMemo(() => data.payments ?? [], [data.payments]);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { valores: filtros, cambiar, limpiar, hayFiltros } = useFiltros(SIN_FILTROS);

  const filtrados = useMemo(
    () =>
      payments.filter(
        (p) =>
          coincide(filtros.buscar, p.client?.first_name, p.client?.last_name, `#${p.payment_id}`, p.service?.name) &&
          (filtros.estado === "" || String(p.payment_status?.payment_status_id) === filtros.estado) &&
          enPeriodo(p.creation_date, filtros.desde, filtros.hasta),
      ),
    [payments, filtros],
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleApprove = (id: number) => {
    const newPath = `${location.pathname}/${id}`;
    navigate(newPath);
  };

  const columns: GridColDef[] = [
    {
      field: "payment_id",
      headerName: "N° de Pago",
      disableColumnMenu: true,
      flex: 2,
      minWidth: 110,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            #{params.row.payment_id}
          </Typography>
        </Box>
      ),
    },
    {
      field: "person",
      headerName: "Cliente",
      disableColumnMenu: true,
      flex: 3,
      minWidth: 150,
      resizable: false,
      renderCell: (params) => {
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body1">
              {params.row.client.first_name} {params.row.client.last_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "creation_date",
      headerName: "Fecha de Emisión",
      disableColumnMenu: true,
      flex: 3,
      minWidth: 140,
      resizable: false,
      renderCell: (params) => {
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body1">
              {fechaLocal(params.row.creation_date)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total",
      disableColumnMenu: true,
      flex: 1,
      minWidth: 100,
      resizable: false,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        return (
          <Box display="flex" alignItems="center" height="100%">
            {/* Manteniendo la consistencia financiera visual de los comprobantes */}
            <Typography variant="body1" sx={{ color: tone.green.fg, fontWeight: 600 }}>
              ${montoPago(params.row).toFixed(2)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Verificar",
      flex: 2,
      minWidth: 100,
      disableColumnMenu: true,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          onClick={() => handleApprove(params.row.payment_id)}
          variant="text"
          color="primary"
          className="boton-editar"
          sx={{
            minWidth: 0,
            p: 0.75,
            borderRadius: 2,
            "&:hover": { bgcolor: tone.blue.bg }, // Hover premium coordinado
          }}
        >
          <VisibilityRoundedIcon fontSize="small" />
        </Button>
      ),
    },
    {
      field: "status",
      headerName: "Aprobación",
      disableColumnMenu: true,
      flex: 2,
      minWidth: 120,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            width="100%"
          >
            {getStatusIcon(params.row.payment_status.payment_status_id)}
          </Box>
        );
      },
    },
  ];

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Lista de pagos"} chip="Pagos" />
        </Grid>

        <Grid size={12}>
          <BarraFiltros
            id="pagos"
            busqueda={{ value: filtros.buscar, onChange: (v) => cambiar("buscar", v), placeholder: "Nombre del cliente, n.° de pago o servicio" }}
            listas={[{ id: "estado", etiqueta: "Aprobación", value: filtros.estado, onChange: (v) => cambiar("estado", v), opciones: ESTADOS_DE_PAGO }]}
            periodo={{
              desde: filtros.desde,
              hasta: filtros.hasta,
              onChange: (desde, hasta) => {
                cambiar("desde", desde);
                cambiar("hasta", hasta);
              },
              etiqueta: "Emisión",
            }}
            total={payments.length}
            mostrados={filtrados.length}
            que={["pago", "pagos"]}
            hayFiltros={hayFiltros}
            onLimpiar={limpiar}
          />
        </Grid>

        {/* Contenedor de la tabla adaptado para scroll horizontal en móviles */}
        <Grid size={12} sx={{ overflowX: "auto" }}>
          <Table<Payment>
            columns={columns}
            rows={filtrados}
            getRowId={(row) => row.payment_id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// Lógica de iconos envuelta en Tooltips para una mejor UX
const getStatusIcon = (status: number) => {
  switch (status) {
    case 1:
      return (
        <Tooltip title="Aprobado" arrow>
          <CheckCircleRoundedIcon sx={{ color: tone.green.fg }} />
        </Tooltip>
      );
    case 2:
      return (
        <Tooltip title="Pendiente" arrow>
          <AccessTimeFilledRoundedIcon sx={{ color: tone.yellow.fg }} />
        </Tooltip>
      );
    case 3:
      return (
        <Tooltip title="Rechazado/Anulado" arrow>
          <CancelRoundedIcon sx={{ color: tone.red.fg }} />
        </Tooltip>
      );
    default:
      return null;
  }
};