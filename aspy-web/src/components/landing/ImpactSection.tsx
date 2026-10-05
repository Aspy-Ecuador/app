// Cifras de impacto: se muestra solo si el CMS tiene datos reales.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LandingContent } from "@/content/landing/types";
import { C, DISPLAY_FONT } from "./constants";
import { Reveal } from "./shared";

export default function ImpactSection({ content }: { content: LandingContent["impact"] }) {
  if (content.stats.length === 0) return null;

  return (
    <Box component="section" aria-label="Nuestro impacto" sx={{ position: "relative", zIndex: 2, mt: { xs: -5, md: -8 }, px: { xs: 2.5, sm: 4, md: 5 } }}>
      <Reveal>
        <Box
          sx={{
            maxWidth: 1080,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${Math.min(content.stats.length, 4)}, 1fr)` },
            gap: { xs: 2.5, md: 0 },
            py: { xs: 3, md: 3.5 },
            px: { xs: 2.5, md: 2 },
            borderRadius: "24px",
            bgcolor: C.card,
            border: "1px solid",
            borderColor: C.border,
            boxShadow: "0 20px 50px rgba(18,38,58,0.12)",
          }}
        >
          {content.stats.map((stat, i) => (
            <Box
              key={stat.label}
              sx={{
                textAlign: "center",
                px: 2,
                borderLeft: { md: i === 0 ? "none" : "1px solid" },
                borderColor: { md: C.border },
              }}
            >
              <Typography
                sx={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 800,
                  fontSize: { xs: "1.9rem", md: "2.4rem" },
                  lineHeight: 1.1,
                  color: "transparent",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  backgroundImage: `linear-gradient(90deg, ${C.blueDark}, ${C.pinkDark})`,
                }}
              >
                {stat.value}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: "0.88rem", color: C.muted }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Reveal>
    </Box>
  );
}
