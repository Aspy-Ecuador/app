// Marca, en las listas de Usuarios (Admin) y Pacientes (Secretaría), a quien retiró su consentimiento
// desde "Privacidad y mis datos": su cuenta quedó deshabilitada y la fundación debe revisar qué datos
// tiene que eliminar (LOPDP, art. 15). No se muestra nada si la persona no lo retiró.
import Tooltip from "@mui/material/Tooltip";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import { tone } from "@shared-theme/themePrimitives";
import { fechaLocal } from "@/utils/utils";

export default function AvisoConsentimientoRetirado({ fecha }: { fecha?: string | null }) {
  if (!fecha) return null;
  const texto = `Retiró su consentimiento el ${fechaLocal(fecha)}. Su cuenta quedó deshabilitada: revisa qué datos se deben eliminar.`;
  return (
    <Tooltip title={texto} arrow enterTouchDelay={0}>
      <GppBadOutlinedIcon role="img" aria-label={texto} tabIndex={0} sx={{ fontSize: 18, color: tone.red.fg, ml: 0.25, flex: "none" }} />
    </Tooltip>
  );
}
