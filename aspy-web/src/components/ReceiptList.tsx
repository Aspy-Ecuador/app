import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Receipt } from "@/types/Receipt";
import { GridColDef } from "@mui/x-data-grid";
import { handleDownloadInvoice } from "@utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Button from "@mui/material/Button";
import InvoiceView from "@components/InvoiceView";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { userAdapter } from "@/adapters/userAdapter";
import { receiptAdapter } from "@/adapters/receiptAdapter";
import { ReceiptResponse } from "@/typesResponse/ReceiptResponse";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID Recibo",
    disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <Typography variant="body1">{params.row.receipt.receipt_id}</Typography>
      );
    },
    flex: 2,
    resizable: false,
  },
  {
    field: "client",
    headerName: "Cliente",
    disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <Typography variant="body1">{params.row.client.full_name}</Typography>
      );
    },
    flex: 3,
    resizable: false,
  },
  {
    field: "issueDate",
    headerName: "Fecha de Emisión",
    disableColumnMenu: true,
    renderCell: (params) => {
      return <Typography variant="body1">{params.row.date}</Typography>;
    },
    flex: 3,
    resizable: false,
  },
  {
    field: "price",
    headerName: "Total",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
    renderCell: (params) => {
      return (
        <Typography variant="body1">$ {params.row.service.price}</Typography>
      );
    },
  },
  {
    field: "actions",
    headerName: "",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
    sortable: false,
    renderCell: (params) => (
      <Button
        onClick={() => handleDownloadInvoice(params.row)}
        variant="text"
        color="primary"
        className="boton-editar"
      >
        <DownloadRoundedIcon />
      </Button>
    ),
  },
];

export default function ReceiptList() {
  const { data, loading } = useRoleData();

  //Solo por ejemplo:
  const dataPayments: PaymentResponse[] = [
    {
      payment_id: 16,
      person_id: 7,
      service_id: 2,
      discount_id: null,
      payment_data_id: 18,
      service_price: 12.0,
      discount_percentage: null,
      total_amount: 12.0,
      status: 1,
      created_by: "system",
      modified_by: null,
      creation_date: "2025-07-30 22:10:10",
      modification_date: null,
    },
    {
      payment_id: 17,
      person_id: 7,
      service_id: 3,
      discount_id: null,
      payment_data_id: 19,
      service_price: 34.0,
      discount_percentage: null,
      total_amount: 34.0,
      status: 1,
      created_by: "system",
      modified_by: null,
      creation_date: "2025-07-31 18:21:12",
      modification_date: null,
    },
    {
      payment_id: 18,
      person_id: 7,
      service_id: 1,
      discount_id: 2,
      payment_data_id: 18,
      service_price: 50.0,
      discount_percentage: 10,
      total_amount: 45.0,
      status: 1,
      created_by: "admin",
      modified_by: "admin",
      creation_date: "2025-08-01 10:15:00",
      modification_date: "2025-08-01 12:00:00",
    },
  ];

  const receiptsRaw: ReceiptResponse[] = data?.receipts ?? [];

  const receiptList: Receipt[] = receiptsRaw
    .map((receipt) => {
      const payment = dataPayments?.find(
        (p: any) => p.payment_id === receipt.payment_id
      );
      if (!payment) return null;

      const paymentData = data.paymentData?.find(
        (pd: any) => pd.payment_data_id === payment.payment_data_id
      );
      const service = data.services?.find(
        (s: any) => s.service_id === payment.service_id
      );
      const person = data.persons?.find(
        (p: any) => p.person_id === payment.person_id
      );
      const userAccount = data.userAccounts?.find(
        (ua: any) => ua.user_id === person?.user_id
      );
      const role = data.roles?.find(
        (r: any) => r.role_id === userAccount?.role_id
      );

      if (!paymentData || !service || !person || !userAccount || !role)
        return null;

      const client = userAdapter(person, role, userAccount);

      return receiptAdapter(receipt, paymentData, service, client);
    })
    .filter(Boolean) as Receipt[];

  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedInvoice = receiptList.find(
        (item) => item.receipt.receipt_id === rowSelection[0]
      );
      if (selectedInvoice) {
        setReceipt(selectedInvoice);
      }
    } else {
      setReceipt(null);
    }
  }, [rowSelection]);

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Comprobantes de Pago"} />
        </Grid>
        <Grid size={8}>
          <Table<Receipt>
            columns={columns}
            rows={receiptList}
            getRowId={(row) => row.receipt.receipt_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {receipt && (
          <Grid size={4}>
            <InvoiceView
              id={receipt.receipt.receipt_id}
              date={receipt.payment_data.creation_date}
              client={receipt.client.full_name}
              service={receipt.service.name}
              //address={receipt.addres}
              price={receipt.service.price}
              //discount={receipt.discount_percentage}
              total={receipt.service.price}
              paymentMethod={receipt.payment_data.type}
              //contactEmail={receipt.contactEmail}
              //contactPhone={receipt.contactPhone}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
