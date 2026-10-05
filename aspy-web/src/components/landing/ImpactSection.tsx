// Cifras de impacto: se muestra solo si el CMS tiene datos reales.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LandingContent, ServiceIconName } from "@/content/landing/types";
import { ACCENTS, C, DISPLAY_FONT, SERVICE_ICONS, reducedMotion } from "./constants";
import { Reveal } from "./shared";
import CountUp from "./CountUp";

// Colores e íconos que se turnan si la fundación no elige un ícono
const ACCENT_CYCLE = [ACCENTS.blue, ACCENTS.pink, ACCENTS.yellow, ACCENTS.blue];
const ICON_CYCLE: ServiceIconName[] = ["heart", "groups", "school", "family"];

export default function ImpactSection({ content }: { content: LandingContent["impact"] }) {
  const stats = content.stats;
  if (stats.length === 0) return null;

  return (
    <Box
      component="section"
      aria-label="Nuestro impacto"
      sx={{ position: "relative", zIndex: 2, mt: { xs: -6, md: -10 }, px: { xs: 2.5, sm: 4, md: 5 } }}
    >
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          // Con pocas cifras, tarjetas de ancho razonable y centradas
          maxWidth: { xs: 1100, md: Math.min(stats.length, 4) * 280 },
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${Math.min(stats.length, 4)}, 1fr)` },
          gap: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        {stats.map((stat, i) => {
          const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
          const Icon = SERVICE_ICONS[stat.icon ?? ICON_CYCLE[i % ICON_CYCLE.length]] ?? SERVICE_ICONS.heart;
          return (
            <Box component="li" key={stat.label + i} sx={{ minWidth: 0 }}>
              <Reveal delay={i * 0.08} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                    p: { xs: 2.25, sm: 3 },
                    borderRadius: "24px",
                    bgcolor: C.card,
                    border: "1px solid",
                    borderColor: C.border,
                    boxShadow: "0 18px 40px rgba(18,38,58,0.10)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    // Brillo suave del color de la tarjeta en la esquina
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -60,
                      right: -60,
                      width: 160,
                      height: 160,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${accent.main}40, transparent 70%)`,
                      pointerEvents: "none",
                    },
                    // Línea de color en la base
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 24,
                      right: 24,
                      bottom: 0,
                      height: 3,
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${accent.main}, transparent)`,
                    },
                    "&:hover": { transform: "translateY(-4px)", boxShadow: `0 24px 48px ${accent.main}33` },
                    ...reducedMotion,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 40, sm: 46 },
                      height: { xs: 40, sm: 46 },
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: accent.soft,
                      color: accent.dark,
                      mb: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 22, sm: 24 } }} />
                  </Box>
                  <Typography
                    component="p"
                    sx={{
                      position: "relative",
                      fontFamily: DISPLAY_FONT,
                      fontWeight: 800,
                      fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.6rem" },
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: C.black,
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <CountUp value={stat.value} affixColor={accent.dark} />
                  </Typography>
                  <Typography
                    sx={{
                      position: "relative",
                      mt: 1,
                      fontSize: { xs: "0.82rem", sm: "0.92rem" },
                      lineHeight: 1.45,
                      color: C.muted,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Reveal>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
