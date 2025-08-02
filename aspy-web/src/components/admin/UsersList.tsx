import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import { ButtonAdmin } from "@/types/ButtonAdmin";
import { columnsUsersAdmin } from "@utils/columns";
import { useRoleData } from "@/observer/RoleDataContext";
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
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { userAdapter } from "@/adapters/userAdapter";

export default function UsersList() {
  //Fila seleccionada
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Usuario seleccionado
  const [user, setUser] = useState<User | null>(null);

  const { data } = useRoleData();

  const users: User[] = mapUsers(data.persons, data.userAccounts, data.roles);

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
      setUser(null); // O setUser(defaultUser) si prefieres uno por defecto
    }
  }, [rowSelection, users]);

  //Ruta para editar y crear
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    if (user) {
      setRowSelection([]); // Desmarcar fila
      const newPath = `${location.pathname}/${user.user_id}`;
      navigate(newPath);
    }
  };

  const handleCreate = () => {
    const newPath = `/nuevo-usuario`;
    navigate(newPath);
  };

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
          <Table<User>
            columns={columnsUsersAdmin}
            rows={users}
            getRowId={(row) => row.user_id} // Usar la propiedad id como identificador único
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {user && (
          <Grid size={4}>
            <ProfileView
              user_info={user}
              onEdit={handleEdit}
              isRowPosition={false}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

function mapUsers(
  persons: PersonResponse[],
  userAccounts: UserAccountResponse[],
  roles: RoleResponse[]
): User[] {
  return userAccounts
    .map((account) => {
      const person = persons.find((p) => p.person_id === account.user_id); // o usa otro campo si aplica
      const role = roles.find((r) => r.role_id === account.role_id);
      if (person && role) {
        return userAdapter(person, role, account);
      }
      return null;
    })
    .filter((user): user is User => user !== null);
}
