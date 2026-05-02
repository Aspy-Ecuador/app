// FINAL
import { useParams } from "react-router-dom";
import { getPayment } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InvoiceView from "@components/InvoiceView";
import ReceiptDetails from "@staff/ReceiptDetails";
import PDFViewer from "@components/PDFViewer";
import { useRoleData } from "@/observer/RoleDataContext";
import type { Payment } from "@/typesResponse/Payment";
import SimpleHeader from "../SimpleHeader";

export default function PaymentDetails() {
  const { id } = useParams();
  const numericId = parseInt(id!);
  const { data } = useRoleData();
  const payment: Payment = getPayment(numericId, data.payments);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      {/* Header */}
      <SimpleHeader text="Detalles del pago" chip="Pendiente revisión" />

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
