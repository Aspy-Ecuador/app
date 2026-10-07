// Contacto + footer. Los datos de contacto vacíos no se muestran.
import type { MouseEvent, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import type { LandingContent } from "@/content/landing/types";
import { formatPhoneEc, telHref } from "@/content/landing/format";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { C, DISPLAY_FONT, NAV_ITEMS, NAV_HEIGHT, focusRing, mapsEmbedUrl, mapsSearchUrl, placeFromMapsUrl, scrollTo, whatsappUrl } from "./constants";
import { BrandMark, Reveal, SocialIcon } from "./shared";

interface FooterProps {
  contact: LandingContent["contact"];
  social: LandingContent["social"];
  footer: LandingContent["footer"];
  navigation: LandingContent["navigation"];
  logo: LandingContent["site"]["logo"];
  /** Texto del botón principal (el mismo del hero). */
  ctaLabel: string;
  /** Muestra "Agendar una cita" e "Ingresar al sistema". Default: true */
  showCtas?: boolean;
  primaryHref?: string;
}

interface ContactItem {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}

function contactItems(c: LandingContent["contact"]): ContactItem[] {
  const items: ContactItem[] = [];
  if (c.whatsapp)
    items.push({ icon: <WhatsAppIcon />, label: "WhatsApp", value: formatPhoneEc(c.whatsapp), href: whatsappUrl(c.whatsapp, c.whatsappMessage) });
  if (c.phone) items.push({ icon: <PhoneRoundedIcon />, label: "Teléfono", value: formatPhoneEc(c.phone), href: telHref(c.phone) });
  if (c.email) items.push({ icon: <MailRoundedIcon />, label: "Correo", value: c.email, href: `mailto:${c.email}` });
  if (c.address)
    items.push({ icon: <PlaceRoundedIcon />, label: "Dirección", value: c.address, href: c.mapUrl || mapsSearchUrl(c.mapQuery || c.address) });
  if (c.schedule.trim()) items.push({ icon: <ScheduleRoundedIcon />, label: "Horario", value: c.schedule.trim() });
  return items;
}

const footerLink = {
  color: "rgba(255,255,255,0.7)",
  textDecoration: "none",
  fontSize: "0.92rem",
  borderRadius: 1,
  "&:hover": { color: "#fff" },
  ...focusRing,
};

export default function Footer({ contact, social, footer, navigation, logo, ctaLabel, showCtas = true, primaryHref = "/register" }: FooterProps) {
  const items = contactItems(contact);
  // Ubicación del mapa: la exacta de Sanity, si no la ficha de Google Maps (su identificador o nombre + coordenadas), si no la dirección
  const place = contact.mapQuery ? null : placeFromMapsUrl(contact.mapUrl);
  const mapLocation = contact.showMap ? (contact.mapQuery || place?.name || contact.address).trim() : "";
  const external = (href?: string) => (href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
  const goTo = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <Box
      component="footer"
      id="contacto"
      sx={{ bgcolor: C.darkBg, color: "#fff", scrollMarginTop: NAV_HEIGHT, pt: { xs: 8, md: 11 }, pb: 4 }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2.5, sm: 4, md: 5 } }}>
        {/* Llamado final + contacto */}
        <Reveal>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: "26px", md: "34px" },
              p: { xs: 3.5, sm: 5, md: 6 },
              background: `radial-gradient(500px 260px at 100% 0%, ${C.pink}55, transparent 65%),
                linear-gradient(135deg, ${C.blueDark} 0%, #2C7F9C 55%, ${C.darkBg2} 100%)`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            }}
          >
            <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 620 }}>
              {contact.title}
            </Typography>
            <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.85)", fontSize: { xs: "1rem", md: "1.08rem" }, maxWidth: 560, lineHeight: 1.7 }}>
              {contact.subtitle}
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 3.5 }}>
              {showCtas && (
                <Box
                  component={RouterLink}
                  to={primaryHref}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 3,
                    py: 1.4,
                    borderRadius: 50,
                    fontWeight: 700,
                    color: C.darkBg,
                    bgcolor: "#fff",
                    textDecoration: "none",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-2px)" },
                    ...focusRing,
                  }}
                >
                  <EventAvailableRoundedIcon sx={{ fontSize: 19, color: C.blueDark }} />
                  {ctaLabel}
                </Box>
              )}
              {contact.whatsapp ? (
                <Box
                  component="a"
                  href={whatsappUrl(contact.whatsapp, contact.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 3, py: 1.4, borderRadius: 50, fontWeight: 600, color: "#fff", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.5)", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, ...focusRing }}
                >
                  <WhatsAppIcon sx={{ fontSize: 19 }} />
                  {contact.whatsappCtaLabel}
                </Box>
              ) : (
                social[0] && (
                  <Box
                    component="a"
                    href={social[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 3, py: 1.4, borderRadius: 50, fontWeight: 600, color: "#fff", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.5)", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, ...focusRing }}
                  >
                    <SocialIcon network={social[0].network} size={19} />
                    Escríbenos en {social[0].label}
                  </Box>
                )
              )}
            </Box>

            {items.length > 0 && (
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  m: 0,
                  p: 0,
                  mt: 4.5,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: `repeat(${Math.min(items.length, 4)}, 1fr)` },
                  gap: 1.5,
                }}
              >
                {items.map((it) => {
                  const body = (
                    <>
                      <Box sx={{ color: C.yellow, display: "grid", placeItems: "center", "& svg": { fontSize: 22 } }}>{it.icon}</Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
                          {it.label}
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: "#fff", overflowWrap: "anywhere", whiteSpace: "pre-line" }}>{it.value}</Typography>
                      </Box>
                    </>
                  );
                  const sx = { display: "flex", alignItems: "center", gap: 1.5, p: 2, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.1)", textDecoration: "none", height: "100%", ...focusRing };
                  return (
                    <li key={it.label}>
                      {it.href ? (
                        <Box component="a" href={it.href} {...external(it.href)} sx={{ ...sx, "&:hover": { bgcolor: "rgba(255,255,255,0.16)" } }}>
                          {body}
                        </Box>
                      ) : (
                        <Box sx={sx}>{body}</Box>
                      )}
                    </li>
                  );
                })}
              </Box>
            )}
          </Box>
        </Reveal>

        {/* Mapa (se muestra si hay dirección o ubicación exacta) */}
        {mapLocation && (
          <Reveal>
            <Box
              sx={{
                mt: 3,
                borderRadius: { xs: "24px", md: "30px" },
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
              }}
            >
              <Box sx={{ p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                {contact.mapTitle && (
                  <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.9rem" }, letterSpacing: "-0.02em" }}>
                    {contact.mapTitle}
                  </Typography>
                )}
                {contact.address && (
                  <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
                    <PlaceRoundedIcon sx={{ color: C.yellow, mt: "2px" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{contact.address}</Typography>
                  </Box>
                )}
                {contact.schedule && (
                  <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
                    <ScheduleRoundedIcon sx={{ color: C.yellow, mt: "2px" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{contact.schedule.trim()}</Typography>
                  </Box>
                )}
                <Box
                  component="a"
                  href={contact.mapUrl || mapsSearchUrl(mapLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    alignSelf: "flex-start",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    px: 3,
                    py: 1.3,
                    borderRadius: 50,
                    fontWeight: 700,
                    color: C.darkBg,
                    bgcolor: "#fff",
                    textDecoration: "none",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-2px)" },
                    ...focusRing,
                  }}
                >
                  <MapRoundedIcon sx={{ fontSize: 19, color: C.blueDark }} />
                  {contact.mapButtonLabel || "Abrir en Google Maps"}
                </Box>
              </Box>
              <Box
                component="iframe"
                title={`Mapa: ${contact.address || mapLocation}`}
                src={mapsEmbedUrl(mapLocation, place)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                sx={{ display: "block", width: "100%", height: { xs: 260, md: "100%" }, minHeight: { md: 340 }, border: 0 }}
              />
            </Box>
          </Reveal>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.4fr 0.8fr 1fr" },
            gap: { xs: 5, md: 6 },
            mt: { xs: 8, md: 10 },
          }}
        >
          <Box sx={{ gridColumn: { sm: "1 / -1", md: "auto" } }}>
            <BrandMark logo={logo} height={120} />
            <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: 360, fontSize: "0.95rem" }}>
              {footer.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
              {social.map((s) => (
                <Box
                  key={s.url}
                  component="a"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.network} ${s.label}`}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                    transition: "background-color 0.2s",
                    "&:hover": { bgcolor: C.blueDark },
                    ...focusRing,
                  }}
                >
                  <SocialIcon network={s.network} size={19} />
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="nav" aria-label="Secciones">
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>{footer.navTitle}</Typography>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {NAV_ITEMS.filter((n) => n.id !== "contacto").map(({ key, id }) => (
                <li key={id}>
                  <Box component="a" href={`#${id}`} onClick={(e: MouseEvent) => goTo(e, id)} sx={footerLink}>
                    {navigation.labels[key]}
                  </Box>
                </li>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>{footer.contactTitle}</Typography>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {(items.length ? items : []).map((it) => (
                <li key={it.label}>
                  {it.href ? (
                    <Box component="a" href={it.href} {...external(it.href)} sx={footerLink}>
                      {it.value}
                    </Box>
                  ) : (
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.92rem", whiteSpace: "pre-line" }}>{it.value}</Typography>
                  )}
                </li>
              ))}
              {items.length === 0 &&
                social.map((s) => (
                  <li key={s.url}>
                    <Box component="a" href={s.url} target="_blank" rel="noopener noreferrer" sx={{ ...footerLink, display: "inline-flex", alignItems: "center", gap: 1 }}>
                      <SocialIcon network={s.network} size={17} />
                      {s.label}
                    </Box>
                  </li>
                ))}
              <li>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem" }}>{footer.location}</Typography>
              </li>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} Fundación Aspy Ecuador · Todos los derechos reservados
          </Typography>
          {showCtas && (
            <Box component={RouterLink} to="/login" sx={{ ...footerLink, fontSize: "0.85rem" }}>
              {footer.loginLabel}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
