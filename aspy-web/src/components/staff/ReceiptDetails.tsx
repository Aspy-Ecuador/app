// FINAL
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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
type PendingAction = "approve" | "reject" | null;

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
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFail, setIsFail] = useState(false);

  // Guarda la última acción para que el diálogo no cambie de texto durante la animación de cierre
  const lastActionRef = useRef<PendingAction>(null);

  const requestAction = (action: PendingAction) => {
    if (action !== null) lastActionRef.current = action;
    setPendingAction(action);
  };

  // isApproving lee del ref — no cambia cuando pendingAction se vuelve null
  const isApproving = lastActionRef.current === "approve";

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
    setPendingAction(null);
    try {
      await appointmentAPI.approveAppointment(findAppointment()!.appointment_id);
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
    setPendingAction(null);
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

  const handleConfirm = () => {
    if (pendingAction === "approve") handleApprove();
    else if (pendingAction === "reject") handleReject();
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 1.75 }}>
            <Button
              fullWidth
              onClick={() => requestAction("approve")}
              disabled={isLoading}
              sx={{
                bgcolor: "#1D9E75",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 2,
                py: 1,
                minHeight: 36,
                textTransform: "none",
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

            <Button
              fullWidth
              onClick={() => requestAction("reject")}
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
                textTransform: "none",
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

      <Dialog
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "0.5px solid",
            borderColor: "divider",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            maxWidth: 360,
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ pb: 0.5, pt: 2.5, px: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isApproving ? (
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 20, color: "#0F6E56" }} />
            ) : (
              <CancelOutlinedIcon sx={{ fontSize: 20, color: "#A32D2D" }} />
            )}
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {isApproving ? "Aprobar comprobante" : "Rechazar comprobante"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 2.5, pt: 1.25, pb: 1 }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>
            {isApproving
              ? "¿Estás seguro de que deseas aprobar este comprobante? Esta acción no se puede deshacer."
              : "¿Estás seguro de que deseas rechazar este comprobante? Esta acción no se puede deshacer."}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setPendingAction(null)}
            size="small"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "text.secondary",
              bgcolor: "action.hover",
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              px: 1.75,
              textTransform: "none",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            size="small"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              bgcolor: isApproving ? "#1D9E75" : "#A32D2D",
              borderRadius: 1.5,
              px: 1.75,
              textTransform: "none",
              "&:hover": { bgcolor: isApproving ? "#0F6E56" : "#7A1F1F" },
            }}
          >
            {isApproving ? "Sí, aprobar" : "Sí, rechazar"}
          </Button>
        </DialogActions>
      </Dialog>

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