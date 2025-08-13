import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import { ButtonAdmin } from "@/types/ButtonAdmin";
import { useRoleData } from "@/observer/RoleDataContext";
import { GridColDef } from "@mui/x-data-grid";
import { getUsers } from "@/utils/utils";
import { translateRol } from "@/utils/utils";
import Progress from "@components/Progress";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
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
    renderCell: (params) => {
      return (
        <Typography variant="body1">
          {translateRol(params.row.role.name)}
        </Typography>
      );
    },
    resizable: false,
  },
  {
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 4,
    resizable: false,
  },
];

export default function UsersList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [user, setUser] = useState<User | null>(null);
  const { data, loading } = useRoleData();

  const navigate = useNavigate();
  const location = useLocation();

  const users: User[] = getUsers(data ?? []);

  const buttonsData: ButtonAdmin[] = [
    {
      label: "Usuarios Activos",
      value: users.length,
      icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Profesionales",
      value: users.filter((user) => user.role.name === "Profesional").length,
      icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Pacientes",
      value: users.filter((user) => user.role.name === "Paciente").length,
      icon: <AttributionOutlinedIcon fontSize="inherit" />,
    },
  ];

  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = users.find(
        (item) => item.user_id === rowSelection[0]
      );
      if (selectedUser) {
        setUser(selectedUser);
      }
    } else {
      setUser(null);
    }
  }, [rowSelection]);

  const handleEdit = () => {
    if (user) {
      setRowSelection([]);
      navigate(`${location.pathname}/${user.user_id}`);
    }
  };

  const handleCreate = () => {
    navigate(`/nuevo-usuario`);
  };

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
              onClick={handleCreate}
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

        <Grid size={8}>
          {loading ? (
            <Progress />
          ) : users.length ? (
            <Table<User>
              columns={columns}
              rows={users}
              getRowId={(row) => row.user_id}
              rowSelectionModel={rowSelection}
              onRowSelectionChange={(newSelection) =>
                setRowSelection(newSelection)
              }
            />
          ) : (
            <Typography>No hay usuarios</Typography>
          )}
        </Grid>

        {user && (
          <Grid size={4}>
            <ProfileView
              user={user}
              onEdit={handleEdit}
              isRowPosition={false}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
