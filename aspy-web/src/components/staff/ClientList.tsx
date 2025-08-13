import { useState, useEffect } from "react";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/types/User";
import Table from "@components/Table";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import Progress from "../Progress";
import { getAge, getOccupation, getUsers } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Typography from "@mui/material/Typography";

export const columns: GridColDef[] = [
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
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 2,
    resizable: false,
  },
  {
    field: "age",
    headerName: "Edad",
    disableColumnMenu: true,
    flex: 2,
    renderCell: (params) => {
      return (
        <Typography variant="body1">{getAge(params.row.birthdate)}</Typography>
      );
    },
    resizable: false,
  },
  {
    field: "occupation",
    headerName: "Ocupación",
    disableColumnMenu: true,
    flex: 2,
    renderCell: (params) => {
      return (
        <Typography variant="body1">
          {getOccupation(params.row.occupation)}
        </Typography>
      );
    },
    resizable: false,
  },
];

export default function ClientsList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [user, setUser] = useState<User | null>(null);
  const { data, loading } = useRoleData();

  const users: User[] = getUsers(data);
  const clients: User[] =
    users.filter((user: User) => user.role_id === 3) || [];

  //Mostrar el usuario
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

  //Ruta para editar y crear
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    if (user) {
      const newPath = `${location.pathname}/${user.user_id}`;
      navigate(newPath);
    }
  };

  const handleCreatePatient = () => {
    const newPath = `/crear-paciente`;
    navigate(newPath);
  };

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Clientes"}
            isCreate={true}
            textIcon={"Nuevo Cliente"}
            handle={handleCreatePatient}
          />
        </Grid>
        <Grid size={8}>
          <Table<User>
            columns={columns}
            rows={clients}
            getRowId={(row) => row.user_id}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
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
