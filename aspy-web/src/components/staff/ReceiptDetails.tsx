import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import ReceiptRevision from "@staff/ReceiptRevision";
import CancelButton from "@buttons/CancelButton";
import CreationButton from "@buttons/CreationButton";
import Typography from "@mui/material/Typography";
import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import paymentAPI from "@/API/paymentAPI";
import { StatusRequest } from "@/typesRequest/StatusRequest";
//import { dataPayments } from "@/data/Payment";
import receiptAPI from "@/API/receiptAPI";
import { useRoleData } from "@/observer/RoleDataContext";
import {
  getAppointmentByPayment,
  getPayment,
  getPayments,
} from "@/utils/utils";
import { ReceiptRequest } from "@/typesRequest/ReceiptRequest";
import appointmentAPI from "@/API/appointmentAPI";

interface ReceiptDetailsProps {
  receiptData: PaymentResponse;
}

export default function ReceiptDetails({ receiptData }: ReceiptDetailsProps) {
  const navigate = useNavigate();
  const { refreshReceipts, refreshPayments, data, refreshAppointments } =
    useRoleData();

  const handleBack = async () => {
    const appointmentId: number = getAppointmentByPayment(
      receiptData.payment_id,
      data
    );
    console.log(appointmentId);
    await appointmentAPI.deleteAppointment(appointmentId);
    await paymentAPI.deletePayment(receiptData.payment_id);
    await refreshPayments();
    await refreshAppointments();
    navigate("/pagos");
    //SE DEBE COREREGIN CUANDO SE ELIMINA EL PAYMENT EL PAYMENTDetail queda sin id, borré el 9
  };

  const approve = async () => {
    const status: StatusRequest = { status: 2 };
    const newReceipt: ReceiptRequest = {
      payment_id: receiptData.payment_id,
      status: "Paid",
    };
    await receiptAPI.createReceipt(newReceipt);
    await refreshReceipts();
    await paymentAPI.updateStatus(receiptData.payment_id, status);
    await refreshPayments();
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
