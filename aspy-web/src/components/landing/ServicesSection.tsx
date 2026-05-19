// aspy-web/src/components/landing/ServicesSection.tsx
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { C, services, fadeUp } from "./constants";

// ─── Styled ──────────────────────────────────────────────────────
const ServiceCard = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: 20,
  padding: theme.spacing(3, 3.5),
  border: `1px solid ${C.border}`,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  transition: "transform 0.22s ease, box-shadow 0.22s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: `0 14px 40px rgba(91,184,212,0.16)`,
  },
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
export default function ServicesSection() {
  return (
    <FadeSection id="servicios">
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 3, md: 6 },
          py: { xs: 8, md: 11 },
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1.5 }}
          >
            <Box sx={{ width: 20, height: 4, borderRadius: 2, background: C.blue }} />
            <Box sx={{ width: 20, height: 4, borderRadius: 2, background: C.pink }} />
            <Box sx={{ width: 20, height: 4, borderRadius: 2, background: C.yellow }} />
          </Box>
          <Typography
            variant="overline"
            sx={{ color: C.muted, letterSpacing: 2, fontWeight: 700 }}
          >
            Qué hacemos
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: C.black,
              mt: 0.5,
              fontSize: { xs: "1.7rem", md: "2rem" },
            }}
          >
            Nuestros servicios
          </Typography>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              sx={{ animation: `${fadeUp} 0.6s ease ${i * 0.08}s both` }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "14px",
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: C.black }}
              >
                {s.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: C.muted, lineHeight: 1.8 }}
              >
                {s.desc}
              </Typography>
            </ServiceCard>
          ))}
        </Box>
      </Box>
    </FadeSection>
  );
}