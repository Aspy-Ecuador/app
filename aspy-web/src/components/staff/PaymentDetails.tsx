// FINAL
import { useParams } from "react-router-dom";
import { getPayment } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import InvoiceView from "@components/InvoiceView";
import ReceiptDetails from "@staff/ReceiptDetails";
import PDFViewer from "@components/PDFViewer";
import { useRoleData } from "@/observer/RoleDataContext";
import type { Payment } from "@/typesResponse/Payment";

export default function PaymentDetails() {
  const { id } = useParams();
  const numericId = parseInt(id!);
  const { data } = useRoleData();
  const navigate = useNavigate();
  const payment: Payment = getPayment(numericId, data.payments);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 1.5,
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          Detalles del pago
        </Typography>
        <Chip
          label="Pendiente revisión"
          size="small"
          sx={{
            ml: "auto",
            bgcolor: "#FAEEDA",
            color: "#854F0B",
            fontWeight: 500,
            fontSize: 11,
            height: 22,
            "& .MuiChip-label": { px: 1.25 },
          }}
        />
      </Box>

      {/* Columnas */}
      <Grid container spacing={1.5} alignItems="flex-start">
        <Grid size={3}>
          <ReceiptDetails receiptData={payment} />
        </Grid>
        <Grid size={6}>
          <PDFViewer url={payment.payment_data.file!} />
        </Grid>
        <Grid size={3}>
          <InvoiceView
            id={payment.payment_id}
            client_id={payment.client_id}
            date={payment.creation_date}
            client={`${payment.client.first_name} ${payment.client.last_name}`}
            service={payment.service.name}
            price={Number(payment.service.price)}
            total={Number(payment.service.price)}
            paymentMethod={payment.payment_data.type}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
