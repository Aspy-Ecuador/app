// aspy-web/src/components/landing/FooterCTA.tsx
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { C, openLink } from "./constants";

// ─── Styled ──────────────────────────────────────────────────────
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
interface FooterCTAProps {
  /** Muestra el botón "Ingresar al sistema". Default: true */
  showLoginCTA?: boolean;
}

// ─── Componente ──────────────────────────────────────────────────
export default function FooterCTA({ showLoginCTA = true }: FooterCTAProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${C.blueLight} 0%, ${C.pinkLight} 50%, ${C.yellowLight} 100%)`,
        borderTop: `1px solid ${C.border}`,
        py: { xs: 7, md: 10 },
        px: 3,
        textAlign: "center",
      }}
    >
      {/* Línea de colores */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
        <Box sx={{ width: 32, height: 5, borderRadius: 2, background: C.blue }} />
        <Box sx={{ width: 32, height: 5, borderRadius: 2, background: C.pink }} />
        <Box sx={{ width: 32, height: 5, borderRadius: 2, background: C.yellow }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: C.black,
          mb: 1.5,
          fontSize: { xs: "1.4rem", md: "1.8rem" },
        }}
      >
        Conéctate con ASPY
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: C.muted, mb: 5, maxWidth: 380, mx: "auto", lineHeight: 1.8 }}
      >
        Síguenos en redes sociales y sé parte del cambio.
      </Typography>

      {/* Redes */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: showLoginCTA ? 5 : 0,
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

      {/* Botón login */}
      {showLoginCTA && (
        <Box
          onClick={() => navigate("/login")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 4,
            py: 1.5,
            borderRadius: 2.5,
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            boxShadow: `0 8px 28px ${C.blue}40`,
            transition: "all 0.25s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 14px 36px ${C.blue}55`,
            },
          }}
        >
          <LoginRoundedIcon sx={{ fontSize: 18 }} />
          Ingresar al sistema
        </Box>
      )}

      {/* Copyright */}
      <Typography
        sx={{
          mt: showLoginCTA ? 6 : 4,
          fontSize: "0.78rem",
          color: C.muted,
          opacity: 0.7,
        }}
      >
        © {new Date().getFullYear()} Fundación Aspy Ecuador · Todos los derechos reservados
      </Typography>
    </Box>
  );
}