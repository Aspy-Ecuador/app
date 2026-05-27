// FINAL
import { useState } from "react";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Table from "@components/Table";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import Header from "@components/Header";
import { useRoleData } from "@/observer/RoleDataContext";
import { getProfessional } from "@/utils/utils";
import Progress from "@components/Progress";
import type { Person } from "@/typesResponse/Person";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import personAPI from "@API/personAPI";
import Typography from "@mui/material/Typography";

export default function ProffesionalList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading, refreshPersons } = useRoleData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [togglingMap, setTogglingMap] = useState<Record<number, boolean>>({});

  const users: Person[] = getProfessional(data.persons ?? []);

  const selectedUser =
    selectedId !== null
      ? (users.find((item) => String(item.user_id) === String(selectedId)) ??
        null)
      : null;

  const handleCreateProfessional = () => {
    navigate("/registrarProfesional");
  };

  async function handleToggleAvailable(person_id: number, current: boolean) {
    setTogglingMap((prev) => ({ ...prev, [person_id]: true }));
    try {
      await personAPI.changeAvailable(person_id, !current);
      await refreshPersons(); // o el refresh que uses en useRoleData
    } catch (e) {
      console.error("Error al cambiar disponibilidad:", e);
    } finally {
      setTogglingMap((prev) => ({ ...prev, [person_id]: false }));
    }
  }

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
      flex: 4,
      minWidth: 160,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">
            {params.row.user_account?.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "titulo",
      headerName: "Título",
      disableColumnMenu: true,
      flex: 3,
      minWidth: 120,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">
            {params.row.professional.title}
          </Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Celular",
      disableColumnMenu: true,
      flex: 3,
      minWidth: 120,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body1">{params.row.phone?.number}</Typography>
        </Box>
      ),
    },
    {
      field: "is_available",
      headerName: "Habilitado",
      disableColumnMenu: true,
      flex: 1,
      minWidth: 90,
      sortable: false,
      filterable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const personId: number = params.row.person_id;
        const isAvailable: boolean =
          params.row.user_account?.is_available ?? true;
        const isToggling = togglingMap[personId] ?? false;

        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            {isToggling ? (
              <CircularProgress size={14} sx={{ color: "#0F6E56" }} />
            ) : (
              <Switch
                size="small"
                checked={isAvailable}
                onChange={() => handleToggleAvailable(personId, isAvailable)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#1D9E75" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    bgcolor: "#1D9E75",
                  },
                }}
              />
            )}
          </Box>
        );
      },
    },
  ];

  if (loading) return <Progress />;

  const profilePanel = selectedUser && (
    <ProfileView user={selectedUser} isRowPosition={false} />
  );

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        {/* Header - Aplicando corrección de centrado estético para el '+' */}
        <Grid
          size={12}
          className="grid-p-patients-tittle"
          sx={{
            // Apuntamos al botón dentro del Header para garantizar simetría perfecta
            "& button": {
              display: "inline-flex !important",
              alignItems: "center !important",
              justifyContent: "center !important",
              minWidth: "40px !important", // Evita que se estire horizontalmente si era un botón ancho
              width: 40,
              height: 40,
              padding: 0, // Resetea paddings asimétricos
              borderRadius: "50%", // Lo mantiene perfectamente circular si es un botón de icono
            },
            // Eliminamos los márgenes por defecto de Material UI en los iconos internos de botones
            "& .MuiButton-startIcon, & .MuiButton-endIcon": {
              margin: "0 !important",
            },
            "& svg": {
              margin: "0 !important",
            },
          }}
        >
          <Header
            textHeader="Profesionales"
            isCreate={true}
            textIcon="" // Dejamos vacío para que solo renderice el icono
            handle={handleCreateProfessional}
          />
        </Grid>

        {/* Tabla */}
        <Grid
          size={{ xs: 12, md: selectedUser && !isMobile ? 8 : 12 }}
          sx={{ overflowX: "auto" }}
        >
          <Table<Person>
            columns={columns}
            rows={users}
            getRowId={(row) => row.user_id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        </Grid>

        {/* Panel lateral — solo desktop */}
        {selectedUser && !isMobile && (
          <Grid size={{ md: 4 }}>{profilePanel}</Grid>
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
              maxHeight: "85vh",
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
          {profilePanel}
        </Drawer>
      )}
    </Box>
  );
}
