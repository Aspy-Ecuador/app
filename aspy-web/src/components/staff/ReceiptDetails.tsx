// FINAL
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ReceiptRevision from "@staff/ReceiptRevision";
import { useRoleData } from "@/observer/RoleDataContext";
import appointmentAPI from "@/API/appointmentAPI";
import type { Payment } from "@/typesResponse/Payment";
import type { Appointment } from "@/typesResponse/Appointment";

interface ReceiptDetailsProps {
  receiptData: Payment;
}

export default function ReceiptDetails({ receiptData }: ReceiptDetailsProps) {
  const navigate = useNavigate();
  const {
    data,
    refreshAppointments,
    refreshPayments,
    refreshPersons,
    refreshProServices,
    refreshServices,
    refreshWorkerProfessional,
  } = useRoleData();

  const findAppointment = () => {
    const appointments: Appointment[] = data?.appointments || [];
    return appointments.find((a) => a.payment_id === receiptData.payment_id);
  };

  const handleReject = async () => {
    await appointmentAPI.rejectAppointment(findAppointment()!.appointment_id);
    await refreshAppointments();
    await refreshPayments();
    await refreshPersons();
    await refreshProServices();
    await refreshServices();
    await refreshWorkerProfessional();
    navigate("/pagos");
  };

  const handleApprove = async () => {
    await appointmentAPI.approveAppointment(findAppointment()!.appointment_id);
    await refreshAppointments();
    await refreshPayments();
    await refreshPersons();
    await refreshProServices();
    await refreshServices();
    await refreshWorkerProfessional();
    navigate("/pagos");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.disabled",
          }}
        >
          Comprobante
        </Typography>
      </Box>

      <Box sx={{ p: 1.75 }}>
        <ReceiptRevision receiptData={receiptData} />

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 1.75 }}
        >
          <Button
            fullWidth
            onClick={handleApprove}
            sx={{
              bgcolor: "#1D9E75",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 2,
              py: 1,
              "&:hover": { bgcolor: "#0F6E56" },
            }}
          >
            Aprobar comprobante
          </Button>
          <Button
            fullWidth
            onClick={handleReject}
            sx={{
              bgcolor: "#FCEBEB",
              color: "#A32D2D",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 2,
              py: 1,
              border: "0.5px solid #F09595",
              "&:hover": { bgcolor: "#F7C1C1" },
            }}
          >
            No aprobar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
