// Avisos (menú → Avisos, los cuatro roles): lo que la cuenta tiene por revisar y todo lo que el sistema le
// ha contado (alguien reservó una cita, el comprobante fue aprobado o rechazado, aprobaron un horario…).
// Tocar un aviso lo marca como leído y abre la pantalla correspondiente.
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SimpleHeader from "@components/SimpleHeader";
import { FilaAviso, TarjetasPendientes } from "@components/avisos/piezas";
import { useAvisos } from "@/observer/AvisosContext";
import type { Aviso, Pendiente } from "@/typesResponse/Aviso";

const tarjetaSx = { p: { xs: 1.5, sm: 2 }, borderRadius: 3, border: "0.5px solid", borderColor: "divider" } as const;
const tituloSx = { fontSize: 15, fontWeight: 700, color: "text.primary" } as const;

export default function Avisos() {
  const navigate = useNavigate();
  const { avisos, pendientes, sinLeer, listo, marcarLeidos } = useAvisos();

  const abrir = (a: Aviso) => {
    void marcarLeidos([a.aviso_id]);
    if (a.enlace) navigate(a.enlace);
  };
  const ir = (p: Pendiente) => navigate(p.enlace);

  return (
    <Box className="box-panel-control" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <SimpleHeader text="Avisos" chip={sinLeer > 0 ? `${sinLeer} sin leer` : "Al día"} />

      {!listo ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
          <CircularProgress size={28} aria-label="Cargando los avisos" />
        </Box>
      ) : (
        <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {pendientes.length > 0 && (
            <Paper component="section" aria-labelledby="avisos-por-revisar" elevation={0} sx={{ ...tarjetaSx, display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Typography id="avisos-por-revisar" component="h3" sx={tituloSx}>
                Por revisar
              </Typography>
              <TarjetasPendientes pendientes={pendientes} onIr={ir} />
            </Paper>
          )}

          <Paper component="section" aria-labelledby="avisos-lista" elevation={0} sx={{ ...tarjetaSx, display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Typography id="avisos-lista" component="h3" sx={{ ...tituloSx, flex: 1, minWidth: 0 }}>
                Tus avisos
              </Typography>
              {sinLeer > 0 && (
                <Button size="small" startIcon={<DoneAllRoundedIcon />} onClick={() => void marcarLeidos()} sx={{ minWidth: 0, height: 32, px: 1.5, borderRadius: "999px", textTransform: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                  Marcar todos como leídos
                </Button>
              )}
            </Box>

            {avisos.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1, py: 4, color: "text.secondary" }}>
                <NotificationsNoneRoundedIcon sx={{ fontSize: 34, color: "text.disabled" }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "text.primary" }}>Todavía no tienes avisos</Typography>
                <Typography sx={{ fontSize: 12.5, maxWidth: 420, lineHeight: 1.5 }}>Cuando pase algo que te toque saber, aparecerá aquí y en el contador del menú.</Typography>
              </Box>
            ) : (
              <Box component="ul" aria-label="Tus avisos" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                {avisos.map((a) => (
                  <Box component="li" key={a.aviso_id}>
                    <FilaAviso aviso={a} onAbrir={abrir} />
                  </Box>
                ))}
              </Box>
            )}

            {avisos.length > 0 && (
              <Typography sx={{ fontSize: 11.5, color: "text.disabled", lineHeight: 1.5 }}>
                Se muestran los más recientes. Un aviso leído se borra solo al mes.
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
}
