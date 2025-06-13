import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import { profesionales } from "@data/Profesionales";
import { pacientes } from "@data/Pacientes";
import { ButtonAdmin } from "@/types/ButtonAdmin";
import { columnsUsersAdmin } from "@utils/columns";
import { usuarios } from "@data/Usuarios";
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

const totalUsers = profesionales.length + pacientes.length;
const totalProfessionals = profesionales.length;
const totalPatients = pacientes.length;

const buttonsData: ButtonAdmin[] = [
  {
    label: "Usuarios Activos",
    value: totalUsers,
    icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
  },
  {
    label: "Profesionales",
    value: totalProfessionals,
    icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
  },
  {
    label: "Pacientes",
    value: totalPatients,
    icon: <AttributionOutlinedIcon fontSize="inherit" />,
  },
];

export default function UsersList() {
  //Fila seleccionada
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Usuario seleccionado
  const [user, setUser] = useState<User | null>(null);

  //Theme
  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = usuarios.find((item) => item.id === rowSelection[0]);
      if (selectedUser) {
        setUser(selectedUser);
      }
    } else {
      setUser(null); // O setUser(defaultUser) si prefieres uno por defecto
    }
  }, [rowSelection]);

  //Ruta para editar y crear
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    if (user) {
      const newPath = `${location.pathname}/${user.id}`;
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
                Agrergar Usuario
              </Typography>
            </IconButton>
          </Stack>
        </Grid>

        <Grid size={8} className={themeClass + " grid-tabla"}>
          <Table<User>
            columns={columnsUsersAdmin}
            rows={usuarios}
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
