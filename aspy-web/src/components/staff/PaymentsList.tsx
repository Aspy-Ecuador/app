// FINAL
import { useNavigate, useLocation } from "react-router-dom";
import type { GridRowId } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
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
import { useState } from "react";

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
      resizable: false,
    },
    {
      field: "person",
      headerName: "Cliente",
      disableColumnMenu: true,
      flex: 3,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params.row.client.first_name} {params.row.client.last_name}
          </Typography>
        );
      },
      resizable: false,
    },
    {
      field: "creation_date",
      headerName: "Fecha de Emisión",
      disableColumnMenu: true,
      flex: 3,
      resizable: false,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params.row.creation_date.split(" ")[0]}
          </Typography>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total",
      disableColumnMenu: true,
      flex: 1,
      resizable: false,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        return (
          <Typography variant="body1">$ {params.row.service.price}</Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Verificar",
      flex: 2,
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
        >
          <VisibilityRoundedIcon />
        </Button>
      ),
    },
    {
      field: "status",
      headerName: "Estado de aprobación",
      disableColumnMenu: true,
      flex: 2,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {getStatusIcon(params.row.payment_status.payment_status_id)}
          </Typography>
        );
      },
    },
  ];

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Pagos"} />
        </Grid>
        <Grid size={12}>
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

const getStatusIcon = (status: number) => {
  switch (status) {
    case 1:
      return <CheckCircleRoundedIcon color="success" />;
    case 2:
      return <AccessTimeFilledRoundedIcon color="warning" />;
    case 3:
      return <CancelRoundedIcon color="error" />;
    default:
      return null;
  }
};
