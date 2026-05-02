// FINAL
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CardAdmin } from "@/types/CardAdmin";
import { useRoleData } from "@/observer/RoleDataContext";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { translateRol } from "@/utils/utils";
import Progress from "@components/Progress";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ProfileView from "@components/ProfileView";
import DataInformation from "@admin/DataInformation";
import Table from "@components/Table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttributionOutlinedIcon from "@mui/icons-material/AttributionOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Person } from "@/typesResponse/Person";

const roleChipSx = (role: string) => {
  if (role === "Professional") return { bgcolor: "#E1F5EE", color: "#0F6E56" };
  if (role === "Client") return { bgcolor: "#E6F1FB", color: "#185FA5" };
  return { bgcolor: "#EEEDFE", color: "#534AB7" };
};

const columns: GridColDef[] = [
  {
    field: "first_name",
    headerName: "Nombre",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "last_name",
    headerName: "Apellido",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "role",
    headerName: "Rol",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
    renderCell: (params) => {
      const roleName = params.row.user_account?.role?.name ?? "";
      return (
        <Chip
          label={translateRol(roleName)}
          size="small"
          sx={{
            fontSize: 10,
            fontWeight: 500,
            height: 20,
            "& .MuiChip-label": { px: 1 },
            ...roleChipSx(roleName),
          }}
        />
      );
    },
  },
  {
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 4,
    resizable: false,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        {params.row.user_account?.email}
      </Typography>
    ),
  },
  {
    field: "phone",
    headerName: "Celular",
    disableColumnMenu: true,
    flex: 3,
    resizable: false,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        {params.row.phone?.number}
      </Typography>
    ),
  },
];

export default function UsersList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();

  const users: Person[] = data.persons ?? [];
  const selectedUser =
    selectedId !== null
      ? (users.find((u) => String(u.user_id) === String(selectedId)) ?? null)
      : null;

  const buttonsData: CardAdmin[] = [
    {
      label: "Usuarios activos",
      value: users.length,
      icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Profesionales",
      value: users.filter((u) => u.user_account.role.name === "Professional")
        .length,
      icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Pacientes",
      value: users.filter((u) => u.user_account.role.name === "Client").length,
      icon: <AttributionOutlinedIcon fontSize="inherit" />,
    },
  ];

  if (loading) return <Progress />;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Lista de usuarios" chip="Usuarios" />

      {/* Stats + botón agregar */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <DataInformation buttonsData={buttonsData} />

        <Box sx={{ width: "0.5px", height: 36, bgcolor: "divider", mx: 0.5 }} />

        <Button
          onClick={() => navigate("/nuevo-usuario")}
          startIcon={<AddRoundedIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            bgcolor: "#E1F5EE",
            color: "#0F6E56",
            border: "0.5px solid #9FE1CB",
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            height: "auto",
            textTransform: "none",
            "&:hover": { bgcolor: "#9FE1CB" },
          }}
        >
          Agregar usuario
        </Button>
      </Box>

      {/* Tabla + panel de perfil */}
      <Grid container spacing={1.5} alignItems="flex-start">
        <Grid size={selectedUser ? 8 : 12}>
          {users.length ? (
            <Table<Person>
              columns={columns}
              rows={users}
              getRowId={(row) => row.user_id}
              selectedId={selectedId}
              onRowSelect={setSelectedId}
            />
          ) : (
            <Typography
              sx={{
                fontSize: 13,
                color: "text.disabled",
                textAlign: "center",
                py: 4,
              }}
            >
              No hay usuarios registrados
            </Typography>
          )}
        </Grid>

        {selectedUser && (
          <Grid size={4}>
            <ProfileView user={selectedUser} isRowPosition={false} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
