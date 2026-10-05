import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import { alpha, useTheme } from "@mui/material/styles";

interface WelcomePanelProps {
  user: string;
}

export default function WelcomePanel({ user }: WelcomePanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", sm: "flex-start" },
        justifyContent: "center",
        textAlign: { xs: "center", sm: "left" },
        gap: 1.5,
        px: { xs: 2.5, sm: 4 },
        py: { xs: 3, sm: 4 },
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.05)" : alpha(theme.palette.primary.main, 0.1),
        background: isDark
          ? `linear-gradient(135deg, hsl(220, 10%, 8%) 0%, hsl(220, 10%, 4%) 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(
              theme.palette.background.paper,
              1
            )} 100%)`,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.2)"
          : "0 8px 32px rgba(0,0,0,0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <WavingHandRoundedIcon 
          color="primary" 
          sx={{ 
            fontSize: { xs: 28, sm: 32 },
            animation: "wave 2.5s infinite",
            transformOrigin: "70% 70%",
            "@keyframes wave": {
              "0%": { transform: "rotate( 0.0deg)" },
              "10%": { transform: "rotate(14.0deg)" },
              "20%": { transform: "rotate(-8.0deg)" },
              "30%": { transform: "rotate(14.0deg)" },
              "40%": { transform: "rotate(-4.0deg)" },
              "50%": { transform: "rotate(10.0deg)" },
              "60%": { transform: "rotate( 0.0deg)" },
              "100%": { transform: "rotate( 0.0deg)" },
            },
          }} 
        />
        <Typography
          variant="overline"
          sx={{
            letterSpacing: "0.1em",
            fontWeight: 700,
            color: "primary.main",
            fontSize: { xs: "0.7rem", sm: "0.75rem" }
          }}
        >
          PANEL DE CONTROL ASPY
        </Typography>
      </Box>

      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 800,
          color: "text.primary",
          letterSpacing: "-0.02em",
          fontSize: { xs: "1.75rem", sm: "2.125rem" }
        }}
      >
        ¡Hola de nuevo, {user}!
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          color: "text.secondary",
          maxWidth: "600px",
          mt: 0.5,
          lineHeight: 1.6
        }}
      >
        Aquí tienes un resumen rápido de toda tu actividad y herramientas. Explora el menú lateral para gestionar tus citas, servicios y configuraciones.
      </Typography>

      {/* Elemento decorativo de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            isDark ? 0.2 : 0.1
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </Paper>
  );
}
