// Visor de fotos a pantalla completa: se abre al tocar una foto (hoy, las de los servicios) para verla
// en grande, con su título y su texto. Si hay varias, se pasa de una a otra con las flechas, el teclado
// o deslizando el dedo. Se cierra con la ✕, con Escape o tocando fuera de la foto.
// Siempre es oscuro, en modo claro y en modo oscuro: es el fondo que mejor deja ver una foto.
import { useRef } from "react";
import type { PointerEvent } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { responsiveImg } from "@/content/landing/images";
import { DISPLAY_FONT, focusRing, reducedMotion } from "./constants";

export interface FotoDelVisor {
  src: string;
  alt: string;
  titulo: string;
  descripcion?: string;
}

interface VisorFotoProps {
  fotos: FotoDelVisor[];
  /** Cuál se está viendo; null = cerrado. */
  indice: number | null;
  onCambiar: (indice: number) => void;
  onCerrar: () => void;
}

const botonSx = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  border: 0,
  p: 0,
  cursor: "pointer",
  color: "#1A1A2E",
  bgcolor: "rgba(255,255,255,0.92)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
  transition: "background-color 0.2s, transform 0.2s",
  "&:hover": { bgcolor: "#fff" },
  ...focusRing,
  ...reducedMotion,
} as const;

export default function VisorFoto({ fotos, indice, onCambiar, onCerrar }: VisorFotoProps) {
  const reducido = useMediaQuery("(prefers-reduced-motion: reduce)");
  const inicioX = useRef<number | null>(null);
  const total = fotos.length;
  const actual = indice !== null && indice >= 0 && indice < total ? indice : null;
  const foto = actual !== null ? fotos[actual] : null;
  const ir = (paso: number) => {
    if (actual !== null && total > 1) onCambiar((actual + paso + total) % total);
  };

  // Deslizar el dedo (o arrastrar) hacia los lados pasa de foto
  const alSoltar = (e: PointerEvent) => {
    const inicio = inicioX.current;
    inicioX.current = null;
    if (inicio === null) return;
    const distancia = e.clientX - inicio;
    if (Math.abs(distancia) > 50) ir(distancia < 0 ? 1 : -1);
  };

  return (
    <Dialog
      open={foto !== null}
      onClose={onCerrar}
      fullScreen
      aria-labelledby="visor-foto-titulo"
      transitionDuration={reducido ? 0 : 220}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(1);
        if (e.key === "ArrowLeft") ir(-1);
      }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "rgba(9, 15, 24, 0.96)",
            backgroundImage: "none",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            // En el celular, sin que la barra del navegador tape el pie
            pb: "env(safe-area-inset-bottom, 0px)",
          },
        },
      }}
    >
      {foto && (
        <>
          {/* Arriba: cuál foto es y el botón de cerrar */}
          <Box sx={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 }, pb: 1 }}>
            <Typography aria-live="polite" sx={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.75)" }}>
              {total > 1 ? `${(actual ?? 0) + 1} / ${total}` : ""}
            </Typography>
            <Box component="button" type="button" autoFocus onClick={onCerrar} aria-label="Cerrar la foto" sx={botonSx}>
              <CloseRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          {/* La foto ocupa todo el espacio que queda, sin recortarse ni deformarse */}
          <Box
            onClick={onCerrar}
            onPointerDown={(e) => {
              inicioX.current = e.clientX;
            }}
            onPointerUp={alSoltar}
            onPointerCancel={() => {
              inicioX.current = null;
            }}
            sx={{
              position: "relative",
              flex: "1 1 auto",
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gridTemplateRows: "minmax(0, 1fr)",
              placeItems: "center",
              px: { xs: 1.5, sm: 9 },
              touchAction: "pan-y",
              cursor: "zoom-out",
            }}
          >
            <Box
              component="img"
              key={foto.src}
              {...responsiveImg(foto.src, "100vw")}
              alt={foto.alt}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: { xs: "12px", sm: "16px" },
                boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
                cursor: "default",
                userSelect: "none",
                "@keyframes visorAparece": { from: { opacity: 0, transform: "scale(0.98)" }, to: { opacity: 1, transform: "none" } },
                animation: "visorAparece 0.25s ease",
                ...reducedMotion,
              }}
            />

            {total > 1 && (
              <>
                <Box
                  component="button"
                  type="button"
                  aria-label="Foto anterior"
                  onClick={(e) => {
                    e.stopPropagation();
                    ir(-1);
                  }}
                  sx={{ ...botonSx, position: "absolute", left: { xs: 8, sm: 16 }, top: "50%", transform: "translateY(-50%)", "&:hover": { bgcolor: "#fff", transform: "translateY(-50%) scale(1.06)" } }}
                >
                  <ChevronLeftRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box
                  component="button"
                  type="button"
                  aria-label="Foto siguiente"
                  onClick={(e) => {
                    e.stopPropagation();
                    ir(1);
                  }}
                  sx={{ ...botonSx, position: "absolute", right: { xs: 8, sm: 16 }, top: "50%", transform: "translateY(-50%)", "&:hover": { bgcolor: "#fff", transform: "translateY(-50%) scale(1.06)" } }}
                >
                  <ChevronRightRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
              </>
            )}
          </Box>

          {/* Abajo: de qué es la foto */}
          <Box sx={{ flex: "none", width: "100%", maxWidth: 860, mx: "auto", px: { xs: 2.5, sm: 4 }, pt: { xs: 1.75, sm: 2.25 }, pb: { xs: 2.25, sm: 3 }, textAlign: "center" }}>
            <Typography id="visor-foto-titulo" component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: { xs: "1.05rem", sm: "1.25rem" }, lineHeight: 1.3, color: "#fff" }}>
              {foto.titulo}
            </Typography>
            {foto.descripcion && (
              <Typography sx={{ mt: 0.75, fontSize: { xs: "0.88rem", sm: "0.95rem" }, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", display: "-webkit-box", WebkitLineClamp: { xs: 4, sm: 6 }, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{foto.descripcion}</Typography>
            )}
          </Box>
        </>
      )}
    </Dialog>
  );
}
