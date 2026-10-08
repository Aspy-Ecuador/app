// FINAL
import type { Payment } from "@/typesResponse/Payment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BotonDescargarArchivo from "@buttons/BotonDescargarArchivo";
import { fechaHoraLocal } from "@/utils/utils";
import { tone } from "@shared-theme/themePrimitives";

interface ReceiptRevisionProps {
  receiptData: Payment;
}

/** Estado de pago "Rechazado" (ids fijos: 1 Aprobado, 2 Pendiente, 3 Rechazado). */
const PAGO_RECHAZADO = 3;

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

      {/* Pago rechazado: el motivo queda siempre; el comprobante se conserva lo que decidió el Admin */}
      {receiptData.payment_status_id === PAGO_RECHAZADO && (
        <Box role="note" sx={{ mt: 1, p: 1.25, borderRadius: 2, bgcolor: tone.red.bg, border: `0.5px solid ${tone.red.border}` }}>
          <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: tone.red.fg }}>
            Pago rechazado
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 12.5, lineHeight: 1.5, color: "text.primary", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
            {receiptData.motivo_rechazo?.trim() || "Sin motivo registrado."}
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 11.5, lineHeight: 1.5, color: "text.secondary" }}>
            {!receiptData.payment_data.file
              ? "Su comprobante ya se borró del sistema."
              : receiptData.comprobante_se_borra_el
                ? `El comprobante se borrará del sistema el ${fechaHoraLocal(receiptData.comprobante_se_borra_el)}. Si lo necesitas, descárgalo antes.`
                : "El comprobante se conserva en el sistema."}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
