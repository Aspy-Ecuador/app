import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import OverviewPersona from "@professional/OverviewPersona";
import Table from "@components/Table";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { getAge, getClients } from "@/utils/utils";
import { getAuthenticatedUserID } from "@/utils/store";

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
    resizable: false,
  },
];

export default function PatientsList() {
  const { data, loading } = useRoleData();
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [user, setUser] = useState<User | null>(null);

  const clients: User[] = getClients(data, getAuthenticatedUserID()) ?? [];

  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = clients.find(
        (item) => item.user_id === rowSelection[0]
      );
      if (selectedUser) {
        setUser(selectedUser);
      }
    } else {
      setUser(null);
    }
  }, [rowSelection]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMoreInfo = () => {
    if (user) {
      const newPath = `${location.pathname}/${user.user_id}`;
      navigate(newPath);
    }
  };

  if (loading) return <Progress />;

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9} marginBottom={"4px"}>
              <Typography variant="h3">Pacientes</Typography>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={8}>
          {loading ? (
            <Progress />
          ) : clients.length ? (
            <Table<User>
              columns={columns}
              rows={clients}
              getRowId={(row) => row.user_id}
              rowSelectionModel={rowSelection}
              onRowSelectionChange={(newSelection) =>
                setRowSelection(newSelection)
              }
            />
          ) : (
            <Typography>No hay Clientes</Typography>
          )}
        </Grid>
        {user && (
          <Grid size={4}>
            <OverviewPersona
              key={user.user_id}
              selectedData={user}
              moreInfo={handleMoreInfo}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
