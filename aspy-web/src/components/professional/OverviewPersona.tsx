// FINAL
import { getAge, translateRol } from "@/utils/utils";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import photo from "@assets/user.png";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import type { Person } from "@/typesResponse/Person";

// ─── Paleta del logo ASPY ─────────────────────────────────────────
const C = {
  blue: "#5BB8D4",
  blueDark: "#3A9AB8",
  blueLight: "#D6F0F8",
  pink: "#E8A0B0",
  pinkLight: "#FCE8ED",
  yellow: "#F0C84A",
  black: "#1A1A2E",
  muted: "#6B7A83",
};

interface OverviewPersonaProps {
  selectedData: Person;
  moreInfo: () => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 1.5,
        backgroundColor: C.blueLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: C.blueDark,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: C.muted,
          display: "block",
          fontSize: "0.67rem",
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color: C.black }}>
        {value ?? "—"}
      </Typography>
    </Box>
  </Box>
);

export default function OverviewPersona({
  selectedData,
  moreInfo,
}: OverviewPersonaProps) {
  const initials =
    `${selectedData.first_name?.[0] ?? ""}${selectedData.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "#E2EBF0",
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
          pt: 2.5,
          pb: 2,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          position: "relative",
        }}
      >
        {/* Badge ID */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 10,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 1.5,
            px: 0.9,
            py: 0.2,
          }}
        >
          <Typography
            sx={{ fontSize: "0.62rem", color: "#fff", fontWeight: 700 }}
          >
            #{selectedData.person_id}
          </Typography>
        </Box>

        {/* Avatar */}
        <Avatar
          alt="Foto de perfil"
          src={photo}
          sx={{
            width: 72,
            height: 72,
            border: "3px solid rgba(255,255,255,0.9)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            bgcolor: C.blueDark,
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initials}
        </Avatar>

        {/* Nombre directamente en el header — siempre visible */}
        <Box sx={{ textAlign: "center", px: 1 }}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              lineHeight: 1.3,
              textShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            {selectedData.first_name} {selectedData.last_name}
          </Typography>

          {/* Chip de rol con color del logo */}
          <Chip
            label={translateRol(selectedData.user_account?.role?.name)}
            size="small"
            sx={{
              mt: 0.75,
              height: 20,
              fontSize: "0.67rem",
              fontWeight: 700,
              bgcolor: C.yellow,
              color: C.black,
              border: "none",
              "& .MuiChip-label": { px: 1.2 },
            }}
          />
        </Box>
      </Box>

      {/* Barra decorativa de 3 colores */}
      <Box sx={{ display: "flex", height: 3 }}>
        <Box sx={{ flex: 1, bgcolor: C.blue }} />
        <Box sx={{ flex: 1, bgcolor: C.pink }} />
        <Box sx={{ flex: 1, bgcolor: C.yellow }} />
      </Box>

      {/* ── Info rows ────────────────────────────────── */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
        <InfoRow
          icon={<EmailRoundedIcon sx={{ fontSize: 15 }} />}
          label="Correo"
          value={selectedData.user_account?.email}
        />
        <Divider />
        <InfoRow
          icon={<CakeRoundedIcon sx={{ fontSize: 15 }} />}
          label="Edad"
          value={`${getAge(selectedData.birthdate)} años`}
        />
        <Divider />
        <InfoRow
          icon={<WcRoundedIcon sx={{ fontSize: 15 }} />}
          label="Género"
          value={selectedData.gender?.name}
        />
        <Divider />
        <InfoRow
          icon={<WorkRoundedIcon sx={{ fontSize: 15 }} />}
          label="Ocupación"
          value={selectedData.occupation?.name}
        />
      </Box>

      {/* ── Botón ────────────────────────────────────── */}
      <Box sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
        <Button
          fullWidth
          onClick={moreInfo}
          endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            py: 1,
            bgcolor: C.blue,
            color: "#fff",
            boxShadow: `0 3px 10px ${C.blue}55`,
            "&:hover": {
              bgcolor: C.blueDark,
              boxShadow: `0 5px 16px ${C.blue}66`,
            },
          }}
        >
          Ver información completa
        </Button>
      </Box>
    </Box>
  );
}
