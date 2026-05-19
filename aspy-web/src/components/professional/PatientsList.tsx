// FINAL
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import OverviewPersona from "@professional/OverviewPersona";
import Table from "@components/Table";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { getAge, getClients } from "@/utils/utils";
import { getAuthenticatedUserID } from "@/utils/store";
import type { Person } from "@/typesResponse/Person";

// ─── Columnas desktop ─────────────────────────────────────────────
const columnsDesktop: GridColDef[] = [
  { field: "first_name", headerName: "Nombres",  disableColumnMenu: true, flex: 2, resizable: false },
  { field: "last_name",  headerName: "Apellidos", disableColumnMenu: true, flex: 2, resizable: false },
  {
    field: "email", headerName: "Correo", disableColumnMenu: true, flex: 2, resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.user_account?.email}</Typography>
      </Box>
    ),
  },
  {
    field: "age", headerName: "Edad", disableColumnMenu: true, flex: 1, resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{getAge(params.row.birthdate)}</Typography>
      </Box>
    ),
  },
  {
    field: "occupation", headerName: "Ocupación", disableColumnMenu: true, flex: 2, resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.occupation.name}</Typography>
      </Box>
    ),
  },
  {
    field: "phone", headerName: "Celular", disableColumnMenu: true, flex: 2, resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.phone?.number}</Typography>
      </Box>
    ),
  },
];

// ─── Columnas móvil (solo lo esencial) ───────────────────────────
const columnsMobile: GridColDef[] = [
  { field: "first_name", headerName: "Nombre",  disableColumnMenu: true, flex: 2, resizable: false },
  { field: "last_name",  headerName: "Apellido", disableColumnMenu: true, flex: 2, resizable: false },
  {
    field: "age", headerName: "Edad", disableColumnMenu: true, flex: 1, resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body2">{getAge(params.row.birthdate)}</Typography>
      </Box>
    ),
  },
];

// ─── Componente ───────────────────────────────────────────────────
export default function PatientsList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();
  const location = useLocation();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (loading) return <Progress />;

  const users: Person[] = getClients(
    data.appointments,
    data.persons,
    getAuthenticatedUserID(),
  );

  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ?? null)
      : null;

  const handleMoreInfo = () => {
    if (selectedUser) {
      navigate(`${location.pathname}/${selectedUser.user_id}`);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, minHeight: "100%" }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <SimpleHeader text="Lista de pacientes" chip="Pacientes" />

      {/* ── Layout principal ─────────────────────────────────────── */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {/* Tabla */}
        <Box
          sx={{
            flex: { xs: "1 1 auto", md: selectedUser ? "0 0 58%" : "1 1 100%" },
            width: "100%",
            minWidth: 0,
            transition: "flex 0.3s ease",
          }}
        >
          {users.length ? (
            <Table<Person>
              columns={isMobile ? columnsMobile : columnsDesktop}
              rows={users}
              getRowId={(row) => row.user_id}
              selectedId={selectedId}
              onRowSelect={setSelectedId}
            />
          ) : (
            <Box
              sx={{
                py: { xs: 6, md: 10 },
                textAlign: "center",
                borderRadius: 3,
                border: "1.5px dashed",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No hay pacientes registrados
              </Typography>
            </Box>
          )}
        </Box>

        {/* Overview — debajo en móvil, lateral en desktop */}
        {selectedUser && (
          <Slide
            direction={isMobile ? "up" : "left"}
            in={!!selectedUser}
            mountOnEnter
            unmountOnExit
          >
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "0 0 40%" },
                width: "100%",
              }}
            >
              <OverviewPersona
                key={selectedUser.user_id}
                selectedData={selectedUser}
                moreInfo={handleMoreInfo}
              />
            </Box>
          </Slide>
        )}
      </Box>
    </Box>
  );
}