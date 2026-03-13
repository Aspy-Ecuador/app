import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { ButtonAdmin } from "@/types/ButtonAdmin";
import { GridColDef } from "@mui/x-data-grid";
import { PersonResponse } from "@/types/responses/PersonResponse";
import { useRoleData } from "@/observer/RoleDataContext";
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
          {params.row.user_account.role.name}
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
  const { loading } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [user, setUser] = useState<PersonResponse | null>(null);
  const [users, setUsers] = useState<PersonResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const personsData = localStorage.getItem("persons");
      if (personsData) {
        const persons: PersonResponse[] = JSON.parse(personsData);
        setUsers(persons);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = users.find(
        (item) => item.person_id === rowSelection[0],
      );
      if (selectedUser) {
        setUser(selectedUser);
      }
    } else {
      setUser(null);
    }
  }, [rowSelection, users]);

  const buttonsData: ButtonAdmin[] = [
    {
      label: "Usuarios Activos",
      value: users.length,
      icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Profesionales",
      value: users.filter((user) => user.user_account.role.role_id === 2)
        .length,
      icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Pacientes",
      value: users.filter((user) => user.user_account.role.role_id === 3)
        .length,
      icon: <AttributionOutlinedIcon fontSize="inherit" />,
    },
  ];

  const handleCreate = () => {
    navigate(`/nuevo-usuario`);
  };

  if (loading || users.length === 0) {
    return <Progress />;
  }

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
          {users.length ? (
            <Table<PersonResponse>
              columns={columns}
              rows={users}
              getRowId={(row) => row.person_id}
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
            <ProfileView user={user} isRowPosition={false} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
