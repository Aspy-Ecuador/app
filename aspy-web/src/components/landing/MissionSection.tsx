// aspy-web/src/components/landing/MissionSection.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LandingContent } from "@/content/landing/types";
import { responsiveImg } from "@/content/landing/images";
import { C } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

const SHADOWS = [C.blue, C.pink, C.yellow];
// Galería asimétrica: 1ª arriba-izq, 2ª columna derecha completa, 3ª abajo-izq
const POSITIONS = [
  { gridColumn: "1", gridRow: "1" },
  { gridColumn: "2", gridRow: "1 / 3" },
  { gridColumn: "1", gridRow: "2" },
];

export default function MissionSection({ content }: { content: LandingContent["mission"] }) {
  const images = content.images.slice(0, 3);

  return (
    <Section id="nosotros" label="Nuestra misión" sx={{ bgcolor: C.offWhite }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: images.length ? "1fr 1fr" : "1fr" },
          gap: { xs: 6, md: 9 },
          alignItems: "center",
        }}
      >
        <Reveal>
          <SectionHeader eyebrow={content.eyebrow} title={content.title} align="left" />
          <Box sx={{ mt: { xs: -2, md: -3 }, display: "flex", flexDirection: "column", gap: 2.25 }}>
            {content.paragraphs.map((p) => (
              <Typography key={p.slice(0, 24)} sx={{ color: C.muted, fontSize: "1.02rem", lineHeight: 1.85 }}>
                {p}
              </Typography>
            ))}
          </Box>
        </Reveal>

        {images.length > 0 && (
          <Reveal delay={0.15}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: { xs: "170px 140px", sm: "220px 170px", md: "240px 190px" },
                gap: 2,
              }}
            >
              {images.map((img, i) => (
                <Box
                  key={img.src}
                  sx={{
                    ...POSITIONS[i],
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: `0 10px 30px ${SHADOWS[i]}33`,
                    "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" },
                    "&:hover img": { transform: "scale(1.05)" },
                  }}
                >
                  <img
                    {...responsiveImg(img.src, "(min-width: 900px) 280px, 50vw")}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </Box>
              ))}
            </Box>
          </Reveal>
        )}
      </Box>
    </Section>
  );
}
