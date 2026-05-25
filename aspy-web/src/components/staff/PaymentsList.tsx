// FINAL
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip"; // Añadido para mejor UX en los iconos
import Table from "@components/Table";
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

export default function PaymentsList() {
  const { data, loading } = useRoleData();
  const payments: Payment[] = data.payments ?? [];
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);

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
              {params.row.creation_date.split("T")[0]}
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
            <Typography variant="body1" sx={{ color: "#0F6E56", fontWeight: 600 }}>
              ${Number(params.row.service.price).toFixed(2)}
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
            "&:hover": { bgcolor: "#E6F1FB" }, // Hover premium coordinado
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
        
        {/* Contenedor de la tabla adaptado para scroll horizontal en móviles */}
        <Grid size={12} sx={{ overflowX: "auto" }}>
          <Table<Payment>
            columns={columns}
            rows={payments}
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
          <CheckCircleRoundedIcon sx={{ color: "#0F6E56" }} />
        </Tooltip>
      );
    case 2:
      return (
        <Tooltip title="Pendiente" arrow>
          <AccessTimeFilledRoundedIcon sx={{ color: "#b9b716" }} />
        </Tooltip>
      );
    case 3:
      return (
        <Tooltip title="Rechazado/Anulado" arrow>
          <CancelRoundedIcon sx={{ color: "#991B1B" }} />
        </Tooltip>
      );
    default:
      return null;
  }
};