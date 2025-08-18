import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import ReceiptRevision from "@staff/ReceiptRevision";
import CancelButton from "@buttons/CancelButton";
import CreationButton from "@buttons/CreationButton";
import Typography from "@mui/material/Typography";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
//import paymentAPI from "@/API/paymentAPI";
//import { StatusRequest } from "@/typesRequest/StatusRequest";
import { dataPayments } from "@/data/Payment";
import receiptAPI from "@/API/receiptAPI";
import { useRoleData } from "@/observer/RoleDataContext";

interface ReceiptDetailsProps {
  receiptData: PaymentResponse;
}

export default function ReceiptDetails({ receiptData }: ReceiptDetailsProps) {
  const navigate = useNavigate();
  const { refreshReceipts } = useRoleData();
  const handleBack = () => {
    navigate("/pagos");
  };

  const approve = async () => {
    //const status: StatusRequest = { status_id: 12 };
    const id: number = receiptData.payment_id;
    const data: PaymentResponse[] = dataPayments;

    const payment = data.find((p) => p.payment_id === id);
    if (payment) {
      payment.status.name = "Paid";
      payment.status.status_id = 2;
    }

    console.log(data);
    const nuevo = {
      payment_id: receiptData.payment_id,
      status: "Paid",
    };
    await receiptAPI.createReceipt(nuevo);
    await refreshReceipts();
    //await paymentAPI.updateStatus(receiptData.payment_id, status);
    navigate(-1);
  };

  return (
    <Box maxWidth={400}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="h4">Pendiente revisión</Typography>
        </Grid>
        <Grid size={12}>
          <ReceiptRevision receiptData={receiptData} />
        </Grid>
        <Grid container size={12}>
          <div className="flex flex-row gap-9 justify-center w-full">
            <CancelButton onClick={handleBack} text="No aprobar" />
            <CreationButton onClick={approve} text="Aprobar comprobante" />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
