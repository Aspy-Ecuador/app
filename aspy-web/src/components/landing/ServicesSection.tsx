// aspy-web/src/components/landing/ServicesSection.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import type { LandingContent } from "@/content/landing/types";
import { responsiveImg } from "@/content/landing/images";
import { ACCENTS, C, DISPLAY_FONT, SERVICE_ICONS, reducedMotion } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";
import VisorFoto from "./VisorFoto";

export default function ServicesSection({ content }: { content: LandingContent["services"] }) {
  const [fotoAbierta, setFotoAbierta] = useState<number | null>(null);
  if (content.items.length === 0) return null;
  // Si al menos un servicio tiene foto, todas las tarjetas usan el formato con imagen (cuadrícula pareja)
  const withMedia = content.items.some((s) => Boolean(s.image?.src));
  // Las fotos se abren en grande al tocarlas (la miniatura las recorta): el visor recorre las de todos los servicios
  const fotos = content.items.flatMap((s) => (s.image?.src ? [{ src: s.image.src, alt: s.image.alt, titulo: s.title, descripcion: s.description }] : []));

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
          const photo = s.image?.src ? s.image : null;
          const accent = ACCENTS[s.accent] ?? ACCENTS.blue;
          return (
            <Box component="li" key={s.title}>
              <Reveal delay={(i % 3) * 0.08} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: withMedia ? 0 : { xs: 3, md: 3.5 },
                    display: "flex",
                    flexDirection: "column",
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
                    "&:hover .service-photo": { transform: "scale(1.05)" },
                    // El distintivo de "ampliar" está siempre a la vista (avisa que la foto se abre) y se resalta con la tarjeta
                    "& .service-zoom": { opacity: 0.88 },
                    "&:hover .service-zoom, & button:focus-visible .service-zoom": { opacity: 1, transform: "scale(1.08)" },
                    ...reducedMotion,
                  }}
                >
                  {withMedia && (
                    // Foto (o fondo de color con el ícono si este servicio no tiene foto)
                    <Box
                      sx={{
                        position: "relative",
                        aspectRatio: "16 / 10",
                        overflow: "hidden",
                        bgcolor: accent.soft,
                        background: photo ? undefined : `linear-gradient(135deg, ${accent.soft}, ${accent.main}40)`,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {photo ? (
                        <Box
                          component="button"
                          type="button"
                          onClick={() => setFotoAbierta(fotos.findIndex((f) => f.src === photo.src))}
                          aria-label={`Ver en grande la foto de ${s.title}`}
                          title="Ver la foto en grande"
                          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", p: 0, m: 0, border: 0, bgcolor: "transparent", cursor: "zoom-in", display: "block", "&:focus-visible": { outline: `3px solid ${C.blue}`, outlineOffset: -4 } }}
                        >
                        <Box
                          component="img"
                          className="service-photo"
                          {...responsiveImg(photo.src, "(min-width: 900px) 360px, (min-width: 600px) 45vw, 90vw")}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            ...reducedMotion,
                          }}
                        />
                        <Box
                          aria-hidden
                          className="service-zoom"
                          sx={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", color: "#1A1A2E", bgcolor: "rgba(255,255,255,0.92)", boxShadow: "0 4px 12px rgba(0,0,0,0.25)", transition: "opacity 0.2s, transform 0.2s", ...reducedMotion }}
                        >
                          <ZoomOutMapRoundedIcon sx={{ fontSize: 19 }} />
                        </Box>
                        </Box>
                      ) : (
                        <Icon aria-hidden sx={{ fontSize: 64, color: accent.dark, opacity: 0.35 }} />
                      )}
                    </Box>
                  )}
                  <Box sx={{ position: "relative", p: withMedia ? { xs: 3, md: 3.5 } : 0, pt: withMedia ? { xs: 4.5, md: 5 } : 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: "16px",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: withMedia ? C.card : accent.soft,
                        color: accent.dark,
                        mb: 2.25,
                        // Con foto, el ícono queda montado sobre el borde de la imagen
                        ...(withMedia && {
                          position: "absolute",
                          top: -27,
                          left: { xs: 24, md: 28 },
                          mb: 0,
                          border: "1px solid",
                          borderColor: C.border,
                          boxShadow: "0 8px 20px rgba(18,38,58,0.14)",
                        }),
                      }}
                    >
                      <Icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "1.12rem", color: C.black, mb: 1 }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ color: C.muted, fontSize: "0.95rem", lineHeight: 1.75 }}>{s.description}</Typography>
                  </Box>
                </Box>
              </Reveal>
            </Box>
          );
        })}
      </Box>

      <VisorFoto fotos={fotos} indice={fotoAbierta} onCambiar={setFotoAbierta} onCerrar={() => setFotoAbierta(null)} />
    </Section>
  );
}
