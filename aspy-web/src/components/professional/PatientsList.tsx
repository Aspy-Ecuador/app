// FINAL
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import OverviewPersona from "@professional/OverviewPersona";
import Table from "@components/Table";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { getAge, getClients, translateRol } from "@/utils/utils";
import { getAuthenticatedUserID } from "@/utils/store";
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
    flex: 2,
    renderCell: (params) => {
      return (
        <Typography variant="body1">
          {params.row.user_account?.email}
        </Typography>
      );
    },
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
        <Typography variant="body1">{params.row.occupation.name}</Typography>
      );
    },
    resizable: false,
  },
];

export default function PatientsList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <Progress />;

  const users: Person[] = getClients(
    data.appointments,
    data.persons,
    getAuthenticatedUserID(),
  );

  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ??
        null)
      : null;

  const handleMoreInfo = () => {
    if (selectedUser) {
      const newPath = `${location.pathname}/${selectedUser.user_id}`;
      navigate(newPath);
    }
  };

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
          ) : users.length ? (
            <Table<Person>
              columns={columns}
              rows={users}
              getRowId={(row) => row.user_id}
              selectedId={selectedId}
              onRowSelect={setSelectedId}
            />
          ) : (
            <Typography>No hay Clientes</Typography>
          )}
        </Grid>
        {selectedUser && (
          <Grid size={4}>
            <OverviewPersona
              key={selectedUser.user_id}
              selectedData={selectedUser}
              moreInfo={handleMoreInfo}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
