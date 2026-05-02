// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled, keyframes } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import aspyBanda from "@/assets/Aspy-banda.jpeg";
import aspy1 from "@/assets/Aspy1.jpeg";
import aspy2 from "@/assets/Aspy2.jpeg";
import aspy3 from "@/assets/Aspy3.jpeg";

// ─── Paleta del logo ───────────────────────────────────────────────
const C = {
  blue: "#5BB8D4",
  blueDark: "#3A9AB8",
  blueLight: "#D6F0F8",
  pink: "#E8A0B0",
  pinkDark: "#C9728A",
  pinkLight: "#FCE8ED",
  yellow: "#F0C84A",
  yellowDark: "#C9A020",
  yellowLight: "#FDF4D0",
  black: "#1A1A2E",
  darkBg: "#12263A",
  offWhite: "#FAFBFC",
  muted: "#5E6E7A",
  border: "#E2EBF0",
};

// ─── Imágenes (el usuario las completa) ───────────────────────────
const IMAGES = {
  hero: aspyBanda,
  gallery1: aspy1,
  gallery2: aspy2,
  gallery3: aspy3,
  band: aspyBanda,
};

// ─── Animaciones ──────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
`;

// ─── Helper: enlace externo (sin error de TypeScript) ────────────
const openLink = (url: string) => () =>
  window.open(url, "_blank", "noopener,noreferrer");

// ─── Styled components ────────────────────────────────────────────
const PageWrapper = styled(Box)({
  background: C.offWhite,
  minHeight: "100vh",
  overflowX: "hidden",
});

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "62vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(135deg, ${C.darkBg} 0%, #1B3A52 60%, #0F2233 100%)`,
  overflow: "hidden",
  padding: theme.spacing(8, 4),
  [theme.breakpoints.up("md")]: { padding: theme.spacing(10, 10) },
}));

const HeroImg = styled(Box)({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${IMAGES.hero})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.15,
  zIndex: 0,
});

const FloatCircle = styled(Box)<{ delay?: string }>(({ delay = "0s" }) => ({
  position: "absolute",
  borderRadius: "50%",
  animation: `${float} 7s ease-in-out infinite`,
  animationDelay: delay,
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1100,
  margin: "0 auto",
  padding: theme.spacing(7, 3),
  [theme.breakpoints.up("md")]: { padding: theme.spacing(9, 6) },
}));

const ServiceCard = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: 20,
  padding: theme.spacing(3, 3.5),
  border: `1px solid ${C.border}`,
  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  transition: "transform 0.22s ease, box-shadow 0.22s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 10px 36px rgba(91,184,212,0.14)`,
  },
}));

const PhotoCard = styled(Box)({
  borderRadius: 18,
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  "&:hover img": { transform: "scale(1.05)" },
});

const SocialBtn = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.1, 2.8),
  borderRadius: 50,
  border: "1.5px solid",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: "0.88rem",
  transition: "all 0.2s ease",
  userSelect: "none",
}));

// ─── Datos de servicios ───────────────────────────────────────────
const services = [
  {
    icon: <AccessibilityNewRoundedIcon sx={{ color: C.blue, fontSize: 26 }} />,
    iconBg: C.blueLight,
    title: "Atención y acompañamiento",
    desc: "Seguimiento personalizado para personas con discapacidad, especialmente dentro del espectro autista.",
  },
  {
    icon: <FavoriteRoundedIcon sx={{ color: C.pink, fontSize: 26 }} />,
    iconBg: C.pinkLight,
    title: "Terapia e inclusión",
    desc: "Actividades terapéuticas diseñadas para fomentar la inclusión social y el bienestar emocional.",
  },
  {
    icon: <SchoolRoundedIcon sx={{ color: C.yellowDark, fontSize: 26 }} />,
    iconBg: C.yellowLight,
    title: "Capacitación y habilidades",
    desc: "Programas de desarrollo de habilidades, incluyendo arte, tecnología y formación laboral.",
  },
  {
    icon: <HandshakeRoundedIcon sx={{ color: C.blue, fontSize: 26 }} />,
    iconBg: C.blueLight,
    title: "Alianzas institucionales",
    desc: "Proyectos conjuntos con el Municipio de Guayaquil para rehabilitación y apoyo comunitario.",
  },
  {
    icon: <GroupsRoundedIcon sx={{ color: C.pinkDark, fontSize: 26 }} />,
    iconBg: C.pinkLight,
    title: "Adultos mayores",
    desc: "Servicios de bienestar social para adultos mayores y personas en situación de vulnerabilidad.",
  },
  {
    icon: <MusicNoteRoundedIcon sx={{ color: C.yellowDark, fontSize: 26 }} />,
    iconBg: C.yellowLight,
    title: "Arte como terapia",
    desc: "La música y las artes como herramientas de expresión, terapia e integración social.",
  },
];

// ─── Componente ───────────────────────────────────────────────────
export default function AboutAspy() {
  return (
    <PageWrapper>
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <HeroSection>
        <HeroImg />

        {/* Círculos decorativos con colores del logo */}
        <FloatCircle
          delay="0s"
          sx={{
            width: 280,
            height: 280,
            top: -70,
            right: -50,
            background: `${C.blue}18`,
          }}
        />
        <FloatCircle
          delay="2.5s"
          sx={{
            width: 140,
            height: 140,
            bottom: -30,
            left: "28%",
            background: `${C.yellow}20`,
          }}
        />
        <FloatCircle
          delay="4.5s"
          sx={{
            width: 90,
            height: 90,
            top: "18%",
            right: "22%",
            background: `${C.pink}22`,
          }}
        />
        <FloatCircle
          delay="1s"
          sx={{
            width: 50,
            height: 50,
            bottom: "25%",
            right: "10%",
            background: `${C.blue}25`,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 700,
            animation: `${fadeUp} 0.8s ease both`,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: { xs: "2.4rem", md: "3.8rem" },
              lineHeight: 1.12,
              mb: 1,
            }}
          >
            Fundación{" "}
            <Box component="span" sx={{ color: C.blue }}>
              Aspy
            </Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: C.yellow,
              fontWeight: 400,
              mb: 2.5,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Ecuador
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.80)",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.85,
              maxWidth: 540,
              mb: 4,
            }}
          >
            Organización social dedicada a mejorar la calidad de vida de
            personas con discapacidad — especialmente dentro del espectro
            autista — a través del acompañamiento, la terapia y la inclusión.
          </Typography>

          {/* Botones redes sociales */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <SocialBtn
              onClick={openLink("https://www.instagram.com/aspyecuador/")}
              sx={{
                color: C.blue,
                borderColor: `${C.blue}66`,
                "&:hover": { background: `${C.blue}22`, borderColor: C.blue },
              }}
            >
              <InstagramIcon sx={{ fontSize: 19 }} />
              @aspyecuador
            </SocialBtn>

            <SocialBtn
              onClick={openLink("https://www.instagram.com/aspy_band/")}
              sx={{
                color: C.pink,
                borderColor: `${C.pink}66`,
                "&:hover": { background: `${C.pink}22`, borderColor: C.pink },
              }}
            >
              <InstagramIcon sx={{ fontSize: 19 }} />
              @aspy_band
            </SocialBtn>
          </Box>
        </Box>
      </HeroSection>

      {/* ══ MISIÓN ════════════════════════════════════════════════ */}
      <SectionWrapper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 7,
            alignItems: "center",
          }}
        >
          {/* Texto */}
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: C.blue,
                }}
              />
              <Typography
                variant="overline"
                sx={{ color: C.blue, letterSpacing: 2, fontWeight: 700 }}
              >
                Nuestra misión
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: C.black,
                lineHeight: 1.25,
                mb: 2.5,
                fontSize: { xs: "1.7rem", md: "2rem" },
              }}
            >
              Inclusión, dignidad y oportunidad para todos
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: C.muted, lineHeight: 1.9, mb: 2 }}
            >
              ASPY nació con el propósito de brindar atención integral a
              personas con discapacidad, especialmente a niños, adolescentes y
              jóvenes dentro del espectro autista (incluyendo Síndrome de
              Asperger), ofreciéndoles herramientas reales para desarrollar sus
              capacidades y participar plenamente en la sociedad.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: C.muted, lineHeight: 1.9 }}
            >
              A través de alianzas con el Municipio de Guayaquil y otras
              instituciones, la fundación ejecuta programas de rehabilitación,
              arte, tecnología y capacitación que transforman vidas y fortalecen
              comunidades.
            </Typography>
          </Box>

          {/* Galería asimétrica */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "220px 160px",
              gap: 2,
            }}
          >
            <PhotoCard
              sx={{
                gridColumn: "1",
                gridRow: "1",
                boxShadow: `0 6px 24px ${C.blue}25`,
              }}
            >
              <img src={IMAGES.gallery1} alt="Actividades ASPY" />
            </PhotoCard>
            <PhotoCard
              sx={{
                gridColumn: "2",
                gridRow: "1 / 3",
                boxShadow: `0 6px 24px ${C.pink}25`,
              }}
            >
              <img src={IMAGES.gallery2} alt="Inclusión ASPY" />
            </PhotoCard>
            <PhotoCard
              sx={{
                gridColumn: "1",
                gridRow: "2",
                boxShadow: `0 6px 24px ${C.yellow}40`,
              }}
            >
              <img src={IMAGES.gallery3} alt="Comunidad ASPY" />
            </PhotoCard>
          </Box>
        </Box>
      </SectionWrapper>

      <Divider sx={{ borderColor: C.border, mx: { xs: 3, md: 8 } }} />

      {/* ══ SERVICIOS ═════════════════════════════════════════════ */}
      <SectionWrapper>
        <Box sx={{ textAlign: "center", mb: 5.5 }}>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1.5 }}
          >
            <Box
              sx={{ width: 20, height: 4, borderRadius: 2, background: C.blue }}
            />
            <Box
              sx={{ width: 20, height: 4, borderRadius: 2, background: C.pink }}
            />
            <Box
              sx={{
                width: 20,
                height: 4,
                borderRadius: 2,
                background: C.yellow,
              }}
            />
          </Box>
          <Typography
            variant="overline"
            sx={{ color: C.muted, letterSpacing: 2, fontWeight: 700 }}
          >
            Qué hacemos
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: C.black,
              mt: 0.5,
              fontSize: { xs: "1.7rem", md: "2rem" },
            }}
          >
            Nuestros servicios
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {services.map((s) => (
            <ServiceCard key={s.title}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "14px",
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: C.black }}
              >
                {s.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: C.muted, lineHeight: 1.8 }}
              >
                {s.desc}
              </Typography>
            </ServiceCard>
          ))}
        </Box>
      </SectionWrapper>

      <Divider sx={{ borderColor: C.border, mx: { xs: 3, md: 8 } }} />

      {/* ══ ASPY BAND ═════════════════════════════════════════════ */}
      <SectionWrapper>
        <Box
          sx={{
            borderRadius: 5,
            background: `linear-gradient(135deg, ${C.darkBg} 0%, #1B3A52 100%)`,
            p: { xs: 4, md: 6 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Círculos deco */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: `${C.blue}12`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: "35%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `${C.pink}10`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              right: "12%",
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `${C.yellow}15`,
            }}
          />

          {/* Foto banda */}
          <PhotoCard
            sx={{
              width: { xs: "100%", md: 310 },
              height: { xs: 220, md: 290 },
              flexShrink: 0,
              zIndex: 1,
              boxShadow: `0 16px 48px rgba(0,0,0,0.35)`,
            }}
          >
            <img src={IMAGES.band} alt="ASPY Band" />
          </PhotoCard>

          {/* Texto */}
          <Box sx={{ zIndex: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: `${C.yellow}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MusicNoteRoundedIcon sx={{ color: C.yellow, fontSize: 20 }} />
              </Box>
              <Typography
                variant="overline"
                sx={{ color: C.yellow, letterSpacing: 2, fontWeight: 700 }}
              >
                Proyecto especial
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#fff",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                mb: 2,
                lineHeight: 1.15,
              }}
            >
              ASPY{" "}
              <Box component="span" sx={{ color: C.pink }}>
                Band
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.88,
                mb: 3.5,
                maxWidth: 480,
              }}
            >
              Un grupo musical formado íntegramente por jóvenes con Síndrome de
              Asperger. La música se convierte en terapia, en lenguaje común y
              en puente hacia la inclusión social. ASPY Band no solo toca —
              demuestra que el talento no tiene límites.
            </Typography>

            <SocialBtn
              onClick={openLink("https://www.instagram.com/aspy_band/")}
              sx={{
                color: C.pink,
                borderColor: `${C.pink}66`,
                "&:hover": { background: `${C.pink}22`, borderColor: C.pink },
              }}
            >
              <InstagramIcon sx={{ fontSize: 19 }} />
              Seguir a ASPY Band
            </SocialBtn>
          </Box>
        </Box>
      </SectionWrapper>

      {/* ══ FOOTER CTA ════════════════════════════════════════════ */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${C.blueLight} 0%, ${C.pinkLight} 50%, ${C.yellowLight} 100%)`,
          borderTop: `1px solid ${C.border}`,
          py: { xs: 6, md: 8 },
          px: 3,
          textAlign: "center",
        }}
      >
        {/* Línea de colores */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <Box
            sx={{ width: 32, height: 5, borderRadius: 2, background: C.blue }}
          />
          <Box
            sx={{ width: 32, height: 5, borderRadius: 2, background: C.pink }}
          />
          <Box
            sx={{ width: 32, height: 5, borderRadius: 2, background: C.yellow }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: C.black,
            mb: 1.5,
            fontSize: { xs: "1.4rem", md: "1.7rem" },
          }}
        >
          Conéctate con ASPY
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: C.muted, mb: 4, maxWidth: 380, mx: "auto" }}
        >
          Síguenos en redes sociales y sé parte del cambio.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <SocialBtn
            onClick={openLink("https://www.instagram.com/aspyecuador/")}
            sx={{
              color: C.blueDark,
              borderColor: C.blue,
              background: "#fff",
              "&:hover": { background: C.blueLight, borderColor: C.blueDark },
            }}
          >
            <InstagramIcon sx={{ fontSize: 19 }} />
            Fundación ASPY
          </SocialBtn>

          <SocialBtn
            onClick={openLink("https://www.instagram.com/aspy_band/")}
            sx={{
              color: C.pinkDark,
              borderColor: C.pink,
              background: "#fff",
              "&:hover": { background: C.pinkLight, borderColor: C.pinkDark },
            }}
          >
            <InstagramIcon sx={{ fontSize: 19 }} />
            ASPY Band
          </SocialBtn>
        </Box>
      </Box>
    </PageWrapper>
  );
}
