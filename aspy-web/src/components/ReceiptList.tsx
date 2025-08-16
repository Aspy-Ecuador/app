import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Receipt } from "@/types/Receipt";
import { GridColDef } from "@mui/x-data-grid";
import { getReceipt, handleDownloadInvoice } from "@utils/utils";
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
import { FlattenedReceipt } from "@/types/FlattenedReceipt";

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
    field: "actions",
    headerName: "",
    flex: 2,
    disableColumnMenu: true,
    resizable: false,
    sortable: false,
    renderCell: (params) => (
      <Button
        onClick={() => handleDownloadInvoice(params.row.receipt)}
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

  const receiptList: Receipt[] = getReceipt(data);

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

  const flattenedRows: FlattenedReceipt[] = receiptList.map((r) => ({
    id: r.receipt.receipt_id,
    client: r.client.full_name,
    service: r.service.name,
    price: r.service.price,
    date: r.date,
    receipt: r,
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
            getRowId={(row) => row.receipt.receipt.receipt_id}
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
