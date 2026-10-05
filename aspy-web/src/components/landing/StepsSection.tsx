// "Cómo agendar": el proceso real del sistema en pasos.
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { LandingContent } from "@/content/landing/types";
import { C, DISPLAY_FONT, focusRing } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

const STEP_ICONS = [PersonAddAltRoundedIcon, EventNoteRoundedIcon, VerifiedRoundedIcon];
const STEP_COLORS = [C.blue, C.pink, C.yellow];

interface StepsSectionProps {
  content: LandingContent["steps"];
  ctaHref?: string;
}

export default function StepsSection({ content, ctaHref = "/register" }: StepsSectionProps) {
  if (content.items.length === 0) return null;

  return (
    <Section id="como-agendar" label="Cómo agendar una cita" sx={{ bgcolor: C.offWhite }}>
      <Reveal>
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      </Reveal>

      <Box
        component="ol"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: `repeat(${content.items.length}, 1fr)` },
          gap: { xs: 3, md: 4 },
          // Línea que une los pasos (escritorio)
          "&::before": {
            content: '""',
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: 36,
            left: "16%",
            right: "16%",
            borderTop: `2px dashed ${C.border}`,
          },
        }}
      >
        {content.items.map((step, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          const color = STEP_COLORS[i % STEP_COLORS.length];
          return (
            <Box component="li" key={step.title} sx={{ position: "relative" }}>
              <Reveal delay={i * 0.12} sx={{ textAlign: { xs: "left", md: "center" }, display: { xs: "flex", md: "block" }, gap: 2.5, alignItems: "flex-start" }}>
                <Box sx={{ position: "relative", flexShrink: 0, width: 72, height: 72, mx: { md: "auto" }, mb: { md: 2.5 } }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "22px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: C.card,
                      border: `2px solid ${color}`,
                      color,
                      boxShadow: `0 10px 26px ${color}33`,
                    }}
                  >
                    <Icon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, ${C.blueDark}, ${C.darkBg2})`,
                      color: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </Box>
                </Box>
                <Box>
                  <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "1.15rem", color: C.black, mb: 0.75 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: C.muted, fontSize: "0.97rem", lineHeight: 1.75, maxWidth: { md: 300 }, mx: { md: "auto" } }}>
                    {step.description}
                  </Typography>
                </Box>
              </Reveal>
            </Box>
          );
        })}
      </Box>

      {content.ctaLabel && (
        <Reveal sx={{ textAlign: "center", mt: { xs: 6, md: 7 } }}>
          <Box
            component={RouterLink}
            to={ctaHref}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 3.5,
              py: 1.6,
              borderRadius: 50,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
              boxShadow: `0 10px 28px ${C.blue}4D`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "translateY(-2px)", boxShadow: `0 14px 34px ${C.blue}66` },
              ...focusRing,
            }}
          >
            {content.ctaLabel}
            <ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
          </Box>
        </Reveal>
      )}
    </Section>
  );
}
