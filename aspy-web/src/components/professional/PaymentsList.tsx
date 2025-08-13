import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import { GridColDef } from "@mui/x-data-grid";
import { dataPayments } from "@data/Payment";
import InvoiceView from "@components/InvoiceView";
import Table from "@components/Table";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

export default function PaymentsList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  const [payment, setPayment] = useState<PaymentResponse | null>(null);

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
          <Typography variant="body1">{params.row.person.full_name}</Typography>
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
      field: "status",
      headerName: "Estado de aprobación",
      disableColumnMenu: true,
      flex: 2,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getStatusIcon(params.value),
    },
  ];

  //Mostrar la factura
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedInvoice = dataPayments.find(
        (item) => item.payment_id === rowSelection[0]
      );
      if (selectedInvoice) {
        setPayment(selectedInvoice);
      }
    } else {
      setPayment(null);
    }
  }, [rowSelection]);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9} marginBottom={"4px"}>
              <Typography variant="h3">Pagos</Typography>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={8}>
          <Table<PaymentResponse>
            columns={columns}
            rows={dataPayments}
            getRowId={(row) => row.payment_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {payment && (
          <Grid size={4}>
            <InvoiceView
              id={payment.payment_id}
              date={payment.creation_date}
              client={payment.person.full_name}
              service={payment.service.name}
              //address={receipt.addres}
              price={payment.service.price}
              //discount={receipt.discount_percentage}
              total={payment.service.price}
              paymentMethod={payment.paymenta_data.type}
              //contactEmail={receipt.contactEmail}
              //contactPhone={receipt.contactPhone}
            />
          </Grid>
        )}
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
