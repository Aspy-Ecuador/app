// FINAL
import type { Payment } from "@/typesResponse/Payment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import Button from "@mui/material/Button";

interface ReceiptRevisionProps {
  receiptData: Payment;
}

const getFileName = (url: string) =>
  url.endsWith(".pdf")
    ? "comprobante.pdf"
    : url.endsWith(".png")
      ? "comprobante.png"
      : "comprobante";

const Field = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "text.disabled",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>
      {value}
    </Typography>
  </Box>
);

export default function ReceiptRevision({ receiptData }: ReceiptRevisionProps) {
  const handleDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("No se pudo descargar");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName(fileUrl);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Field
        label="Paciente"
        value={`${receiptData.client.first_name} ${receiptData.client.last_name}`}
      />
      <Field
        label="Cédula"
        value={receiptData.client.identification?.number ?? "N/A"}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
          mt: 0.5,
          bgcolor: "action.hover",
          borderRadius: 2,
          border: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Comprobante PDF
        </Typography>
        <Button
          size="small"
          startIcon={
            <FileDownloadRoundedIcon sx={{ fontSize: "14px !important" }} />
          }
          onClick={() => handleDownload(receiptData.payment_data.file!)}
          sx={{
            fontSize: 11,
            fontWeight: 500,
            color: "#185FA5",
            bgcolor: "#E6F1FB",
            border: "0.5px solid #B5D4F4",
            borderRadius: 1.5,
            px: 1.25,
            minWidth: 0,
            "&:hover": { bgcolor: "#B5D4F4" },
          }}
        >
          Descargar
        </Button>
      </Box>
    </Box>
  );
}
