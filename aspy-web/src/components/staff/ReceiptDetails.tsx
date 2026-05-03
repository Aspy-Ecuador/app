// FINAL
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import ReceiptRevision from "@staff/ReceiptRevision";
import Success from "@components/Success";
import { useRoleData } from "@/observer/RoleDataContext";
import appointmentAPI from "@/API/appointmentAPI";
import type { Payment } from "@/typesResponse/Payment";
import type { Appointment } from "@/typesResponse/Appointment";

interface ReceiptDetailsProps {
  receiptData: Payment;
}

type ActionState = "idle" | "approving" | "rejecting";

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

  const [actionState, setActionState] = useState<ActionState>("idle");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFail, setIsFail] = useState(false);

  const findAppointment = () => {
    const appointments: Appointment[] = data?.appointments || [];
    return appointments.find((a) => a.payment_id === receiptData.payment_id);
  };

  const refreshAll = async () => {
    await refreshAppointments();
    await refreshPayments();
    await refreshPersons();
    await refreshProServices();
    await refreshServices();
    await refreshWorkerProfessional();
  };

  const handleApprove = async () => {
    setActionState("approving");
    try {
      await appointmentAPI.approveAppointment(
        findAppointment()!.appointment_id,
      );
      await refreshAll();
      setIsFail(false);
      setSuccessMessage("Comprobante aprobado exitosamente");
      setSuccessOpen(true);
    } catch {
      setIsFail(true);
      setSuccessMessage("Ocurrió un error al aprobar el comprobante");
      setSuccessOpen(true);
    } finally {
      setActionState("idle");
    }
  };

  const handleReject = async () => {
    setActionState("rejecting");
    try {
      await appointmentAPI.rejectAppointment(findAppointment()!.appointment_id);
      await refreshAll();
      setIsFail(false);
      setSuccessMessage("Comprobante rechazado");
      setSuccessOpen(true);
    } catch {
      setIsFail(true);
      setSuccessMessage("Ocurrió un error al rechazar el comprobante");
      setSuccessOpen(true);
    } finally {
      setActionState("idle");
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate("/pagos");
  };

  const isLoading = actionState !== "idle";

  return (
    <>
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
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              mt: 1.75,
            }}
          >
            {/* Botón Aprobar */}
            <Button
              fullWidth
              onClick={handleApprove}
              disabled={isLoading}
              sx={{
                bgcolor: "#1D9E75",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 2,
                py: 1,
                minHeight: 36,
                "&:hover": { bgcolor: "#0F6E56" },
                "&:disabled": { bgcolor: "#1D9E7588" },
              }}
            >
              {actionState === "approving" ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                "Aprobar comprobante"
              )}
            </Button>

            {/* Botón No aprobar */}
            <Button
              fullWidth
              onClick={handleReject}
              disabled={isLoading}
              sx={{
                bgcolor: "#FCEBEB",
                color: "#A32D2D",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 2,
                py: 1,
                minHeight: 36,
                border: "0.5px solid #F09595",
                "&:hover": { bgcolor: "#F7C1C1" },
                "&:disabled": {
                  bgcolor: "#FCEBEB88",
                  borderColor: "#F0959588",
                },
              }}
            >
              {actionState === "rejecting" ? (
                <CircularProgress size={16} sx={{ color: "#A32D2D" }} />
              ) : (
                "No aprobar"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Success
        open={successOpen}
        handleClose={handleSuccessClose}
        isRegister={false}
        message={successMessage}
        fail={isFail}
      />
    </>
  );
}
