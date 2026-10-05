// Aliados y donaciones. Cada bloque aparece solo si tiene contenido.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import type { LandingContent } from "@/content/landing/types";
import { C, DISPLAY_FONT, focusRing } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

export default function SupportSection({ content }: { content: LandingContent["support"] }) {
  const { partners, donation } = content;
  const hasDonation = donation.details.length > 0 || Boolean(donation.cta?.href);
  if (partners.length === 0 && !hasDonation) return null;

  return (
    <Section id="aliados" label="Aliados y donaciones" sx={{ bgcolor: C.card }}>
      <Reveal>
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      </Reveal>

      {partners.length > 0 && (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {partners.map((p, i) => {
            const hasLogo = Boolean(p.logo?.src);
            const inner = hasLogo ? (
              <Box
                component="img"
                src={p.logo!.src}
                alt={p.logo!.alt || p.name}
                loading="lazy"
                decoding="async"
                sx={{ maxHeight: 56, maxWidth: "100%", width: "auto", objectFit: "contain", display: "block" }}
              />
            ) : (
              <>
                <HandshakeRoundedIcon sx={{ color: C.blueDark, fontSize: 24, flexShrink: 0 }} />
                <Typography component="span" sx={{ fontWeight: 700, color: C.black, lineHeight: 1.3 }}>{p.name}</Typography>
              </>
            );
            const cardSx = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
              // Tamaño parejo para que logos anchos y cuadrados se vean uniformes
              width: { xs: 150, sm: 190 },
              height: { xs: 84, sm: 100 },
              px: 2.5,
              borderRadius: "18px",
              // Los logos casi siempre están pensados para fondo blanco: recuadro blanco también en modo oscuro
              bgcolor: hasLogo ? "#FFFFFF" : C.offWhite,
              border: "1px solid",
              borderColor: hasLogo ? "rgba(26,26,46,0.08)" : C.border,
              boxShadow: hasLogo ? "0 6px 18px rgba(18,38,58,0.06)" : "none",
              textAlign: "center",
              textDecoration: "none",
              transition: "border-color 0.2s, transform 0.2s",
              "&:hover": { borderColor: `${C.blue}88`, transform: "translateY(-2px)" },
              ...focusRing,
            };
            return (
              <li key={p.name}>
                <Reveal delay={i * 0.06}>
                  {p.url ? (
                    <Box component="a" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name} title={p.name} sx={cardSx}>
                      {inner}
                    </Box>
                  ) : (
                    <Box title={p.name} sx={cardSx}>{inner}</Box>
                  )}
                </Reveal>
              </li>
            );
          })}
        </Box>
      )}

      {hasDonation && (
        <Reveal sx={{ mt: partners.length ? { xs: 6, md: 8 } : 0 }}>
          <Box
            sx={{
              maxWidth: 880,
              mx: "auto",
              p: { xs: 3.5, md: 5 },
              borderRadius: "28px",
              background: `linear-gradient(135deg, ${C.blueLight}, ${C.pinkLight} 55%, ${C.yellowLight})`,
              border: "1px solid",
              borderColor: C.border,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              gap: { xs: 3, md: 5 },
              alignItems: "center",
            }}
          >
            <Box>
              <VolunteerActivismRoundedIcon sx={{ fontSize: 40, color: C.pinkDark, mb: 1.5 }} />
              <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.8rem" }, color: C.black, mb: 1.25 }}>
                {donation.title}
              </Typography>
              <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>{donation.description}</Typography>
              {donation.cta?.href && (
                <Box
                  component="a"
                  href={donation.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    mt: 3,
                    px: 3,
                    py: 1.3,
                    borderRadius: 50,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                    background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                    ...focusRing,
                  }}
                >
                  {donation.cta.label}
                </Box>
              )}
            </Box>
            {donation.details.length > 0 && (
              <Box component="dl" sx={{ m: 0, p: 3, borderRadius: "20px", bgcolor: C.card, border: "1px solid", borderColor: C.border }}>
                {donation.details.map((d) => (
                  <Box key={d.label} sx={{ "&:not(:last-of-type)": { mb: 1.75 } }}>
                    <Typography component="dt" sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>
                      {d.label}
                    </Typography>
                    <Typography component="dd" sx={{ m: 0, fontWeight: 600, color: C.black, wordBreak: "break-word" }}>
                      {d.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Reveal>
      )}
    </Section>
  );
}
