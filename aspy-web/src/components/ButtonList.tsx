import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import type { ButtonControl } from "@/types/ButtonControl";

interface ButtonListProps {
  botones: ButtonControl[];
}

export default function ButtonList({ botones }: ButtonListProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 0.5 }}>
      {botones.map((boton, index) => (
        <ButtonBase
          key={index}
          onClick={boton.accion}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.75,
            py: 1.25,
            borderRadius: 2,
            border: "0.5px solid transparent",
            width: "100%",
            textAlign: "left",
            justifyContent: "flex-start",
            transition: "background 0.15s, border-color 0.15s",
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "action.hover",
              borderColor: "divider",
            },
            "&:active": { transform: "scale(0.99)" },
          }}
        >
          {/* Icono con fondo de color */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "action.selected",
              color: "text.secondary",
              "& svg": { fontSize: 16 },
            }}
          >
            {boton.icon}
          </Box>

          {/* Texto */}
          <Typography sx={{ fontSize: 13, fontWeight: 500, flex: 1 }}>
            {boton.text}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
