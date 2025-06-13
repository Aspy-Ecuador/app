import { Payment } from "@/types/Payment";
import { FileData } from "@/types/FileData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface ReceiptRevisionProps {
  receiptData: Payment;
}

function ReceiptRevision({ receiptData }: ReceiptRevisionProps) {
  const handleDownload = (file: FileData) => {
    const link = document.createElement("a");
    link.href =
      typeof file.file === "string"
        ? file.file
        : URL.createObjectURL(file.file);
    link.download = file.name;
    link.click();
  };

  return (
    <Box mt={2} width={"100%"}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="subtitle1" color="black" fontWeight={600}>
            Paciente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receiptData.person}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle1" color="black" fontWeight={600}>
            Representante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receiptData.person}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle1" color="black" fontWeight={600}>
            Cédula del paciente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receiptData.person}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1} mt={4} mb={4} width={"100%"}>
          <Grid
            size={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Comprobante de pago
          </Grid>
          <Grid size={3} container>
            <Grid
              size={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                onClick={() => {
                  handleDownload(receiptData.file);
                }}
                variant="text"
                className="boton-editar"
              >
                <FileDownloadIcon className="icono" />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ReceiptRevision;
