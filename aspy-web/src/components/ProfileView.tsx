// FINAL
import type { Person } from "@/typesResponse/Person";
import type { UserLogin } from "@/types/UserLogin";
import { getAge } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

type ProfileProps = {
  user: Person | UserLogin;
  isRowPosition: boolean;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "text.disabled",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>
      {value || "—"}
    </Typography>
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
      border: "0.5px solid",
      borderColor: "divider",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        px: 1.75,
        py: 1.25,
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.disabled",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Paper>
);

export default function ProfileView({ user, isRowPosition }: ProfileProps) {
  const navigate = useNavigate();
  const person = "person" in user ? user.person : user;
  const roleName =
    "person" in user ? user.role.name : user.user_account.role.name;

  const initials =
    `${person.first_name?.[0] ?? ""}${person.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isRowPosition ? "220px minmax(0,1fr)" : "1fr",
        gap: 1.5,
        alignItems: "start",
      }}
    >
      {/* Panel avatar */}
      <SectionPanel label="Perfil">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          {/* Avatar con iniciales + botón editar */}
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
                fontWeight: 500,
                color: "#0F6E56",
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              {initials}
            </Box>
            <IconButton
              size="small"
              onClick={() => navigate(`/editar/${person.user_id}`)}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                bgcolor: "background.paper",
                border: "0.5px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 11 }} />
            </IconButton>
          </Box>

          <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
            {person.first_name} {person.last_name}
          </Typography>

          <Box
            sx={{
              fontSize: 10,
              fontWeight: 500,
              px: 1.25,
              py: 0.25,
              borderRadius: "20px",
              bgcolor: "#E6F1FB",
              color: "#185FA5",
            }}
          >
            {roleName}
          </Box>
        </Box>
      </SectionPanel>

      {/* Panel info */}
      <SectionPanel label="Información personal">
        {/* Sobre mí */}
        <Box
          sx={{
            p: 1.25,
            mb: 2,
            bgcolor: "action.hover",
            borderRadius: 2,
            border: "0.5px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.6 }}
          >
            Hola, soy {roleName} en Fundación ASPY :)
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Field label="Nombre" value={person.first_name} />
          <Field label="Apellido" value={person.last_name} />
          <Field label="Edad" value={`${getAge(person.birthdate)} años`} />
          <Field label="Género" value={person.gender?.name ?? "—"} />
          <Field label="Rol" value={roleName} />
        </Box>
      </SectionPanel>
    </Box>
  );
}
