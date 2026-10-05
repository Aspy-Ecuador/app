// aspy-web/src/components/landing/AspyBandSection.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import type { LandingContent } from "@/content/landing/types";
import { C, DISPLAY_FONT, focusRing } from "./constants";
import { Reveal, Section } from "./shared";

export default function AspyBandSection({ content }: { content: LandingContent["band"] }) {
  const i = content.highlight ? content.title.lastIndexOf(content.highlight) : -1;

  return (
    <Section id="aspyband" label="ASPY Band" sx={{ bgcolor: C.offWhite }}>
      <Reveal>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "26px", md: "36px" },
            background: `radial-gradient(600px 300px at 90% 0%, ${C.pink}30, transparent 60%),
              linear-gradient(135deg, ${C.darkBg} 0%, ${C.darkBg2} 100%)`,
            border: "1px solid rgba(255,255,255,0.08)",
            p: { xs: 3.5, sm: 5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: { xs: 4, md: 7 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
              aspectRatio: { xs: "4 / 3", md: "1 / 1" },
              "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" },
              "&:hover img": { transform: "scale(1.05)" },
            }}
          >
            <img src={content.image.src} alt={content.image.alt} loading="lazy" decoding="async" />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: "12px", bgcolor: `${C.yellow}28`, display: "grid", placeItems: "center" }}>
                <MusicNoteRoundedIcon sx={{ color: C.yellow, fontSize: 21 }} />
              </Box>
              <Typography component="span" sx={{ color: C.yellow, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {content.eyebrow}
              </Typography>
            </Box>

            <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, color: "#fff", fontSize: { xs: "2rem", md: "2.8rem" }, lineHeight: 1.1, letterSpacing: "-0.02em", mb: 2 }}>
              {i < 0 ? (
                content.title
              ) : (
                <>
                  {content.title.slice(0, i)}
                  <Box component="span" sx={{ color: C.pink }}>{content.highlight}</Box>
                  {content.title.slice(i + content.highlight.length)}
                </>
              )}
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.85, fontSize: { xs: "1rem", md: "1.05rem" }, mb: 4, maxWidth: 520 }}>
              {content.description}
            </Typography>

            {content.link.href && (
              <Box
                component="a"
                href={content.link.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.75,
                  py: 1.25,
                  borderRadius: 50,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  color: C.pink,
                  border: `1.5px solid ${C.pink}77`,
                  transition: "background-color 0.2s, border-color 0.2s",
                  "&:hover": { bgcolor: `${C.pink}22`, borderColor: C.pink },
                  ...focusRing,
                }}
              >
                <InstagramIcon sx={{ fontSize: 19 }} />
                {content.link.label}
              </Box>
            )}
          </Box>
        </Box>
      </Reveal>
    </Section>
  );
}
