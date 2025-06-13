import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import logo from "@assets/visto.png";
import schedule from "@assets/cita.png";

interface SuccessDialogProps {
  open: boolean;
  handleClose: () => void;
  isRegister: boolean;
  message: string;
}

export default function Success({
  open,
  handleClose,
  isRegister,
  message,
}: SuccessDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "#fffffff4",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <img
          src={isRegister ? schedule : logo}
          alt="Success"
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
        <DialogContentText sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="contained" onClick={handleClose}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
