// FINAL
// Saludo junto a la tarjeta de ingreso (solo en pantallas grandes; en el celular el logo va dentro de la tarjeta).
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { aspy } from "@shared-theme/themePrimitives";
import { AuthLogo } from "@components/auth/AuthShell";
import { DISPLAY_FONT } from "@components/landing/constants";

export default function Content() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        maxWidth: 460,
      }}
    >
      <Typography
        component="p"
        sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { md: "2.6rem", lg: "3rem" }, lineHeight: 1.1, letterSpacing: "-0.02em", color: aspy.text }}
      >
        Bienvenido a
      </Typography>
      <AuthLogo height={230} />
      <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.6, color: aspy.muted, maxWidth: 380 }}>
        Citas, pagos y reportes de terapia en un solo lugar.
      </Typography>
    </Box>
  );
}
