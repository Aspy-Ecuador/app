// FINAL
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import OverviewPersona from "@professional/OverviewPersona";
import Table from "@components/Table";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import { getAge, getClients, ocupacionDe } from "@/utils/utils";
import { getAuthenticatedUserID } from "@/utils/store";
import type { Person } from "@/typesResponse/Person";
import { vh } from "@shared-theme/pantallaGrande";
import BarraFiltros from "@components/tabla/BarraFiltros";
import { coincide, useFiltros } from "@components/tabla/filtros";

const SIN_FILTROS = { buscar: "" };

const columns: GridColDef[] = [
  {
    field: "first_name",
    headerName: "Nombres",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 110,
    resizable: false,
  },
  {
    field: "last_name",
    headerName: "Apellidos",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 110,
    resizable: false,
  },
  {
    field: "email",
    headerName: "Correo",
    disableColumnMenu: true,
    flex: 3,
    minWidth: 160,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.user_account?.email}</Typography>
      </Box>
    ),
  },
  {
    field: "age",
    headerName: "Edad",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 70,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{getAge(params.row.birthdate)}</Typography>
      </Box>
    ),
  },
  {
    field: "occupation",
    headerName: "Ocupación",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 120,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{ocupacionDe(params.row)}</Typography>
      </Box>
    ),
  },
  {
    field: "phone",
    headerName: "Celular",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 120,
    resizable: false,
    renderCell: (params) => (
      <Box display="flex" alignItems="center" height="100%">
        <Typography variant="body1">{params.row.phone?.number}</Typography>
      </Box>
    ),
  },
];

export default function PatientsList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading } = useRoleData();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { valores: filtros, cambiar, limpiar, hayFiltros } = useFiltros(SIN_FILTROS);

  const users: Person[] = useMemo(
    () => (loading ? [] : getClients(data.appointments ?? [], data.persons ?? [], getAuthenticatedUserID())),
    [loading, data.appointments, data.persons],
  );

  const filtrados = useMemo(
    () => users.filter((u) => coincide(filtros.buscar, u.first_name, u.last_name, u.user_account?.email, u.phone?.number)),
    [users, filtros],
  );

  if (loading) return <Progress />;

  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ?? null)
      : null;

  const handleMoreInfo = () => {
    if (selectedUser) {
      navigate(`${location.pathname}/${selectedUser.user_id}`);
    }
  };

  const overviewPanel = selectedUser && (
    <OverviewPersona
      key={selectedUser.user_id}
      selectedData={selectedUser}
      moreInfo={handleMoreInfo}
    />
  );

  return (
    <Box sx={{ p: 2, minHeight: "100%" }}>
      <Grid container spacing={1}>

        {/* Header */}
        <Grid size={12}>
          <SimpleHeader text="Lista de pacientes" chip="Pacientes" />
        </Grid>

        {users.length > 0 && (
          <Grid size={12}>
            <BarraFiltros
              id="mis-pacientes"
              busqueda={{ value: filtros.buscar, onChange: (v) => cambiar("buscar", v), placeholder: "Nombres, apellidos, correo o celular" }}
              total={users.length}
              mostrados={filtrados.length}
              que={["paciente", "pacientes"]}
              hayFiltros={hayFiltros}
              onLimpiar={limpiar}
              exportar={{
                titulo: "Lista de pacientes",
                archivo: "mis-pacientes",
                filas: filtrados,
                columnas: [
                  { titulo: "Nombres", valor: (p) => p.first_name },
                  { titulo: "Apellidos", valor: (p) => p.last_name },
                  { titulo: "Correo", valor: (p) => p.user_account?.email },
                  { titulo: "Celular", valor: (p) => p.phone?.number },
                  { titulo: "Edad", valor: (p) => getAge(p.birthdate) },
                  { titulo: "Ocupación", valor: (p) => ocupacionDe(p) },
                ],
              }}
            />
          </Grid>
        )}

        {/* Tabla */}
        <Grid size={{ xs: 12, md: selectedUser && !isMobile ? 8 : 12 }} sx={{ overflowX: "auto" }}>
          {users.length ? (
            <Table<Person>
              columns={columns}
              rows={filtrados}
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
        </Grid>

        {/* Panel lateral — solo desktop */}
        {selectedUser && !isMobile && (
          <Grid size={{ md: 4 }}>
            {overviewPanel}
          </Grid>
        )}
      </Grid>

      {/* Drawer — solo móvil/tablet */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={Boolean(selectedUser)}
          onClose={() => setSelectedId(null)}
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            },
          }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              p: 2,
              maxHeight: vh(85),
              boxShadow: "0px -4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "action.disabled",
              borderRadius: 2,
              mx: "auto",
              mb: 2,
              flexShrink: 0,
            }}
          />
          {overviewPanel}
        </Drawer>
      )}
    </Box>
  );
}