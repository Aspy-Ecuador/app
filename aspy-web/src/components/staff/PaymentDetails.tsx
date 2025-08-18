import { useParams } from "react-router-dom";
import { getPayment } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import InvoiceView from "@components/InvoiceView";
import ReceiptDetails from "@staff/ReceiptDetails";
import SimpleHeader from "@components/SimpleHeader";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import PDFViewer from "@components/PDFViewer";
import { useRoleData } from "@/observer/RoleDataContext";

export default function PaymentDetails() {
  const { id } = useParams();
  const numericId = parseInt(id!);
  const { data } = useRoleData();
  const payment: PaymentResponse = getPayment(numericId, data);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Detalles del pago"} />
        </Grid>
        <Grid size={3}>
          <ReceiptDetails receiptData={payment} />
        </Grid>
        <Grid size={6}>
          <PDFViewer url={payment.payment_data.file} />
        </Grid>
        <Grid size={3}>
          <InvoiceView
            id={payment.payment_id}
            date={payment.creation_date}
            client={payment.person.first_name + " " + payment.person.last_name}
            service={payment.service.name}
            price={Number(payment.total_amount)}
            total={Number(payment.total_amount)}
            paymentMethod={payment.payment_data.type}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
