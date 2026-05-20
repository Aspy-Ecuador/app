// aspy-web/src/components/landing/AspyBandSection.tsx
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import aspyBanda from "@/assets/Aspy-banda.jpeg";
import { C, openLink } from "./constants";

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

const SocialBtn = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.1, 2.8),
  borderRadius: 50,
  border: "1.5px solid",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: "0.88rem",
  transition: "all 0.2s ease",
  userSelect: "none",
}));

// ─── FadeSection ────────────────────────────────────────────────
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
export default function AspyBandSection() {
  return (
    <FadeSection id="aspyband">
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
            borderRadius: 5,
            background: `linear-gradient(135deg, ${C.darkBg} 0%, #1B3A52 100%)`,
            p: { xs: 4, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: { xs: 4, md: 7 },
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Círculos decorativos */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `${C.blue}12`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: "35%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `${C.pink}10`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              right: "12%",
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `${C.yellow}15`,
            }}
          />

          {/* Foto */}
          <PhotoCard
            sx={{
              width: { xs: "100%", md: 320 },
              height: { xs: 220, md: 300 },
              flexShrink: 0,
              zIndex: 1,
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
            }}
          >
            <img src={aspyBanda} alt="ASPY Band" />
          </PhotoCard>

          {/* Texto */}
          <Box sx={{ zIndex: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: `${C.yellow}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MusicNoteRoundedIcon sx={{ color: C.yellow, fontSize: 20 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{ color: C.yellow, letterSpacing: 2, fontWeight: 700 }}
              >
                Proyecto especial
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#fff",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                mb: 2,
                lineHeight: 1.15,
              }}
            >
              ASPY{" "}
              <Box component="span" sx={{ color: C.pink }}>
                Band
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.88,
                mb: 3.5,
                maxWidth: 480,
              }}
            >
              Un grupo musical formado íntegramente por jóvenes con Síndrome de
              Asperger. La música se convierte en terapia, en lenguaje común y
              en puente hacia la inclusión social. ASPY Band no solo toca —
              demuestra que el talento no tiene límites.
            </Typography>

            <SocialBtn
              onClick={openLink("https://www.instagram.com/aspy_band/")}
              sx={{
                color: C.pink,
                borderColor: `${C.pink}66`,
                "&:hover": { background: `${C.pink}22`, borderColor: C.pink },
              }}
            >
              <InstagramIcon sx={{ fontSize: 19 }} />
              Seguir a ASPY Band
            </SocialBtn>
          </Box>
        </Box>
      </Box>
    </FadeSection>
  );
}