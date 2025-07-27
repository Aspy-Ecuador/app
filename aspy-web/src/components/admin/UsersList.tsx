import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import { profesionales } from "@data/Profesionales";
import { pacientes } from "@data/Pacientes";
import { ButtonAdmin } from "@/types/ButtonAdmin";
import { columnsUsersAdmin } from "@utils/columns";
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

export default function UsersList() {
  //Fila seleccionada
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Usuario seleccionado
  const [user, setUser] = useState<User | null>(null);

  //Theme
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  // Reemplazar usuariosApp con datos obtenidos desde localStorage y asegurar que todas las filas tengan un id único
  const getUsersFromLocalStorage = () => {
    const usersData = localStorage.getItem("userAccounts");
    return usersData
      ? JSON.parse(usersData).map((user, index) => ({
          ...user,
          id: user.user_id || index // Asignar un id único si no existe
        }))
      : [];
  };

  const users = getUsersFromLocalStorage();

  const buttonsData: ButtonAdmin[] = [
  {
    label: "Usuarios Activos",
    value: users.length,
    icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
  },
  {
    label: "Profesionales",
    value: users.filter((user) => user.role === "Profesional").length,
    icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
  },
  {
    label: "Pacientes",
    value: users.filter((user) => user.role === "Paciente").length,
    icon: <AttributionOutlinedIcon fontSize="inherit" />,
  },
];

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = users.find((item) => item.user_id === rowSelection[0]);
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

        <Grid size={8} className={themeClass + " grid-tabla"}>
          <Table<User>
            columns={columnsUsersAdmin}
            rows={users}
            getRowId={(row) => row.id} // Usar la propiedad id como identificador único
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {user && (
          <Grid size={4} className={themeClass}>
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
