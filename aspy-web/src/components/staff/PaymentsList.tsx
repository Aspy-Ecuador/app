import { useNavigate, useLocation } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import { GridColDef } from "@mui/x-data-grid";
//import { dataPayments } from "@data/Payment";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useRoleData } from "@/observer/RoleDataContext";
import { getPaymentsPending } from "@/utils/utils";
import Progress from "../Progress";

export default function PaymentsList() {
  const rowSelection: GridRowSelectionModel = [];
  const { data, loading } = useRoleData();
  const dataPayments: PaymentResponse[] = getPaymentsPending(data);

  //Ruta para aprobar
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
            {params.row.person.first_name} {params.row.person.last_name}
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
        return <Typography variant="body1">$ {params.value}</Typography>;
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
            {getStatusIcon(params.row.status.status_id)}
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
          <Table<PaymentResponse>
            columns={columns}
            getRowId={(row) => row.payment_id}
            rows={dataPayments}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

const getStatusIcon = (status: number) => {
  switch (status) {
    case 1:
      return <AccessTimeFilledRoundedIcon color="warning" />;
    case 2:
      return <CheckCircleRoundedIcon color="success" />;
    case 3:
      return <CancelRoundedIcon color="error" />;
    default:
      return null;
  }
};
