// aspy-web/src/components/landing/MissionSection.tsx
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import aspy1 from "@/assets/Aspy1.jpeg";
import aspy2 from "@/assets/Aspy2.jpeg";
import aspy3 from "@/assets/Aspy3.jpeg";
import { C } from "./constants";

// ─── Styled ──────────────────────────────────────────────────────
const PhotoCard = styled(Box)({
  borderRadius: 18,
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
  },
  "&:hover img": { transform: "scale(1.06)" },
});

// ─── FadeSection (animación al entrar en viewport) ───────────────
function FadeSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      id={id}
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </Box>
  );
}

// ─── Componente ──────────────────────────────────────────────────
export default function MissionSection() {
  return (
    <FadeSection id="nosotros">
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 3, md: 6 },
          py: { xs: 8, md: 11 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 6, md: 9 },
            alignItems: "center",
          }}
        >
          {/* Texto */}
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
            >
              <Box
                sx={{ width: 36, height: 4, borderRadius: 2, background: C.blue }}
              />
              <Typography
                variant="overline"
                sx={{ color: C.blue, letterSpacing: 2, fontWeight: 700 }}
              >
                Nuestra misión
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: C.black,
                lineHeight: 1.25,
                mb: 2.5,
                fontSize: { xs: "1.7rem", md: "2rem" },
              }}
            >
              Inclusión, dignidad y oportunidad para todos
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: C.muted, lineHeight: 1.9, mb: 2 }}
            >
              ASPY nació con el propósito de brindar atención integral a personas
              con discapacidad, especialmente a niños, adolescentes y jóvenes
              dentro del espectro autista (incluyendo Síndrome de Asperger),
              ofreciéndoles herramientas reales para desarrollar sus capacidades y
              participar plenamente en la sociedad.
            </Typography>

            <Typography variant="body1" sx={{ color: C.muted, lineHeight: 1.9 }}>
              A través de alianzas con el Municipio de Guayaquil y otras
              instituciones, la fundación ejecuta programas de rehabilitación,
              arte, tecnología y capacitación que transforman vidas y fortalecen
              comunidades.
            </Typography>
          </Box>

          {/* Galería asimétrica */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: { xs: "180px 140px", md: "220px 160px" },
              gap: 2,
            }}
          >
            <PhotoCard
              sx={{
                gridColumn: "1",
                gridRow: "1",
                boxShadow: `0 6px 24px ${C.blue}25`,
              }}
            >
              <img src={aspy1} alt="Actividades ASPY" />
            </PhotoCard>
            <PhotoCard
              sx={{
                gridColumn: "2",
                gridRow: "1 / 3",
                boxShadow: `0 6px 24px ${C.pink}25`,
              }}
            >
              <img src={aspy2} alt="Inclusión ASPY" />
            </PhotoCard>
            <PhotoCard
              sx={{
                gridColumn: "1",
                gridRow: "2",
                boxShadow: `0 6px 24px ${C.yellow}40`,
              }}
            >
              <img src={aspy3} alt="Comunidad ASPY" />
            </PhotoCard>
          </Box>
        </Box>
      </Box>
    </FadeSection>
  );
}