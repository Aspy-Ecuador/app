// Avisos en la Vista General de los cuatro roles: lo que la cuenta tiene por revisar y sus avisos sin leer.
// Si no hay nada, no ocupa lugar (el historial completo está en el menú → Avisos).
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useAvisos } from "@/observer/AvisosContext";
import type { Aviso, Pendiente } from "@/typesResponse/Aviso";
import { tone } from "@shared-theme/themePrimitives";
import { FilaAviso, TarjetasPendientes } from "./piezas";

/** Cuántos avisos sin leer caben antes de mandar a la pantalla completa. */
const MAXIMO = 3;

export default function PanelAvisos() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const panel = useRef<HTMLElement>(null);
  const { avisos, pendientes, sinLeer, marcarLeidos } = useAvisos();
  const nuevos = avisos.filter((a) => !a.leido);

  if (pendientes.length === 0 && nuevos.length === 0) return null;

  const abrir = (a: Aviso) => {
    void marcarLeidos([a.aviso_id]);
    if (a.enlace) navigate(a.enlace);
  };
  const ir = (p: Pendiente) => {
    if (p.enlace !== pathname) return navigate(p.enlace);
    // Lo pendiente se resuelve en esta misma pantalla (citas sin marcar, el calendario): se baja hasta ahí
    const loQueSigue = panel.current?.nextElementSibling ?? panel.current?.parentElement?.nextElementSibling;
    loQueSigue?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <Paper ref={panel} component="section" aria-label="Avisos" elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, border: "0.5px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: "9px", display: "grid", placeItems: "center", bgcolor: tone.blue.bg, color: tone.blue.fg }}>
          <NotificationsActiveRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography component="h2" sx={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: "text.primary" }}>
          Avisos
        </Typography>
        <Button size="small" onClick={() => navigate("/avisos")} sx={{ minWidth: 0, height: 30, px: 1.5, borderRadius: "999px", textTransform: "none", fontSize: "0.8rem", fontWeight: 600 }}>
          Ver todos
        </Button>
      </Box>

      <TarjetasPendientes pendientes={pendientes} onIr={ir} />

      {nuevos.length > 0 && (
        <Box component="ul" aria-label="Avisos sin leer" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          {nuevos.slice(0, MAXIMO).map((a) => (
            <Box component="li" key={a.aviso_id}>
              <FilaAviso aviso={a} onAbrir={abrir} />
            </Box>
          ))}
        </Box>
      )}

      {sinLeer > MAXIMO && (
        <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
          Y {sinLeer - MAXIMO} {sinLeer - MAXIMO === 1 ? "aviso más" : "avisos más"} sin leer.
        </Typography>
      )}
    </Paper>
  );
}
