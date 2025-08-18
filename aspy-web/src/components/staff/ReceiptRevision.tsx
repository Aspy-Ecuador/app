import { PaymentResponse } from "@/typesResponse/PaymentResponse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface ReceiptRevisionProps {
  receiptData: PaymentResponse;
}

export default function ReceiptRevision({ receiptData }: ReceiptRevisionProps) {
  const handleDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("No se pudo descargar el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = "";
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileNameFromUrl(fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando el archivo:", error);
    }
  };

  return (
    <Box mt={2} width={"100%"}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="subtitle1" color="black" fontWeight={600}>
            Paciente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receiptData.person.full_name}
          </Typography>
        </Grid>

        {/*
        <Grid size={12}>
          <Typography variant="subtitle1" color="black" fontWeight={600}>
            Cédula del paciente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receiptData.person}
          </Typography>
        </Grid>
        */}

        <Grid container size={12} spacing={1} mt={4} mb={4} width={"100%"}>
          <Grid
            size={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Descargar Comprobante
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
                  handleDownload(receiptData.payment_data.file);
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

const getFileNameFromUrl = (url: string): string => {
  if (url.endsWith(".pdf")) {
    return "comprobante.pdf";
  }
  if (url.endsWith(".png")) {
    return "comprobante.png";
  }
  return "comprobante";
};
