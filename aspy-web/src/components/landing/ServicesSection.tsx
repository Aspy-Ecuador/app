// aspy-web/src/components/landing/ServicesSection.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LandingContent } from "@/content/landing/types";
import { ACCENTS, C, DISPLAY_FONT, SERVICE_ICONS, reducedMotion } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

export default function ServicesSection({ content }: { content: LandingContent["services"] }) {
  if (content.items.length === 0) return null;

  return (
    <Section id="servicios" label="Servicios" sx={{ bgcolor: C.card }}>
      <Reveal>
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      </Reveal>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {content.items.map((s, i) => {
          const Icon = SERVICE_ICONS[s.icon] ?? SERVICE_ICONS.heart;
          const accent = ACCENTS[s.accent] ?? ACCENTS.blue;
          return (
            <Box component="li" key={s.title}>
              <Reveal delay={(i % 3) * 0.08} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "22px",
                    bgcolor: C.offWhite,
                    border: "1px solid",
                    borderColor: C.border,
                    overflow: "hidden",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: accent.main,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.35s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 18px 40px ${accent.main}2E`,
                      borderColor: `${accent.main}66`,
                    },
                    "&:hover::before": { transform: "scaleX(1)" },
                    ...reducedMotion,
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: accent.soft,
                      color: accent.dark,
                      mb: 2.25,
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "1.12rem", color: C.black, mb: 1 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ color: C.muted, fontSize: "0.95rem", lineHeight: 1.75 }}>{s.description}</Typography>
                </Box>
              </Reveal>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
