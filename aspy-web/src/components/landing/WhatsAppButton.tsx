// Botón flotante de WhatsApp (número, mensaje y visibilidad editables desde Sanity → Contacto).
import { keyframes } from "@mui/material/styles";
import Box from "@mui/material/Box";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import type { LandingContent } from "@/content/landing/types";
import { focusRing, reducedMotion, whatsappUrl } from "./constants";

const WHATSAPP_GREEN = "#25D366";

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 ${WHATSAPP_GREEN}80; }
  70%  { box-shadow: 0 0 0 16px ${WHATSAPP_GREEN}00; }
  100% { box-shadow: 0 0 0 0 ${WHATSAPP_GREEN}00; }
`;

export default function WhatsAppButton({ contact }: { contact: LandingContent["contact"] }) {
  const number = contact.whatsapp.replace(/\D/g, "");
  if (!contact.whatsappFloatingButton || !number) return null;

  return (
    <Box
      component="a"
      href={whatsappUrl(number, contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={contact.whatsappFloatingLabel || "Escríbenos por WhatsApp"}
      sx={{
        position: "fixed",
        right: { xs: 16, md: 28 },
        bottom: { xs: 16, md: 28 },
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        borderRadius: 50,
        "&:hover .wa-label, &:focus-visible .wa-label": { opacity: 1, transform: "translateX(0)" },
        ...focusRing,
      }}
    >
      {contact.whatsappFloatingLabel && (
        <Box
          className="wa-label"
          aria-hidden
          sx={{
            display: { xs: "none", md: "block" },
            px: 2,
            py: 1,
            borderRadius: 50,
            bgcolor: "#fff",
            color: "#1A1A2E",
            fontWeight: 600,
            fontSize: "0.88rem",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            opacity: 0,
            transform: "translateX(8px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          {contact.whatsappFloatingLabel}
        </Box>
      )}
      <Box
        sx={{
          width: { xs: 56, md: 60 },
          height: { xs: 56, md: 60 },
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: WHATSAPP_GREEN,
          color: "#fff",
          boxShadow: "0 10px 26px rgba(37,211,102,0.45)",
          animation: `${pulse} 2.4s ease-out infinite`,
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.06)" },
          ...reducedMotion,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 30, md: 32 } }} />
      </Box>
    </Box>
  );
}
