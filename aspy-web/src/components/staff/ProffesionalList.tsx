import { useState, useEffect } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/types/User";
import { columnsProfessional } from "@utils/columns";
import Table from "@components/Table";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Header from "@components/Header";
import { useRoleData } from "@/observer/RoleDataContext";
import { getUsers } from "@/utils/utils";
import Progress from "@components/Progress";

export default function ProffesionalList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  //Usuario seleccionado
  const [user, setUser] = useState<User | null>(null);

  const { data, loading } = useRoleData();
  const users: User[] = getUsers(data);
  const professionals: User[] = users.filter((user) => user.role_id === 2);
  console.log(professionals);
  //Mostrar el usuario
  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = professionals.find(
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

  const handleCreateProfessional = () => {
    const newPath = `/crear-profesional`;
    navigate(newPath);
  };

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Profesionales"}
            isCreate={true}
            textIcon={"Nuevo Profesional"}
            handle={handleCreateProfessional}
          />
        </Grid>
        <Grid size={8}>
          <Table<User>
            columns={columnsProfessional}
            rows={professionals}
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
