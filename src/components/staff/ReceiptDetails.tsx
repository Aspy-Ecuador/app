import { useNavigate } from "react-router-dom";
import { Payment } from "@/types/Payment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import ReceiptRevision from "@staff/ReceiptRevision";
import CancelButton from "@buttons/CancelButton";
import CreationButton from "@buttons/CreationButton";
import Typography from "@mui/material/Typography";

interface ReceiptDetailsProps {
  receiptData: Payment; //Payment
}

export default function ReceiptDetails({ receiptData }: ReceiptDetailsProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/pagos");
  };

  return (
    <Box maxWidth={400} mx="auto" p={3}>
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
            <CreationButton onClick={handleBack} text="Aprobar comprobante" />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
