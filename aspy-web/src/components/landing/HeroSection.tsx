// aspy-web/src/components/landing/HeroSection.tsx
import type { MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import isotipo from "@/assets/landing/isotipo-aspy.svg";
import type { LandingContent } from "@/content/landing/types";
import { C, DISPLAY_FONT, NAV_HEIGHT, fadeIn, fadeUp, float, focusRing, reducedMotion, scrollTo } from "./constants";
import { SocialIcon } from "./shared";
import HeroCollage from "./HeroCollage";

interface HeroSectionProps {
  content: LandingContent["hero"];
  social: LandingContent["social"];
  /** Muestra los botones "Agendar una cita" y "Conocer más". Default: true */
  showCtas?: boolean;
  /** Destino del botón principal (registro o panel si ya hay sesión). */
  primaryHref?: string;
}

/** Divide el título para pintar `highlight` con degradado. */
function renderTitle(title: string, highlight: string) {
  const i = highlight ? title.lastIndexOf(highlight) : -1;
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <Box
        component="span"
        sx={{
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.pink} 60%, ${C.yellow})`,
        }}
      >
        {highlight}
      </Box>
      {title.slice(i + highlight.length)}
    </>
  );
}

export default function HeroSection({ content, social, showCtas = true, primaryHref = "/register" }: HeroSectionProps) {
  const goToAbout = (e: MouseEvent) => {
    e.preventDefault();
    scrollTo("nosotros");
  };

  return (
    <Box
      component="section"
      id="hero"
      aria-label="Presentación"
      sx={{
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        background: `radial-gradient(900px 520px at 88% 18%, ${C.blue}2E, transparent 60%),
          radial-gradient(700px 480px at 6% 92%, ${C.pink}24, transparent 60%),
          linear-gradient(160deg, ${C.darkBg} 0%, ${C.darkBg2} 55%, #0F2233 100%)`,
        pt: `calc(${NAV_HEIGHT}px + 40px)`,
        pb: { xs: 12, md: 16 },
        minHeight: { md: "min(100vh, 900px)" },
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Isotipo gigante decorativo */}
      <Box
        component="img"
        src={isotipo}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 420, md: 720 },
          right: { xs: -180, md: -160 },
          top: { xs: -120, md: -140 },
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
          gap: { xs: 7, md: 8 },
          alignItems: "center",
        }}
      >
        {/* Texto */}
        <Box sx={{ animation: `${fadeUp} 0.9s ease both`, ...reducedMotion }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.75,
              py: 0.6,
              mb: 3,
              borderRadius: 50,
              border: `1px solid ${C.blue}55`,
              bgcolor: `${C.blue}1A`,
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: C.blue, boxShadow: `0 0 0 4px ${C.blue}33` }} />
            <Typography component="span" sx={{ fontSize: { xs: "0.7rem", sm: "0.76rem" }, color: "#BFE6F2", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {content.badge}
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: { xs: "2.9rem", sm: "3.6rem", md: "4.4rem" },
              lineHeight: 1.03,
              letterSpacing: "-0.035em",
            }}
          >
            {renderTitle(content.title, content.highlight)}
          </Typography>

          {content.tagline && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
              <Box sx={{ width: 32, height: 3, borderRadius: 2, bgcolor: C.yellow }} />
              <Typography sx={{ color: C.yellow, fontWeight: 600, fontSize: { xs: "1.05rem", md: "1.2rem" }, fontStyle: "italic" }}>
                {content.tagline}
              </Typography>
            </Box>
          )}

          <Typography
            sx={{
              mt: 3,
              maxWidth: 540,
              color: "rgba(255,255,255,0.8)",
              fontSize: { xs: "1.02rem", md: "1.12rem" },
              lineHeight: 1.8,
            }}
          >
            {content.description}
          </Typography>

          {showCtas && (
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 4.5 }}>
              <Box
                component={RouterLink}
                to={primaryHref}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 3.25,
                  py: 1.6,
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: C.darkBg,
                  textDecoration: "none",
                  bgcolor: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 14px 36px ${C.blue}55` },
                  ...focusRing,
                  ...reducedMotion,
                }}
              >
                <EventAvailableRoundedIcon sx={{ fontSize: 20, color: C.blueDark }} />
                {content.primaryCtaLabel}
              </Box>
              <Box
                component="a"
                href="#nosotros"
                onClick={goToAbout}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 3,
                  py: 1.6,
                  borderRadius: 50,
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#fff",
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  transition: "background-color 0.2s, border-color 0.2s",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.7)" },
                  ...focusRing,
                }}
              >
                {content.secondaryCtaLabel}
              </Box>
            </Box>
          )}

          {social.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4, flexWrap: "wrap", animation: `${fadeIn} 1s ease 0.5s both`, ...reducedMotion }}>
              <Typography component="span" sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                {content.socialLabel}
              </Typography>
              {social.map((s) => (
                <Box
                  key={s.url}
                  component="a"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    borderRadius: 1,
                    "&:hover": { color: C.blue },
                    ...focusRing,
                  }}
                >
                  <SocialIcon network={s.network} size={18} />
                  {s.label}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Collage de fotos (editable desde el CMS) */}
        <Box
          sx={{
            justifySelf: "center",
            width: "100%",
            maxWidth: { xs: 380, md: 500 },
            animation: `${fadeUp} 0.9s ease 0.2s both`,
            ...reducedMotion,
          }}
        >
          <HeroCollage images={content.images} chips={content.chips} rotationSeconds={content.rotationSeconds} />
        </Box>
      </Box>

      {/* Indicador de scroll (solo escritorio) */}
      {showCtas && (
        <Box
          component="a"
          href="#nosotros"
          onClick={goToAbout}
          aria-label="Bajar a la siguiente sección"
          sx={{
            display: { xs: "none", md: "grid" },
            placeItems: "center",
            position: "absolute",
            bottom: 72,
            left: "50%",
            ml: "-20px",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.3)",
            color: "rgba(255,255,255,0.75)",
            zIndex: 1,
            animation: `${float} 2.2s ease-in-out infinite`,
            "&:hover": { color: "#fff", borderColor: "#fff" },
            ...focusRing,
            ...reducedMotion,
          }}
        >
          <ArrowDownwardRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      )}

      {/* Onda de transición hacia la siguiente sección */}
      <Box
        component="svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
        sx={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: { xs: 40, md: 70 }, "& path": { fill: C.offWhite } }}
      >
        <path d="M0,40 C240,80 480,80 720,52 C960,24 1200,8 1440,36 L1440,80 L0,80 Z" />
      </Box>
    </Box>
  );
}
