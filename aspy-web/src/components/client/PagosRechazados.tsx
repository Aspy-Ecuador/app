// Pagos que la fundación no aprobó, con el motivo que escribió Secretaría, para que la familia sepa
// qué pasó y pueda agendar de nuevo. La cita de un pago rechazado se elimina, así que sin este aviso
// la familia solo vería que su cita desapareció. No se muestra nada si no hay pagos rechazados.
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useRoleData } from "@/observer/RoleDataContext";
import { fechaLocal, montoPago } from "@/utils/utils";
import { tone } from "@shared-theme/themePrimitives";
import type { Payment } from "@/typesResponse/Payment";

/** Estado de pago "Rechazado" (ids fijos: 1 Aprobado, 2 Pendiente, 3 Rechazado). */
const PAGO_RECHAZADO = 3;
const DIAS_RECIENTES = 30;

interface PagosRechazadosProps {
  /** En el panel de inicio solo se muestran los del último mes; en Recibos, todos. */
  soloRecientes?: boolean;
}

export default function PagosRechazados({ soloRecientes = false }: PagosRechazadosProps) {
  const { data } = useRoleData();
  // Se calcula una sola vez, al abrir la pantalla
  const [desde] = useState(() => Date.now() - DIAS_RECIENTES * 24 * 60 * 60 * 1000);
  const cuando = (p: Payment) => p.modification_date ?? p.creation_date;

  const rechazados = ((data?.payments ?? []) as Payment[])
    .filter((p) => p.payment_status_id === PAGO_RECHAZADO)
    .filter((p) => !soloRecientes || new Date(cuando(p)).getTime() >= desde)
    .sort((a, b) => new Date(cuando(b)).getTime() - new Date(cuando(a)).getTime());

  if (rechazados.length === 0) return null;

  return (
    <Paper
      elevation={0}
      role="region"
      aria-label="Pagos que no se aprobaron"
      sx={{ p: { xs: 1.75, sm: 2 }, borderRadius: 3, border: `1px solid ${tone.red.border}`, bgcolor: tone.red.bg }}
    >
      <Typography component="h2" sx={{ display: "flex", alignItems: "center", gap: 0.75, fontWeight: 700, fontSize: "0.95rem", color: tone.red.fg }}>
        <CancelOutlinedIcon sx={{ fontSize: 19 }} />
        {rechazados.length === 1 ? "Un pago no se aprobó" : `${rechazados.length} pagos no se aprobaron`}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: "0.85rem", lineHeight: 1.5, color: "text.secondary" }}>
        La cita de un pago que no se aprueba se elimina y su horario queda libre. Puedes agendar de nuevo con el comprobante correcto.
      </Typography>

      <Box sx={{ mt: 1.25, display: "flex", flexDirection: "column", gap: 1 }}>
        {rechazados.map((pago) => (
          <Box key={pago.payment_id} sx={{ p: 1.25, borderRadius: 2, bgcolor: "background.paper", border: "0.5px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "text.primary" }}>
              {pago.service?.name ?? "Servicio"} · ${montoPago(pago).toFixed(2)}
              <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>
                {" "}
                · rechazado el {fechaLocal(cuando(pago))}
              </Box>
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: "0.85rem", lineHeight: 1.5, color: "text.primary", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Motivo:{" "}
              </Box>
              {pago.motivo_rechazo?.trim() || "La fundación no dejó un motivo. Comunícate con ASPY para saber qué pasó."}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
