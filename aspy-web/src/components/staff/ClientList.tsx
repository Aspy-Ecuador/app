// FINAL
import { useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Table from "@components/Table";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "@components/Header";
import Progress from "../Progress";
import { getAge } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Typography from "@mui/material/Typography";
import { getClient } from "@/utils/utils";
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
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 2,
    renderCell: (params) => {
      return (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">
            {params.row.user_account?.email}
          </Typography>
        </Box>
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
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">
            {getAge(params.row.birthdate)}
          </Typography>
        </Box>
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
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">{params.row.occupation.name}</Typography>
        </Box>
      );
    },
    resizable: false,
  },
  {
    field: "phone",
    headerName: "Celular",
    disableColumnMenu: true,
    flex: 3,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.phone?.number}</Typography>
      </Box>
    ),
  },
];

export default function ClientsList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();

  //Usuario seleccionado
  const users: Person[] = getClient(data.persons ?? []);

  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ??
        null)
      : null;

  const handleCreatePatient = () => {
    const newPath = `/registrarUsuario`;
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
          <Table<Person>
            columns={columns}
            rows={users}
            getRowId={(row) => row.user_id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>
        {selectedUser && (
          <Grid size={4}>
            <ProfileView user={selectedUser} isRowPosition={false} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
