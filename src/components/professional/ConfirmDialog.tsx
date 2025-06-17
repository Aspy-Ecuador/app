import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  value,
}: ConfirmDialogProps) {
  const message =
    value === "assist"
      ? "¿Está seguro de que desea marcar esta cita como asistida?"
      : "¿Está seguro de que desea marcar esta cita como no asistida?";
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar asistencia</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
