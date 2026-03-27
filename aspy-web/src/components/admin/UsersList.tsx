import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CardAdmin } from "@/types/CardAdmin";
import { useRoleData } from "@/observer/RoleDataContext";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRowId } from "@mui/x-data-grid";
import { translateRol } from "@/utils/utils";
import Progress from "@components/Progress";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProfileView from "@components/ProfileView";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DataInformation from "@admin/DataInformation";
import Table from "@components/Table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttributionOutlinedIcon from "@mui/icons-material/AttributionOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import type { Person } from "@/typesResponse/Person";

const columns: GridColDef[] = [
  {
    field: "first_name",
    headerName: "Nombres",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "last_name",
    headerName: "Apellidos",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "role",
    headerName: "Rol",
    disableColumnMenu: true,
    flex: 2,
    renderCell: (params) => (
      <Typography variant="body1">
        {translateRol(params.row.user_account?.role?.name)}
      </Typography>
    ),
    resizable: false,
  },
  {
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 4,
    renderCell: (params) => (
      <Typography variant="body1">{params.row.user_account?.email}</Typography>
    ),
    resizable: false,
  },
  {
    field: "phone",
    headerName: "Celular",
    disableColumnMenu: true,
    flex: 3,
    renderCell: (params) => (
      <Typography variant="body1">{params.row.phone?.number}</Typography>
    ),
    resizable: false,
  },
];

export default function UsersList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();

  const users: Person[] = data.persons ?? [];
  console.log(users);
  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ??
        null)
      : null;

  const buttonsData: CardAdmin[] = [
    {
      label: "Usuarios Activos",
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
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Usuarios"} />
        </Grid>

        <Grid size={12}>
          <Stack direction="row" spacing={2}>
            <DataInformation buttonsData={buttonsData} />
            <IconButton
              size="large"
              className="botones-admin"
              onClick={() => navigate("/nuevo-usuario")}
            >
              <AddCircleOutlineOutlinedIcon fontSize="inherit" />
              <Typography
                variant="body1"
                className="typo-tittle-boton"
                sx={{ marginLeft: 2 }}
              >
                Agregar Usuario
              </Typography>
            </IconButton>
          </Stack>
        </Grid>

        {/* Se expande a 12 si no hay selección, a 8 si hay */}
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
            <Typography>No hay usuarios</Typography>
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
