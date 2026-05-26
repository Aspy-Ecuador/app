// FINAL
import type { Person } from "@/typesResponse/Person";
import type { UserLogin } from "@/types/UserLogin";
import { getAge, translateRol } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

type ProfileProps = {
  user: Person | UserLogin;
  isRowPosition: boolean;
};

// ─── Paleta ───────────────────────────────────────────────────────
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

// ─── Subcomponentes ───────────────────────────────────────────────
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined | null;
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
        sx={{
          fontSize: "0.67rem",
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: C.muted,
          lineHeight: 1,
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.black }}>
        {value ?? "—"}
      </Typography>
    </Box>
  </Box>
);

const SectionPanel = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "#E2EBF0",
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    }}
  >
    <Box
      sx={{
        px: 1.75,
        py: 1.25,
        borderBottom: "1px solid #E2EBF0",
        background: `linear-gradient(135deg, ${C.blue}22, ${C.blueLight})`,
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.blueDark,
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

// ─── Componente principal ─────────────────────────────────────────
export default function ProfileView({ user, isRowPosition }: ProfileProps) {
  const navigate = useNavigate();
  const person = "person" in user ? user.person : user;

  const roleName =
    "person" in user ? user.role.name : user.user_account.role.name;
  console.log("ProfileView renderizado con user:", roleName);
  const ruta =
  roleName === "Professional"
    ? `/editarProfesional/${person.user_id}`
    : roleName === "Staff"
    ? `/editarStaff/${person.user_id}`
    : roleName === "Admin"
    ? `/editarAdmin/${person.user_id}`
    : `/editarCliente/${person.user_id}`;

  const initials =
    `${person.first_name?.[0] ?? ""}${person.last_name?.[0] ?? ""}`.toUpperCase();

  const email = "email" in user ? user.email : user.user_account?.email;

  const memberSince =
    "email" in user
      ? user.creation_date?.split("T")[0]
      : user.user_account?.creation_date?.split("T")[0];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isRowPosition
          ? { xs: "1fr", sm: "240px minmax(0,1fr)" }
          : "1fr",
        gap: 1.5,
        alignItems: "start",
      }}
    >
      {/* ── Panel avatar ──────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E2EBF0",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header degradado */}
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
              #{person.person_id}
            </Typography>
          </Box>

          {/* Avatar con botón editar */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #E1F5EE, #B5D4F4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: C.blueDark,
                border: "3px solid rgba(255,255,255,0.9)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              }}
            >
              {initials}
            </Box>
            <IconButton
              size="small"
              onClick={() => navigate(ruta)}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                bgcolor: "#fff",
                border: "0.5px solid #E2EBF0",
                "&:hover": { bgcolor: C.blueLight },
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 11, color: C.blueDark }} />
            </IconButton>
          </Box>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              lineHeight: 1.3,
              textAlign: "center",
              textShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            {person.first_name} {person.last_name}
          </Typography>

          <Box
            sx={{
              fontSize: "0.67rem",
              fontWeight: 700,
              px: 1.2,
              py: 0.25,
              borderRadius: "20px",
              bgcolor: C.yellow,
              color: C.black,
            }}
          >
            {translateRol(roleName)}
          </Box>
        </Box>

        {/* Barra decorativa */}
        <Box sx={{ display: "flex", height: 3 }}>
          <Box sx={{ flex: 1, bgcolor: C.blue }} />
          <Box sx={{ flex: 1, bgcolor: C.pink }} />
          <Box sx={{ flex: 1, bgcolor: C.yellow }} />
        </Box>

        {/* Info rápida */}
        <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
          <InfoRow
            icon={<EmailRoundedIcon sx={{ fontSize: 15 }} />}
            label="Correo"
            value={email}
          />
          <Divider />
          <InfoRow
            icon={<PhoneRoundedIcon sx={{ fontSize: 15 }} />}
            label="Teléfono"
            value={
              person.phone
                ? `${person.address?.city?.state?.country?.phone_code ?? ""} ${person.phone.number}`
                : null
            }
          />
          <Divider />
          <InfoRow
            icon={<CalendarTodayRoundedIcon sx={{ fontSize: 15 }} />}
            label="Miembro desde"
            value={memberSince}
          />
        </Box>
      </Paper>

      {/* ── Paneles de info ───────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Datos personales */}
        <SectionPanel label="Datos personales">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 0,
            }}
          >
            <InfoRow
              icon={<CakeRoundedIcon sx={{ fontSize: 15 }} />}
              label="Edad"
              value={`${getAge(person.birthdate)} años`}
            />
            <InfoRow
              icon={<WcRoundedIcon sx={{ fontSize: 15 }} />}
              label="Género"
              value={person.gender?.name}
            />
            <InfoRow
              icon={<FavoriteRoundedIcon sx={{ fontSize: 15 }} />}
              label="Estado civil"
              value={person.marital_status?.name}
            />
            <InfoRow
              icon={<WorkRoundedIcon sx={{ fontSize: 15 }} />}
              label="Ocupación"
              value={person.occupation?.name}
            />
            <InfoRow
              icon={<BadgeRoundedIcon sx={{ fontSize: 15 }} />}
              label={person.identification?.type ?? "Identificación"}
              value={person.identification?.number}
            />
          </Box>
        </SectionPanel>

        {/* Dirección */}
        <SectionPanel label="Dirección">
          <InfoRow
            icon={<HomeRoundedIcon sx={{ fontSize: 15 }} />}
            label="Dirección principal"
            value={person.address?.primary_address}
          />

          {person.address?.secondary_address && (
            <>
              <Divider />
              <InfoRow
                icon={<HomeRoundedIcon sx={{ fontSize: 15 }} />}
                label="Dirección secundaria"
                value={person.address.secondary_address}
              />
            </>
          )}

          <Divider />

          <InfoRow
            icon={<HomeRoundedIcon sx={{ fontSize: 15 }} />}
            label="Ciudad"
            value={person.address?.city?.name}
          />

          <Divider />

          <InfoRow
            icon={<HomeRoundedIcon sx={{ fontSize: 15 }} />}
            label="Provincia"
            value={person.address?.city?.state?.name}
          />

          <Divider />

          <InfoRow
            icon={<HomeRoundedIcon sx={{ fontSize: 15 }} />}
            label="País"
            value={person.address?.city?.state?.country?.name}
          />
        </SectionPanel>

        {/* Datos profesionales — solo si tiene rol Professional */}
        {person.professional && (
          <SectionPanel label="Datos profesionales">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <InfoRow
                icon={<MedicalServicesRoundedIcon sx={{ fontSize: 15 }} />}
                label="Título"
                value={person.professional.title}
              />
              <InfoRow
                icon={<MedicalServicesRoundedIcon sx={{ fontSize: 15 }} />}
                label="Especialidad"
                value={person.professional.specialty}
              />
            </Box>
          </SectionPanel>
        )}
      </Box>
    </Box>
  );
}
