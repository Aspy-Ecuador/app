// aspy-web/src/components/landing/HeroSection.tsx
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import aspyBanda from "@/assets/Aspy-banda.jpeg";
import { C, NAV, openLink, scrollTo, fadeUp, fadeIn, float } from "./constants";

// ─── Styled ──────────────────────────────────────────────────────
const FloatCircle = styled(Box)<{ delay?: string }>(({ delay = "0s" }) => ({
  position: "absolute",
  borderRadius: "50%",
  animation: `${float} 7s ease-in-out infinite`,
  animationDelay: delay,
  pointerEvents: "none",
}));

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

// ─── Props ───────────────────────────────────────────────────────
interface HeroSectionProps {
  /** Muestra los botones de "Ingresar al sistema" y "Conocer más". Default: true */
  showLoginCTA?: boolean;
}

export default function HeroSection({ showLoginCTA = true }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(135deg, ${C.darkBg} 0%, #1B3A52 60%, #0F2233 100%)`,
        overflow: "hidden",
        px: { xs: 3, md: 10 },
        pt: { xs: 10, md: 0 },
      }}
    >
      {/* Bg image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${aspyBanda})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
          zIndex: 0,
        }}
      />

      {/* Decorative circles */}
      <FloatCircle delay="0s"   sx={{ width: 320, height: 320, top: -80,    right: -60,    background: `${C.blue}16` }} />
      <FloatCircle delay="2.5s" sx={{ width: 160, height: 160, bottom: -40, left: "28%",   background: `${C.yellow}18` }} />
      <FloatCircle delay="4.5s" sx={{ width: 100, height: 100, top: "18%",  right: "22%",  background: `${C.pink}20` }} />
      <FloatCircle delay="1s"   sx={{ width: 55,  height: 55,  bottom: "22%", right: "10%", background: `${C.blue}22` }} />
      <FloatCircle delay="3s"   sx={{ width: 70,  height: 70,  top: "40%",  left: "6%",    background: `${C.pink}14` }} />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          animation: `${fadeUp} 0.9s ease both`,
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.625,
            borderRadius: 50,
            border: `1px solid ${C.blue}55`,
            bgcolor: `${C.blue}18`,
            mb: 3,
            animation: `${fadeIn} 1s ease 0.2s both`,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: C.blue }} />
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: C.blue,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            FUNDACIÓN SIN FINES DE LUCRO · GUAYAQUIL, ECUADOR
          </Typography>
        </Box>

        <Typography
          variant="h1"
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.5rem" },
            lineHeight: 1.08,
            mb: 1.5,
            animation: `${fadeUp} 0.9s ease 0.15s both`,
          }}
        >
          Fundación{" "}
          <Box
            component="span"
            sx={{
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.pink})`,
            }}
          >
            Aspy
          </Box>
        </Typography>

        <Typography
          sx={{
            color: C.yellow,
            fontWeight: 500,
            mb: 3,
            fontSize: { xs: "1rem", md: "1.15rem" },
            animation: `${fadeUp} 0.9s ease 0.25s both`,
          }}
        >
          Ecuador
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.78)",
            fontSize: { xs: "1rem", md: "1.15rem" },
            lineHeight: 1.85,
            maxWidth: 560,
            mb: 5,
            animation: `${fadeUp} 0.9s ease 0.35s both`,
          }}
        >
          Organización social dedicada a mejorar la calidad de vida de personas
          con discapacidad — especialmente dentro del espectro autista — a través
          del acompañamiento, la terapia y la inclusión.
        </Typography>

        {/* CTA buttons */}
        {showLoginCTA && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              animation: `${fadeUp} 0.9s ease 0.45s both`,
            }}
          >
            <Box
              onClick={() => navigate("/login")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 3.5,
                py: 1.5,
                borderRadius: 2.5,
                cursor: "pointer",
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: `0 8px 28px ${C.blue}50`,
                transition: "all 0.25s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 14px 36px ${C.blue}65`,
                },
              }}
            >
              <LoginRoundedIcon sx={{ fontSize: 18 }} />
              Ingresar al sistema
            </Box>

            <Box
              onClick={() => scrollTo(NAV[1].id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 3.5,
                py: 1.5,
                borderRadius: 2.5,
                cursor: "pointer",
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "rgba(255,255,255,0.88)",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.25s",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.7)",
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Conocer más
            </Box>
          </Box>
        )}

        {/* Social links */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: showLoginCTA ? 5 : 0,
            flexWrap: "wrap",
            animation: `${fadeUp} 0.9s ease 0.55s both`,
          }}
        >
          <SocialBtn
            onClick={openLink("https://www.instagram.com/aspyecuador/")}
            sx={{
              color: C.blue,
              borderColor: `${C.blue}55`,
              "&:hover": { background: `${C.blue}20`, borderColor: C.blue },
            }}
          >
            <InstagramIcon sx={{ fontSize: 18 }} />
            @aspyecuador
          </SocialBtn>
          <SocialBtn
            onClick={openLink("https://www.instagram.com/aspy_band/")}
            sx={{
              color: C.pink,
              borderColor: `${C.pink}55`,
              "&:hover": { background: `${C.pink}20`, borderColor: C.pink },
            }}
          >
            <InstagramIcon sx={{ fontSize: 18 }} />
            @aspy_band
          </SocialBtn>
        </Box>
      </Box>

      {/* Scroll indicator — solo en landing completa */}
      {showLoginCTA && (
        <Box
          sx={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            animation: `${fadeIn} 1s ease 1.2s both`,
            cursor: "pointer",
          }}
          onClick={() => scrollTo("nosotros")}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </Typography>
          <Box
            sx={{
              width: 1.5,
              height: 48,
              borderRadius: 1,
              bgcolor: "rgba(255,255,255,0.15)",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "40%",
                bgcolor: C.blue,
                borderRadius: 1,
                animation: `${float} 1.8s ease-in-out infinite`,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}