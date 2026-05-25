import { useState } from "react";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import { handleDownloadInvoice } from "@utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import InvoiceView from "@components/InvoiceView";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import type { FlattenedReceipt } from "@/types/FlattenedReceipt";
import type { Payment } from "@/typesResponse/Payment";

// Función de estilos para los chips de estado
const statusChipSx = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "pagado" || s === "paid")
    return { bgcolor: "#E1F5EE", color: "#0F6E56", border: "0.5px solid #9FE1CB" };
  if (s === "pendiente" || s === "pending")
    return { bgcolor: "#fafbe6", color: "#b9b716", border: "0.5px solid #e5e77a" };
  if (s === "anulado" || s === "cancelled")
    return { bgcolor: "#FEE2E2", color: "#991B1B", border: "0.5px solid #FCA5A5" };
  return { bgcolor: "#EEEDFE", color: "#534AB7", border: "0.5px solid #AFA9EC" };
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "N° de Recibo",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 110,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          #{params.row.id}
        </Typography>
      </Box>
    ),
  },
  {
    field: "client",
    headerName: "Cliente",
    disableColumnMenu: true,
    flex: 3,
    minWidth: 140,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.client}</Typography>
      </Box>
    ),
  },
  {
    field: "issueDate",
    headerName: "Fecha de Emisión",
    disableColumnMenu: true,
    flex: 3,
    minWidth: 130,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.date}</Typography>
      </Box>
    ),
  },
  {
    field: "price",
    headerName: "Total",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 90,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1" sx={{ color: "#0F6E56", fontWeight: 600 }}>
          ${Number(params.row.price).toFixed(2)}
        </Typography>
      </Box>
    ),
  },
  {
    field: "name",
    headerName: "Estado",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 110,
    resizable: false,
    renderCell: (params) => {
      const status = params.row.receipt.receipt_status.name;
      return (
        <Box display="flex" alignItems="center" height="100%">
          <Chip
            label={status}
            size="small"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              height: 20,
              "& .MuiChip-label": { px: 1 },
              ...statusChipSx(status),
            }}
          />
        </Box>
      );
    },
  },
  {
    field: "actions",
    headerName: "Descargar",
    flex: 2,
    minWidth: 80,
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
        sx={{
          minWidth: 0,
          p: 0.75,
          borderRadius: 2,
          "&:hover": { bgcolor: "#E6F1FB" },
        }}
      >
        <DownloadRoundedIcon fontSize="small" />
      </Button>
    ),
  },
];

export default function ReceiptList() {
  const { data, loading } = useRoleData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Lógica original conservada para cargar todos los pagos
  const payments: Payment[] = data.payments ?? [];
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);

  const receipt =
    selectedId !== null
      ? (payments.find(
          (item) => String(item.payment_id) === String(selectedId),
        ) ?? null)
      : null;

  if (loading) return <Progress />;

  const flattenedRows: FlattenedReceipt[] = payments
    .filter((r) => r.receipt !== null)
    .map((r) => ({
      id: r.receipt.receipt_id,
      client_id: r.client.person_id,
      client: `${r.client.first_name} ${r.client.last_name}`,
      service: r.service.name,
      price: r.service.price,
      date: r.creation_date.split("T")[0],
      receipt: r.receipt,
    }));

  const invoicePanel = receipt && (
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
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Comprobantes de Pago"} chip="Pagos" />
        </Grid>

        {/* Tabla: Diseño responsive con overflow y grid dinámico */}
        <Grid size={{ xs: 12, md: receipt && !isMobile ? 8 : 12 }} sx={{ overflowX: "auto" }}>
          <Table<FlattenedReceipt>
            columns={columns}
            rows={flattenedRows}
            getRowId={(row) => row.id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>

        {/* Panel lateral — solo desktop */}
        {receipt && !isMobile && (
          <Grid size={{ md: 4 }}>
            {invoicePanel}
          </Grid>
        )}
      </Grid>

      {/* Drawer — solo móvil/tablet con el fondo difuminado premium */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={Boolean(receipt)}
          onClose={() => setSelectedId(null)}
          slotProps={{
            backdrop: {
              sx: { backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.2)" },
            },
          }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              p: 2,
              maxHeight: "85vh",
              boxShadow: "0px -4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "action.disabled",
              borderRadius: 2,
              mx: "auto",
              mb: 2,
            }}
          />
          {invoicePanel}
        </Drawer>
      )}
    </Box>
  );
}