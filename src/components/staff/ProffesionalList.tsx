import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/types/User";
import { profesionales } from "@data/Profesionales";
import { columnsUsers } from "@utils/columns";
import Table from "@components/Table";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";

export default function ProffesionalList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  const theme = useTheme().palette.mode;
  const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  //Usuario seleccionado
  const [user, setUser] = useState<User | null>(null);

  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = profesionales.find(
        (item) => item.id === rowSelection[0]
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
      const newPath = `${location.pathname}/${user.id}`;
      navigate(newPath);
    }
  };

  const handleCreateProfessional = () => {
    const newPath = `/crear-profesional`;
    navigate(newPath);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Profesionales"}
            isCreate={true}
            textIcon={"Agregar Profesional"}
            handle={handleCreateProfessional}
          />
        </Grid>
        <Grid size={8} className={themeClass + " grid-tabla"}>
          <Table<User>
            columns={columnsUsers}
            rows={profesionales}
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
