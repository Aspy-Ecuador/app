// Piezas comunes de los avisos: las tarjetas de "Por revisar" y la fila de un aviso. Las usan el panel de la
// Vista General (PanelAvisos) y la pantalla Avisos (pages/Avisos).
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import type { Aviso, Pendiente } from "@/typesResponse/Aviso";
import { fechaHoraLocal, hoyEcuador, sumarDias } from "@/utils/utils";
import { tone } from "@shared-theme/themePrimitives";

type Tono = "green" | "blue" | "red" | "amber" | "purple" | "gray";

/** Ícono y color de cada tipo de aviso (los tipos son los de `Aviso` en el backend). */
const ASPECTO: Record<string, { icono: ReactNode; tono: Tono }> = {
  cita_reservada: { icono: <EventAvailableRoundedIcon />, tono: "blue" },
  cita_registrada: { icono: <EventAvailableRoundedIcon />, tono: "blue" },
  pago_aprobado: { icono: <CheckCircleRoundedIcon />, tono: "green" },
  cita_confirmada: { icono: <CheckCircleRoundedIcon />, tono: "green" },
  pago_rechazado: { icono: <CancelRoundedIcon />, tono: "red" },
  cita_eliminada: { icono: <CancelRoundedIcon />, tono: "red" },
  cita_cancelada: { icono: <CancelRoundedIcon />, tono: "red" },
  cita_modalidad: { icono: <VideocamRoundedIcon />, tono: "purple" },
  cita_enlace: { icono: <VideocamRoundedIcon />, tono: "purple" },
  horario_aprobado: { icono: <CheckCircleRoundedIcon />, tono: "green" },
  horario_por_aprobar: { icono: <EditCalendarRoundedIcon />, tono: "amber" },
  horario_cambiado: { icono: <EditCalendarRoundedIcon />, tono: "amber" },
  reporte_listo: { icono: <ArticleRoundedIcon />, tono: "blue" },
};
const ASPECTO_POR_DEFECTO = { icono: <NotificationsRoundedIcon />, tono: "blue" as Tono };

/** "Hoy, 14:05", "Ayer, 09:10" o "08/10/2026, 16:30", en hora de Ecuador. */
function cuandoFue(creadoEl: string | null): string {
  const [fecha, hora] = fechaHoraLocal(creadoEl).split(" / ");
  if (!fecha || !hora) return "";
  const hoy = hoyEcuador();
  if (fecha === hoy) return `Hoy, ${hora}`;
  if (fecha === sumarDias(hoy, -1)) return `Ayer, ${hora}`;
  const [a, m, d] = fecha.split("-");
  return `${d}/${m}/${a}, ${hora}`;
}

/** Tarjetas de lo que la cuenta tiene por revisar: cada una lleva a la pantalla donde se resuelve. */
export function TarjetasPendientes({ pendientes, onIr }: { pendientes: Pendiente[]; onIr: (p: Pendiente) => void }) {
  if (pendientes.length === 0) return null;

  return (
    <Box component="ul" aria-label="Por revisar" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(auto-fit, minmax(230px, 1fr))" }, gap: 1.25 }}>
      {pendientes.map((p) => {
        const t = tone[p.accion ? "amber" : "gray"];
        return (
          <Box component="li" key={p.clave} sx={{ minWidth: 0, display: "flex" }}>
            <ButtonBase
              onClick={() => onIr(p)}
              aria-label={`${p.titulo}: ${p.cantidad}. ${p.texto}`}
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.5,
                px: 1.5,
                py: 1.25,
                borderRadius: 2.5,
                textAlign: "left",
                border: "0.5px solid",
                borderColor: t.border,
                bgcolor: t.bg,
                transition: "transform 0.15s, box-shadow 0.15s",
                "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.08)", transform: "translateY(-1px)" },
                "&:focus-visible": { outline: "2px solid", outlineColor: t.main, outlineOffset: 2 },
                "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
              }}
            >
              <Typography component="span" sx={{ flex: "none", minWidth: 40, textAlign: "center", fontSize: 26, fontWeight: 800, lineHeight: 1, color: t.fg, fontVariantNumeric: "tabular-nums" }}>
                {p.cantidad}
              </Typography>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography component="span" sx={{ display: "block", fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, color: "text.primary" }}>
                  {p.titulo}
                </Typography>
                <Typography component="span" sx={{ display: "block", mt: 0.25, fontSize: 12, lineHeight: 1.4, color: "text.secondary" }}>
                  {p.texto}
                </Typography>
              </Box>
              <ArrowForwardRoundedIcon sx={{ flex: "none", fontSize: 18, color: t.fg }} />
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );
}

/** Un aviso. Si lleva a una pantalla, toda la fila es un botón: al tocarla se marca como leído y abre esa pantalla. */
export function FilaAviso({ aviso, onAbrir }: { aviso: Aviso; onAbrir: (a: Aviso) => void }) {
  const { icono, tono } = ASPECTO[aviso.tipo] ?? ASPECTO_POR_DEFECTO;
  const t = tone[tono];
  const interactiva = Boolean(aviso.enlace) || !aviso.leido;

  const contenido = (
    <>
      <Box sx={{ flex: "none", width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", bgcolor: t.bg, color: t.fg, "& svg": { fontSize: 19 } }}>{icono}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: 1 }}>
          <Typography component="span" sx={{ fontSize: 13.5, fontWeight: aviso.leido ? 600 : 700, lineHeight: 1.35, color: "text.primary" }}>
            {aviso.titulo}
          </Typography>
          {!aviso.leido && (
            <Typography component="span" sx={{ px: 0.75, borderRadius: "999px", fontSize: 10.5, fontWeight: 700, lineHeight: 1.6, color: tone.blue.fg, bgcolor: tone.blue.bg }}>
              Nuevo
            </Typography>
          )}
        </Box>
        <Typography component="span" sx={{ display: "block", mt: 0.25, fontSize: 12.5, lineHeight: 1.5, color: "text.secondary", overflowWrap: "anywhere" }}>
          {aviso.texto}
        </Typography>
        <Typography component="span" sx={{ display: "block", mt: 0.4, fontSize: 11, color: "text.disabled" }}>
          {cuandoFue(aviso.creado_el)}
        </Typography>
      </Box>
      {aviso.enlace && <ArrowForwardRoundedIcon sx={{ flex: "none", alignSelf: "center", fontSize: 18, color: "text.disabled" }} />}
    </>
  );

  const filaSx = {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 1.5,
    px: 1.5,
    py: 1.25,
    borderRadius: 2.5,
    textAlign: "left",
    border: "0.5px solid",
    borderColor: aviso.leido ? "divider" : tone.blue.border,
    bgcolor: aviso.leido ? "transparent" : "action.hover",
  } as const;

  return interactiva ? (
    <ButtonBase onClick={() => onAbrir(aviso)} sx={{ ...filaSx, "&:hover": { bgcolor: "action.selected" }, "&:focus-visible": { outline: "2px solid", outlineColor: tone.blue.main, outlineOffset: 2 } }}>
      {contenido}
    </ButtonBase>
  ) : (
    <Box sx={filaSx}>{contenido}</Box>
  );
}
