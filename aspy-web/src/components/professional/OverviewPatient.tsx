// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { getAge, translateRol } from "@/utils/utils";
import type { Person } from "@/typesResponse/Person";
import photo from "@assets/user.png";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import DateRangeIcon from "@mui/icons-material/DateRange";

// ─── Paleta del logo ASPY ────────────────────────────────────────
const C = {
  blue: "#5BB8D4",
  blueDark: "#3A9AB8",
  blueLight: "#D6F0F8",
  pink: "#E8A0B0",
  pinkLight: "#FCE8ED",
  yellow: "#F0C84A",
  yellowLight: "#FDF4D0",
  black: "#1A1A2E",
  muted: "#6B7A83",
  border: "#E2EBF0",
};

interface OverviewPacienteProps {
  patient: Person;
}

const InfoRow = ({
  icon,
  label,
  value,
  iconBg = C.blueLight,
  iconColor = C.blueDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined | null;
  iconBg?: string;
  iconColor?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.9 }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 1.5,
        backgroundColor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: iconColor,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          color: C.muted,
          fontSize: "0.66rem",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: C.black,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  </Box>
);

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: C.blue,
      mb: 0.5,
      mt: 0.5,
    }}
  >
    {children}
  </Typography>
);

export default function OverviewPatient({ patient }: OverviewPacienteProps) {
  const initials =
    `${patient.first_name?.[0] ?? ""}${patient.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 16,
      }}
    >
      {/* ── Header ───────────────────────────────────── */}
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
            #{patient.person_id}
          </Typography>
        </Box>

        <Avatar
          alt="Foto de perfil"
          src={photo}
          sx={{
            width: 68,
            height: 68,
            border: "3px solid rgba(255,255,255,0.9)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            bgcolor: C.blueDark,
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ textAlign: "center", px: 1 }}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.92rem",
              lineHeight: 1.3,
            }}
          >
            {patient.first_name} {patient.last_name}
          </Typography>
          <Chip
            label={translateRol(patient.user_account?.role?.name)}
            size="small"
            sx={{
              mt: 0.75,
              height: 20,
              fontSize: "0.66rem",
              fontWeight: 700,
              bgcolor: C.yellow,
              color: C.black,
              "& .MuiChip-label": { px: 1.2 },
            }}
          />
        </Box>
      </Box>

      {/* Barra decorativa */}
      <Box sx={{ display: "flex", height: 3 }}>
        <Box sx={{ flex: 1, bgcolor: C.blue }} />
        <Box sx={{ flex: 1, bgcolor: C.pink }} />
        <Box sx={{ flex: 1, bgcolor: C.yellow }} />
      </Box>

      {/* ── Datos personales ─────────────────────────── */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <SectionLabel>Datos personales</SectionLabel>
        <InfoRow
          icon={<CakeRoundedIcon sx={{ fontSize: 14 }} />}
          label="Edad"
          value={`${getAge(patient.birthdate)} años`}
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<WcRoundedIcon sx={{ fontSize: 14 }} />}
          label="Género"
          value={patient.gender?.name}
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<FavoriteRoundedIcon sx={{ fontSize: 14 }} />}
          label="Estado civil"
          value={patient.marital_status?.name}
          iconBg={C.pinkLight}
          iconColor={C.pink}
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<DateRangeIcon sx={{ fontSize: 14 }} />}
          label="Cumpleaños"
          value={patient.birthdate}
          iconBg={C.yellowLight}
          iconColor="#C9A020"
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<WorkRoundedIcon sx={{ fontSize: 14 }} />}
          label="Ocupación"
          value={patient.occupation?.name}
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<BadgeRoundedIcon sx={{ fontSize: 14 }} />}
          label="Identificación"
          value={patient.identification?.number}
          iconBg={C.pinkLight}
          iconColor={C.pink}
        />
      </Box>

      {/* ── Contacto ─────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
        <SectionLabel>Contacto</SectionLabel>
        <InfoRow
          icon={<PhoneRoundedIcon sx={{ fontSize: 14 }} />}
          label="Teléfono"
          value={patient.phone.number}
          iconBg={C.yellowLight}
          iconColor="#C9A020"
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<EmailRoundedIcon sx={{ fontSize: 14 }} />}
          label="Correo"
          value={patient.user_account?.email}
        />
      </Box>

      {/* ── Dirección ────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 1, pb: 2 }}>
        <SectionLabel>Dirección</SectionLabel>
        <InfoRow
          icon={<HomeRoundedIcon sx={{ fontSize: 14 }} />}
          label="Dirección principal"
          value={patient.address?.primary_address}
          iconBg={C.pinkLight}
          iconColor={C.pink}
        />
        <Divider sx={{ borderColor: C.border }} />
        <InfoRow
          icon={<HomeRoundedIcon sx={{ fontSize: 14 }} />}
          label="Ciudad"
          value={patient.address?.city.name}
          iconBg={C.pinkLight}
          iconColor={C.pink}
        />
      </Box>
    </Box>
  );
}
