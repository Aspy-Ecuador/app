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
      {/* En PC (lg) la tarjeta es más ancha y deja libre la esquina del botón de modo claro/oscuro */}
      <AuthCard maxWidth={780} sx={{ maxWidth: { lg: "min(1080px, calc(100% - 136px))" }, p: { lg: 3 } }}>
        {/* Formulario multi-paso. En PC el encabezado, los pasos y el enlace van en una columna a la
            izquierda, y los campos a la derecha: así cada paso cabe en la pantalla sin desplazarse. */}
        <RegisterView
          encabezado={
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", lg: "flex-start" }, textAlign: { xs: "center", lg: "left" }, gap: 1 }}>
              <AuthLogo height={72} />
              <Typography
                component="h1"
                sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.6rem", sm: "1.9rem", lg: "1.75rem" }, lineHeight: 1.15, letterSpacing: "-0.02em", color: aspy.text }}
              >
                Crea tu cuenta
              </Typography>
              <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.5, color: aspy.muted }}>
                Tres pasos cortos para agendar tus citas en la fundación.
              </Typography>
            </Box>
          }
          pie={
            <Typography sx={{ textAlign: { xs: "center", lg: "left" }, fontSize: "0.92rem", color: aspy.muted }}>
              ¿Ya tienes una cuenta?{" "}
              <Link component={RouterLink} to="/login" sx={authLinkSx}>
                Iniciar sesión
              </Link>
            </Typography>
          }
        />
      </AuthCard>
    </AuthShell>
  );
}
