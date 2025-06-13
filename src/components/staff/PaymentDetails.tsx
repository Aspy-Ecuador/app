import { useParams } from "react-router-dom";
import { getPayment } from "@utils/utils";
import { Payment } from "@/types/Payment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import InvoiceView from "@components/InvoiceView";
import ReceiptDetails from "@staff/ReceiptDetails";
import SimpleHeader from "@components/SimpleHeader";

export default function PaymentDetails() {
  const { id } = useParams();
  const numericId = parseInt(id!);
  const payment: Payment = getPayment(numericId);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Detalles del pago"} />
        </Grid>
        <Grid size={6}>
          <ReceiptDetails receiptData={payment} />
        </Grid>
        <Grid size={6}>
          <InvoiceView
            id={payment.id}
            date={payment.creation_date}
            client={payment.person}
            service={payment.service}
            address={payment.address}
            price={payment.service_price}
            discount={payment.discount_percentage}
            total={payment.total_amount}
            paymentMethod={payment.paymentMethod}
            contactEmail={payment.contactEmail}
            contactPhone={payment.contactPhone}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
