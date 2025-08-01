import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { ReceiptResponse } from "@/types/ReceiptResponse";
import { GridColDef } from "@mui/x-data-grid";
import { handleDownloadInvoice } from "@utils/utils";
import { columnsReceipt } from "@utils/columns";
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

const columnaExtra: GridColDef[] = [
  {
    field: "total",
    headerName: "Total",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
    renderCell: (params) => {
      return <Typography variant="body1">$ {params.value}</Typography>;
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

  if (loading) return <Progress />;

  const receiptList: ReceiptResponse[] = data.receipts;

  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Usuario seleccionado
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);

  const newColumns: GridColDef[] = [...columnsReceipt, ...columnaExtra];

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedInvoice = receiptList.find(
        (item) => item.receipt_id === rowSelection[0]
      );
      if (selectedInvoice) {
        setReceipt(selectedInvoice);
      }
    } else {
      setReceipt(null);
    }
  }, [rowSelection, receiptList]);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Comprobantes de Pago"} />
        </Grid>
        <Grid size={8}>
          <Table<ReceiptResponse>
            columns={newColumns}
            rows={receiptList}
            getRowId={(row) => row.receipt_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {receipt && (
          <Grid size={4}>
            <InvoiceView
              id={receipt.receipt_id}
              date={receipt.issueDate}
              client={receipt.clientName}
              service={receipt.serviceName}
              address={receipt.address}
              price={receipt.servicePrice}
              discount={receipt.discount_percentage}
              total={receipt.total}
              paymentMethod={receipt.paymentMethod}
              contactEmail={receipt.contactEmail}
              contactPhone={receipt.contactPhone}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
