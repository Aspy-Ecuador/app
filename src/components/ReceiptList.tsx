import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Receipt } from "@/types/Receipt";
import { GridColDef } from "@mui/x-data-grid";
import { handleDownloadInvoice } from "@utils/utils";
import { columnsReceipt } from "@utils/columns";
import { getAuthenticatedUserIdentity } from "@utils/store";
import { getReceipts } from "@utils/utils";
import Button from "@mui/material/Button";
import InvoiceView from "@components/InvoiceView";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";

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
  const receiptList: Receipt[] = getReceipts(getAuthenticatedUserIdentity());

  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  const theme = useTheme().palette.mode;
  const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  //Usuario seleccionado
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const newColumns: GridColDef[] = [...columnsReceipt, ...columnaExtra];

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedInvoice = receiptList.find(
        (item) => item.id === rowSelection[0]
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
        <Grid size={8} className={themeClass + " grid-tabla"}>
          <Table<Receipt>
            columns={newColumns}
            rows={receiptList}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {receipt && (
          <Grid size={4} className={themeClass}>
            <InvoiceView
              id={receipt.id}
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

{
  /*
    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
      <div style={{ flex: 2 }}>
        <Paper sx={{ height: "90vh", width: "100%", marginTop: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            autoPageSize
            sx={{ border: 0 }}
            slots={{ toolbar: GridToolbar }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableExport
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Paper>
      </div>
      <div style={{ flex: 1 }}>
        {rowSelectionModel
          .map((selectedId) => rows.find((item) => item.id === selectedId))
          .map(
            (invoice) =>
              invoice && <InvoiceView info={invoice} key={invoice.id} />
          )}
      </div>
    </div>
    */
}
