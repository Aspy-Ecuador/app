// Botón flotante de modo claro/oscuro (esquina inferior izquierda; WhatsApp va a la derecha).
import Box from "@mui/material/Box";
import ColorModeToggle from "@shared-theme/ColorModeToggle";
import { C, focusRing } from "./constants";

export default function FloatingModeToggle() {
  return (
    <Box
      sx={{
        position: "fixed",
        left: { xs: 16, md: 28 },
        bottom: { xs: 16, md: 28 },
        zIndex: 1100,
      }}
    >
      <ColorModeToggle
        iconSize="1.6rem"
        sx={{
          width: { xs: 52, md: 56 },
          height: { xs: 52, md: 56 },
          borderRadius: "50%",
          color: C.black,
          bgcolor: C.card,
          border: "1px solid",
          borderColor: C.border,
          boxShadow: "0 10px 26px rgba(18,38,58,0.22)",
          backdropFilter: "blur(8px)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { bgcolor: C.card, transform: "scale(1.06)", boxShadow: "0 14px 32px rgba(18,38,58,0.28)" },
          ...focusRing,
        }}
      />
    </Box>
  );
}
