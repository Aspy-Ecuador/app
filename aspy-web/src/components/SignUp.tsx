// FINAL
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { aspy } from "@shared-theme/themePrimitives";
import AuthShell, { AuthCard, AuthLogo } from "@components/auth/AuthShell";
import { authLinkSx } from "@components/auth/estilos";
import { DISPLAY_FONT } from "@components/landing/constants";
import RegisterView from "@components/RegisterView";

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  return (
    <AuthShell {...props}>
      <AuthCard maxWidth={780}>
        {/* Encabezado */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1 }}>
          <AuthLogo height={72} />
          <Typography
            component="h1"
            sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.6rem", sm: "1.9rem" }, lineHeight: 1.15, letterSpacing: "-0.02em", color: aspy.text }}
          >
            Crea tu cuenta
          </Typography>
          <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.5, color: aspy.muted }}>
            Tres pasos cortos para agendar tus citas en la fundación.
          </Typography>
        </Box>

        {/* Formulario multi-paso */}
        <RegisterView />

        <Typography sx={{ textAlign: "center", fontSize: "0.92rem", color: aspy.muted }}>
          ¿Ya tienes una cuenta?{" "}
          <Link component={RouterLink} to="/login" sx={authLinkSx}>
            Iniciar sesión
          </Link>
        </Typography>
      </AuthCard>
    </AuthShell>
  );
}
