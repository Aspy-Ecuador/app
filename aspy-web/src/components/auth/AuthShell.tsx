// Base común de las pantallas de ingreso y registro: fondo de ASPY con un velo según el modo,
// botón de modo claro/oscuro, tarjeta y logo. Los estilos de campos y botones están en ./estilos.
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import type { SxProps, Theme } from "@mui/material/styles";
import AppTheme from "@shared-theme/AppTheme";
import ColorModeToggle from "@shared-theme/ColorModeToggle";
import { aspy } from "@shared-theme/themePrimitives";
import { focusRing } from "@components/landing/constants";
import logoAspy from "@assets/landing/logo-aspy.webp";
import fondoAspy from "@assets/fondoAspy.webp";
import { largeScreenZoom, vh } from "@shared-theme/pantallaGrande";

interface AuthShellProps {
  children: ReactNode;
  disableCustomTheme?: boolean;
}

export default function AuthShell({ children, disableCustomTheme }: AuthShellProps) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box
        component="main"
        sx={(theme) => ({
          position: "relative",
          minHeight: vh(100),
          ...largeScreenZoom,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          pt: { xs: 9.5, md: 5 },
          pb: { xs: 3, md: 5 },
          color: aspy.text,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `linear-gradient(rgba(255,248,241,0.3), rgba(255,248,241,0.3)), url(${fondoAspy})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            ...theme.applyStyles("dark", {
              // Velo azul noche con un toque de los colores de ASPY; el fondo apenas se insinúa
              backgroundImage: `radial-gradient(720px 520px at 12% 12%, rgba(91,184,212,0.16), transparent 65%),
                radial-gradient(680px 520px at 90% 92%, rgba(232,160,176,0.13), transparent 65%),
                linear-gradient(rgba(11,19,30,0.93), rgba(11,19,30,0.96)), url(${fondoAspy})`,
            }),
          },
        })}
      >
        {/* Modo claro / oscuro (arriba a la derecha; en el celular queda sobre la tarjeta, sin taparla) */}
        <Box sx={{ position: "absolute", top: { xs: 14, md: 24 }, right: { xs: 16, md: 28 }, zIndex: 2 }}>
          <ColorModeToggle
            iconSize="1.4rem"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              color: aspy.text,
              bgcolor: aspy.card,
              border: "1px solid",
              borderColor: aspy.border,
              boxShadow: "0 8px 22px rgba(18,38,58,0.18)",
              transition: "transform 0.2s",
              "&:hover": { bgcolor: aspy.card, transform: "scale(1.06)" },
              "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
              ...focusRing,
            }}
          />
        </Box>
        <Box sx={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
          {children}
        </Box>
      </Box>
    </AppTheme>
  );
}

/** Tarjeta de las pantallas de ingreso y registro (sólida en ambos modos). */
export function AuthCard({ children, maxWidth, sx }: { children: ReactNode; maxWidth: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        (theme) => ({
          width: "100%",
          maxWidth,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: { xs: 2.75, sm: 5 },
          bgcolor: aspy.card,
          color: aspy.text,
          border: "1px solid",
          borderColor: aspy.border,
          borderRadius: { xs: "24px", sm: "28px" },
          boxShadow: "0 24px 60px rgba(18,38,58,0.16)",
          ...theme.applyStyles("dark", { boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/** Logo oficial; lleva a la página de inicio. */
export function AuthLogo({ height = 76 }: { height?: number }) {
  return (
    <Box
      component={RouterLink}
      to="/"
      aria-label="Ir al inicio de Fundación Aspy"
      sx={{ display: "inline-flex", borderRadius: 2, ...focusRing }}
    >
      <Box component="img" src={logoAspy} alt="Fundación Aspy Ecuador" sx={{ display: "block", height, width: "auto" }} />
    </Box>
  );
}
