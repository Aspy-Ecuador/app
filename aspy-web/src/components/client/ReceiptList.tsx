// FINAL
import { useState } from "react";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import { getReceiptByUser, handleDownloadInvoice } from "@utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Button from "@mui/material/Button";
import InvoiceView from "@components/InvoiceView";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { getAuthenticatedUserID } from "@/utils/store";
import type { FlattenedReceipt } from "@/types/FlattenedReceipt";
import type { Payment } from "@/typesResponse/Payment";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "N° de Recibo",
    disableColumnMenu: true,
    renderCell: (params) => (
      <Typography variant="body1">{params.row.id}</Typography>
    ),
    flex: 2,
    resizable: false,
  },
  {
    field: "client",
    headerName: "Cliente",
    disableColumnMenu: true,
    renderCell: (params) => (
      <Typography variant="body1">{params.row.client}</Typography>
    ),
    flex: 3,
    resizable: false,
  },
  {
    field: "issueDate",
    headerName: "Fecha de Emisión",
    disableColumnMenu: true,
    renderCell: (params) => (
      <Typography variant="body1">{params.row.date}</Typography>
    ),
    flex: 3,
    resizable: false,
  },
  {
    field: "price",
    headerName: "Total",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
    renderCell: (params) => (
      <Typography variant="body1">$ {params.row.price}</Typography>
    ),
  },
  {
    field: "name",
    headerName: "Estado",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
    renderCell: (params) => (
      <Typography variant="body1">
        {params.row.receipt.receipt_status.name}
      </Typography>
    ),
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
        onClick={() => {
          handleDownloadInvoice(params.row);
          console.log(params.row);
        }}
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

  const payments: Payment[] = getReceiptByUser(data, getAuthenticatedUserID());

  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);

  const receipt =
    selectedId !== null
      ? (payments.find(
          (item) => String(item.payment_id) === String(selectedId),
        ) ?? null)
      : null;

  if (loading) return <Progress />;

  const flattenedRows: FlattenedReceipt[] = payments.map((r) => ({
    id: r.receipt.receipt_id,
    client_id: r.client.person_id,
    client: `${r.client.first_name} ${r.client.last_name}`,
    service: r.service.name,
    price: r.service.price,
    date: r.creation_date.split("T")[0],
    receipt: r.receipt,
  }));

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Comprobantes de Pago"} />
        </Grid>
        <Grid size={8}>
          <Table<FlattenedReceipt>
            columns={columns}
            rows={flattenedRows}
            getRowId={(row) => row.id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>
        {receipt && (
          <Grid size={4}>
            <InvoiceView
              id={receipt.receipt.receipt_id}
              date={receipt.payment_data.creation_date}
              client={`${receipt.client.first_name} ${receipt.client.last_name}`}
              service={receipt.service.name}
              price={receipt.service.price}
              total={receipt.service.price}
              paymentMethod={receipt.payment_data.type}
              client_id={receipt.client_id}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
