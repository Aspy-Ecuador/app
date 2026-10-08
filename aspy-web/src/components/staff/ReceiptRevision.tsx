// FINAL
import type { Payment } from "@/typesResponse/Payment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BotonDescargarArchivo from "@buttons/BotonDescargarArchivo";

interface ReceiptRevisionProps {
  receiptData: Payment;
}

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
          Comprobante de pago
        </Typography>
        {receiptData.payment_data.file && (
          <BotonDescargarArchivo
            archivo={receiptData.payment_data.file}
            nombre={`comprobante-pago-${receiptData.payment_id}`}
          />
        )}
      </Box>
    </Box>
  );
}
