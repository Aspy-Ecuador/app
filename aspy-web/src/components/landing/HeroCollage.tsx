// Collage de fotos del hero: 1 foto principal + 2 secundarias que se van turnando.
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { LandingImage } from "@/content/landing/types";
import { responsiveImg } from "@/content/landing/images";
import { C, float, reducedMotion } from "./constants";

const CHIP_COLORS = [C.blue, C.pink, C.yellow];

// Posición de cada marco dentro del collage (porcentajes del contenedor)
const FRAMES = [
  { left: "0%", top: "9%", width: "72%", height: "80%", rotate: -2, z: 2, radius: "28px" },
  { right: "0%", top: "0%", width: "46%", height: "44%", rotate: 4, z: 3, radius: "22px" },
  { right: "3%", bottom: "0%", width: "50%", height: "46%", rotate: -3, z: 3, radius: "22px" },
] as const;

// Lugares de las etiquetas flotantes
const CHIP_SPOTS = [
  { top: "4%", left: { xs: "-2%", md: "-8%" } },
  { top: "50%", right: { xs: "-2%", md: "-6%" } },
  { bottom: "8%", left: { xs: "2%", md: "-4%" } },
];

function usePrefersReducedMotion() {
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  return reduced;
}

interface HeroCollageProps {
  images: LandingImage[];
  chips: string[];
  /** Segundos entre cambios. */
  rotationSeconds: number;
}

export default function HeroCollage({ images, chips, rotationSeconds }: HeroCollageProps) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const frames = FRAMES.slice(0, Math.min(images.length, FRAMES.length));
  const rotates = images.length > 1 && !reduced;

  useEffect(() => {
    if (!rotates || paused) return;
    const ms = Math.max(2, rotationSeconds || 5) * 1000;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setOffset((o) => (o + 1) % images.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [rotates, paused, rotationSeconds, images.length]);

  if (images.length === 0) return null;

  // Con una sola foto, el marco principal ocupa todo
  const single = images.length === 1;

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: "relative", width: "100%", aspectRatio: single ? "1 / 1.02" : "1 / 1.05" }}
    >
      {/* Fondo de color detrás de la foto principal */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          ...(single ? { inset: 0 } : { left: "0%", top: "9%", width: "72%", height: "80%" }),
          borderRadius: "30px",
          background: `linear-gradient(135deg, ${C.blue}, ${C.pink} 55%, ${C.yellow})`,
          transform: { xs: "rotate(4deg) translate(6px, 8px)", md: "rotate(5deg) translate(14px, 10px)" },
          opacity: 0.9,
        }}
      />

      {frames.map((frame, slot) => {
        const { rotate, z, radius, ...pos } = frame;
        return (
          <Box
            key={slot}
            sx={{
              position: "absolute",
              ...(single ? { inset: 0 } : pos),
              zIndex: z,
              transform: `rotate(${single ? 0 : rotate}deg)`,
              borderRadius: radius,
              overflow: "hidden",
              border: slot === 0 ? "6px solid rgba(255,255,255,0.12)" : "5px solid rgba(255,255,255,0.9)",
              boxShadow: slot === 0 ? "0 30px 60px rgba(0,0,0,0.45)" : "0 18px 40px rgba(0,0,0,0.4)",
              bgcolor: C.darkBg2,
            }}
          >
            {/* Todas las fotos apiladas: solo la que toca en este marco es visible (fundido) */}
            {images.map((img, i) => {
              const n = images.length;
              const current = (offset + slot) % n;
              const visible = current === i;
              // Solo se montan la foto actual, la anterior (para el fundido) y la siguiente (precarga)
              if (n > 3 && i !== current && i !== (current + 1) % n && i !== (current - 1 + n) % n) return null;
              return (
                <Box
                  key={img.src + i}
                  component="img"
                  {...responsiveImg(img.src, "(min-width: 900px) 380px, 75vw")}
                  alt={visible ? img.alt : ""}
                  aria-hidden={!visible}
                  loading={slot === 0 && i === 0 ? "eager" : "lazy"}
                  // La primera foto es lo más grande de la portada: se pide con prioridad
                  fetchPriority={slot === 0 && i === 0 ? "high" : "auto"}
                  decoding="async"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(1.06)",
                    transition: "opacity 1.1s ease, transform 6s ease",
                    ...reducedMotion,
                  }}
                />
              );
            })}
          </Box>
        );
      })}

      {chips.slice(0, 3).map((chip, i) => (
        <Box
          key={chip}
          sx={{
            position: "absolute",
            zIndex: 4,
            ...CHIP_SPOTS[i],
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.75,
            py: 1,
            borderRadius: 50,
            bgcolor: C.card,
            color: C.black,
            fontWeight: 700,
            fontSize: { xs: "0.8rem", md: "0.88rem" },
            boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
            animation: `${float} ${6 + i}s ease-in-out ${i * 0.8}s infinite`,
            ...reducedMotion,
          }}
        >
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: CHIP_COLORS[i % 3] }} />
          {chip}
        </Box>
      ))}
    </Box>
  );
}
