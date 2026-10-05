// Testimonios: se muestra solo si el CMS tiene testimonios reales.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import type { LandingContent } from "@/content/landing/types";
import { C } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

const COLORS = [C.blue, C.pink, C.yellow];

export default function TestimonialsSection({ content }: { content: LandingContent["testimonials"] }) {
  if (content.items.length === 0) return null;

  return (
    <Section id="testimonios" label="Testimonios" sx={{ bgcolor: C.card }}>
      <Reveal>
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
      </Reveal>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
        {content.items.map((t, i) => (
          <Reveal key={t.author + i} delay={(i % 3) * 0.1} sx={{ height: "100%" }}>
            <Box
              component="figure"
              sx={{
                m: 0,
                height: "100%",
                p: 3.5,
                borderRadius: "22px",
                bgcolor: C.offWhite,
                border: "1px solid",
                borderColor: C.border,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormatQuoteRoundedIcon sx={{ fontSize: 40, color: COLORS[i % 3], mb: 1 }} />
              <Box component="blockquote" sx={{ m: 0, flex: 1 }}>
                <Typography sx={{ color: C.black, fontSize: "1.02rem", lineHeight: 1.8 }}>{t.quote}</Typography>
              </Box>
              <Box component="figcaption" sx={{ mt: 2.5 }}>
                <Typography sx={{ fontWeight: 700, color: C.black }}>{t.author}</Typography>
                {t.role && <Typography sx={{ fontSize: "0.88rem", color: C.muted }}>{t.role}</Typography>}
              </Box>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
}
