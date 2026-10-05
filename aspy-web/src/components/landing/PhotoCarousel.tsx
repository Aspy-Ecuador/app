// Carrusel de fotos: avance automático, flechas, puntos y deslizamiento táctil.
// Con una sola foto se muestra fija, sin controles.
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Box from "@mui/material/Box";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { LandingImage } from "@/content/landing/types";
import { focusRing, reducedMotion } from "./constants";

interface PhotoCarouselProps {
  images: LandingImage[];
  /** Nombre del carrusel para lectores de pantalla. */
  label: string;
  /** Segundos entre fotos. */
  intervalSeconds?: number;
  accent?: string;
}

const arrowSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  border: 0,
  p: 0,
  cursor: "pointer",
  color: "#1A1A2E",
  bgcolor: "rgba(255,255,255,0.88)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  backdropFilter: "blur(6px)",
  transition: "background-color 0.2s, transform 0.2s",
  "&:hover": { bgcolor: "#fff", transform: "translateY(-50%) scale(1.06)" },
  ...focusRing,
} as const;

export default function PhotoCarousel({ images, label, intervalSeconds = 4.5, accent = "#E8A0B0" }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const count = images.length;
  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Índice siempre dentro de rango aunque cambie la cantidad de fotos (contenido de Sanity)
  const current = count ? index % count : 0;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  // Avance automático (se pausa con el mouse encima, con la pestaña oculta o con "reducir movimiento")
  useEffect(() => {
    if (count < 2 || paused || reduced) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % count);
    }, intervalSeconds * 1000);
    return () => window.clearInterval(id);
  }, [count, paused, reduced, intervalSeconds]);

  if (count === 0) return null;

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <Box
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Pista de fotos */}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)",
          ...reducedMotion,
        }}
      >
        {images.map((img, i) => (
          <Box
            key={img.src + i}
            role="group"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={i !== current}
            sx={{ flex: "0 0 100%", height: "100%" }}
          >
            <Box
              component="img"
              src={img.src}
              alt={img.alt}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", userSelect: "none" }}
            />
          </Box>
        ))}
      </Box>

      {count > 1 && (
        <>
          <Box component="button" type="button" aria-label="Foto anterior" onClick={() => go(current - 1)} sx={{ ...arrowSx, left: 12 }}>
            <ChevronLeftRoundedIcon />
          </Box>
          <Box component="button" type="button" aria-label="Foto siguiente" onClick={() => go(current + 1)} sx={{ ...arrowSx, right: 12 }}>
            <ChevronRightRoundedIcon />
          </Box>

          {/* Puntos */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              gap: 0.75,
            }}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                component="button"
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === current}
                onClick={() => go(i)}
                sx={{
                  width: i === current ? 22 : 8,
                  height: 8,
                  p: 0,
                  border: 0,
                  borderRadius: 8,
                  cursor: "pointer",
                  bgcolor: i === current ? accent : "rgba(255,255,255,0.7)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  transition: "width 0.3s, background-color 0.3s",
                  ...focusRing,
                }}
              />
            ))}
          </Box>

          {/* Anuncio del cambio de foto para lectores de pantalla */}
          <Box aria-live="polite" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            {`Foto ${current + 1} de ${count}`}
          </Box>
        </>
      )}
    </Box>
  );
}
