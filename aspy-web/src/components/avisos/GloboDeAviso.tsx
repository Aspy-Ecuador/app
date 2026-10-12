// Globo que aparece cuando llega un aviso con el sistema abierto (por ejemplo, Secretaría aprueba el pago
// mientras la familia mira su panel). Se cierra solo; "Ver" abre la pantalla del aviso.
// Va en un Portal: fuera del contenedor con zoom de los televisores, donde lo agranda index.css (una sola vez).
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useAvisos } from "@/observer/AvisosContext";

const ROJOS = ["pago_rechazado", "cita_eliminada", "cita_cancelada"];
const VERDES = ["pago_aprobado", "cita_confirmada", "horario_aprobado"];

export default function GloboDeAviso() {
  const navigate = useNavigate();
  const { recienLlegado: aviso, cerrarRecienLlegado, marcarLeidos } = useAvisos();

  const ver = () => {
    if (!aviso) return;
    const destino = aviso.enlace ?? "/avisos";
    void marcarLeidos([aviso.aviso_id]);
    navigate(destino);
  };

  const rojo = aviso ? ROJOS.includes(aviso.tipo) : false;
  const verde = aviso ? VERDES.includes(aviso.tipo) : false;

  return (
    <Portal>
      <Snackbar
        key={aviso?.aviso_id}
        open={aviso !== null}
        autoHideDuration={9000}
        onClose={(_, motivo) => {
          if (motivo !== "clickaway") cerrarRecienLlegado();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {/* Mismo azul oscuro del menú, en modo claro y en modo oscuro: se distingue de cualquier pantalla */}
        <Box
          role="status"
          aria-live="polite"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            maxWidth: 440,
            pl: 1.75,
            pr: 0.75,
            py: 1,
            borderRadius: 3,
            bgcolor: "#1D2D44",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 12px 34px rgba(0,0,0,0.32)",
          }}
        >
          <Box sx={{ flex: "none", display: "grid", placeItems: "center", color: rojo ? "#F0919E" : verde ? "#5DCAA5" : "#7CC4EA", "& svg": { fontSize: 22 } }}>
            {rojo ? <CancelRoundedIcon /> : verde ? <CheckCircleRoundedIcon /> : <NotificationsActiveRoundedIcon />}
          </Box>
          <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "#fff" }}>{aviso?.titulo}</Typography>
          <Button size="small" onClick={ver} sx={{ flex: "none", minWidth: 0, height: 32, px: 1.5, borderRadius: "999px", textTransform: "none", fontSize: "0.82rem", fontWeight: 700, color: "#1D2D44", bgcolor: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.86)" } }}>
            Ver
          </Button>
          <IconButton size="small" aria-label="Cerrar el aviso" onClick={cerrarRecienLlegado} sx={{ flex: "none", width: 32, height: 32, border: 0, bgcolor: "transparent", color: "rgba(255,255,255,0.75)", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Snackbar>
    </Portal>
  );
}
