// FINAL
import { useMemo, useState } from "react";
import type { GridRowId, GridColDef } from "@mui/x-data-grid";
import { fechaLocal, getReceiptByUser, handleDownloadInvoice, montoPago } from "@utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import { getAuthenticatedUserID } from "@/utils/store";
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
import { tone } from "@shared-theme/themePrimitives";
import { vh } from "@shared-theme/pantallaGrande";
import BarraFiltros from "@components/tabla/BarraFiltros";
import { coincide, enPeriodo, useFiltros } from "@components/tabla/filtros";
import PagosRechazados from "@client/PagosRechazados";

const statusChipSx = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "pagado" || s === "paid")
    return { bgcolor: tone.green.bg, color: tone.green.fg, border: `0.5px solid ${tone.green.border}` };
  if (s === "pendiente" || s === "pending")
    return { bgcolor: tone.yellow.bg, color: tone.yellow.fg, border: `0.5px solid ${tone.yellow.border}` };
  if (s === "anulado" || s === "cancelled")
    return { bgcolor: tone.red.bg, color: tone.red.fg, border: `0.5px solid ${tone.red.border}` };
  return { bgcolor: tone.purple.bg, color: tone.purple.fg, border: `0.5px solid ${tone.purple.border}` };
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
        <Typography variant="body1" sx={{ color: tone.green.fg, fontWeight: 600 }}>
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
          "&:hover": { bgcolor: tone.blue.bg },
        }}
      >
        <DownloadRoundedIcon fontSize="small" />
      </Button>
    ),
  },
];

const SIN_FILTROS = { buscar: "", estado: "", desde: "", hasta: "" };

// Estados de recibo (ids fijos: 1 Generado, 2 Pendiente)
const ESTADOS_DE_RECIBO = [
  { value: "1", texto: "Generado" },
  { value: "2", texto: "Pendiente" },
];

export default function ReceiptList() {
  const { data, loading } = useRoleData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const payments: Payment[] = useMemo(() => getReceiptByUser(data, getAuthenticatedUserID()), [data]);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { valores: filtros, cambiar, limpiar, hayFiltros } = useFiltros(SIN_FILTROS);

  const receipt =
    selectedId !== null
      ? (payments.find(
          // El id de cada fila es el del recibo (no siempre coincide con el del pago)
          (item) => String(item.receipt?.receipt_id) === String(selectedId),
        ) ?? null)
      : null;

  const flattenedRows: FlattenedReceipt[] = useMemo(
    () =>
      payments
        .filter((r) => r.receipt !== null)
        .map((r) => ({
          id: r.receipt.receipt_id,
          client_id: r.client.person_id,
          client: `${r.client.first_name} ${r.client.last_name}`,
          service: r.service.name,
          price: montoPago(r),
          date: fechaLocal(r.creation_date),
          receipt: r.receipt,
        })),
    [payments],
  );

  const filtrados = useMemo(
    () =>
      flattenedRows.filter(
        (r) =>
          coincide(filtros.buscar, r.client, `#${r.id}`, r.service) &&
          (filtros.estado === "" || String(r.receipt.receipt_status?.receipt_status_id) === filtros.estado) &&
          enPeriodo(r.date, filtros.desde, filtros.hasta),
      ),
    [flattenedRows, filtros],
  );

  if (loading) return <Progress />;

  const invoicePanel = receipt && (
    <InvoiceView
      id={receipt.receipt.receipt_id}
      date={receipt.payment_data.creation_date}
      client={`${receipt.client.first_name} ${receipt.client.last_name}`}
      service={receipt.service.name}
      price={montoPago(receipt)}
      total={montoPago(receipt)}
      paymentMethod={receipt.payment_data.type}
      client_id={receipt.client_id}
    />
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>

        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Comprobantes de Pago" chip="Pago" />
        </Grid>

        <Grid size={12}>
          <PagosRechazados />
        </Grid>

        <Grid size={12}>
          <BarraFiltros
            id="recibos"
            busqueda={{ value: filtros.buscar, onChange: (v) => cambiar("buscar", v), placeholder: "N.° de recibo o servicio" }}
            listas={[{ id: "estado", etiqueta: "Estado", value: filtros.estado, onChange: (v) => cambiar("estado", v), opciones: ESTADOS_DE_RECIBO }]}
            periodo={{
              desde: filtros.desde,
              hasta: filtros.hasta,
              onChange: (desde, hasta) => {
                cambiar("desde", desde);
                cambiar("hasta", hasta);
              },
              etiqueta: "Emisión",
            }}
            total={flattenedRows.length}
            mostrados={filtrados.length}
            que={["recibo", "recibos"]}
            hayFiltros={hayFiltros}
            onLimpiar={limpiar}
          />
        </Grid>

        {/* Tabla: ocupa todo el ancho en móvil, 8 columnas en desktop si hay panel */}
        <Grid size={{ xs: 12, md: receipt && !isMobile ? 8 : 12 }} sx={{ overflowX: "auto" }}>
          <Table<FlattenedReceipt>
            columns={columns}
            rows={filtrados}
            getRowId={(row) => row.id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>

        {/* Panel lateral solo en desktop */}
        {receipt && !isMobile && (
          <Grid size={{ md: 4 }}>
            {invoicePanel}
          </Grid>
        )}
      </Grid>

      {/* Drawer solo en móvil/tablet */}
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
              maxHeight: vh(85),
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