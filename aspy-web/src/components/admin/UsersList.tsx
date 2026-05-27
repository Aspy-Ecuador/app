// FINAL - VERSIÓN OPTIMIZADA (PC INSTANTÁNEO / MÓVIL FLUIDO)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CardAdmin } from "@/types/CardAdmin";
import { useRoleData } from "@/observer/RoleDataContext";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { translateRol, exportUsersExcel, exportUsersPDF } from "@/utils/utils";
import Progress from "@components/Progress";
import SimpleHeader from "@components/SimpleHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import personAPI from "@API/personAPI";
import ProfileView from "@components/ProfileView";
import DataInformation from "@admin/DataInformation";
import Table from "@components/Table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttributionOutlinedIcon from "@mui/icons-material/AttributionOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import type { Person } from "@/typesResponse/Person";

const roleChipSx = (role: string) => {
  if (role === "Admin") return { bgcolor: "#fafbe6", color: "#b9b716" };
  if (role === "Professional") return { bgcolor: "#E1F5EE", color: "#0F6E56" };
  if (role === "Client") return { bgcolor: "#E6F1FB", color: "#185FA5" };
  return { bgcolor: "#EEEDFE", color: "#534AB7" };
};

export default function UsersList() {
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const { data, loading, refreshPersons } = useRoleData();
  const [togglingMap, setTogglingMap] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  const theme = useTheme();
  // isMobile captura celulares y tablets (breakpoints menores a 900px de ancho)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const users: Person[] = data.persons ?? [];
  const selectedUser =
    selectedId !== null
      ? (users.find((u) => String(u.user_id) === String(selectedId)) ?? null)
      : null;

  const buttonsData: CardAdmin[] = [
    {
      label: "Usuarios activos",
      value: users.length,
      icon: <AccountCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Profesionales",
      value: users.filter((u) => u.user_account.role.name === "Professional")
        .length,
      icon: <SupervisedUserCircleOutlinedIcon fontSize="inherit" />,
    },
    {
      label: "Pacientes",
      value: users.filter((u) => u.user_account.role.name === "Client").length,
      icon: <AttributionOutlinedIcon fontSize="inherit" />,
    },
  ];

  async function handleToggleAvailable(person_id: number, current: boolean) {
    setTogglingMap((prev) => ({ ...prev, [person_id]: true }));
    try {
      await personAPI.changeAvailable(person_id, !current);
      refreshPersons();
    } catch (e) {
      console.error("Error al cambiar disponibilidad:", e);
    } finally {
      setTogglingMap((prev) => ({ ...prev, [person_id]: false }));
    }
  }

  const columns: GridColDef[] = [
    {
      field: "first_name",
      headerName: "Nombre",
      disableColumnMenu: true,
      flex: 2,
      minWidth: 130, // Aumentado ligeramente para mejor lectura en tablets
      resizable: false,
    },
    {
      field: "last_name",
      headerName: "Apellido",
      disableColumnMenu: true,
      flex: 2,
      minWidth: 130,
      resizable: false,
    },
    {
      field: "role",
      headerName: "Rol",
      disableColumnMenu: true,
      flex: 2,
      minWidth: 110,
      resizable: false,
      renderCell: (params) => {
        const roleName = params.row.user_account?.role?.name ?? "";
        return (
          <Chip
            label={translateRol(roleName)}
            size="small"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              height: 20,
              "& .MuiChip-label": { px: 1 },
              ...roleChipSx(roleName),
            }}
          />
        );
      },
    },
    {
      field: "email",
      headerName: "Correo",
      disableColumnMenu: true,
      flex: 4,
      minWidth: 200,
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
      field: "phone",
      headerName: "Celular",
      disableColumnMenu: true,
      flex: 3,
      minWidth: 130,
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

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Lista de usuarios" chip="Usuarios" />

      {/* Stats + botones */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <DataInformation buttonsData={buttonsData} />

        <Box sx={{ width: "0.5px", height: 36, bgcolor: "divider", mx: 0.5 }} />

        <Button
          onClick={() => navigate("/nuevo-usuario")}
          startIcon={<AddRoundedIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            bgcolor: "#E1F5EE",
            color: "#0F6E56",
            border: "0.5px solid #9FE1CB",
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            height: "auto",
            textTransform: "none",
            "&:hover": { bgcolor: "#9FE1CB" },
          }}
        >
          Agregar usuario
        </Button>

        <Box sx={{ width: "0.5px", height: 36, bgcolor: "divider", mx: 0.5 }} />

        <Button
          onClick={() => exportUsersPDF(users)}
          startIcon={
            <FileDownloadOutlinedIcon sx={{ fontSize: "14px !important" }} />
          }
          sx={{
            fontSize: 12,
            fontWeight: 500,
            bgcolor: "#FEE2E2",
            color: "#991B1B",
            border: "0.5px solid #FCA5A5",
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            height: "auto",
            textTransform: "none",
            "&:hover": { bgcolor: "#FCA5A5" },
          }}
        >
          PDF
        </Button>

        <Button
          onClick={() => exportUsersExcel(users)}
          startIcon={
            <FileDownloadOutlinedIcon sx={{ fontSize: "14px !important" }} />
          }
          sx={{
            fontSize: 12,
            fontWeight: 500,
            bgcolor: "#F0FDF4",
            color: "#166534",
            border: "0.5px solid #86EFAC",
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            height: "auto",
            textTransform: "none",
            "&:hover": { bgcolor: "#86EFAC" },
          }}
        >
          Excel
        </Button>
      </Box>

      {/* Tabla + panel de perfil */}
      <Grid container spacing={1.5} alignItems="flex-start">
        {/* En PC (md en adelante), si hay usuario seleccionado ocupa 8, si no 12. Instantáneo. */}
        <Grid
          size={{ xs: 12, md: selectedUser && !isMobile ? 8 : 12 }}
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              // Mejora estética: sutil sombreado al seleccionar fila
              "& .Mui-selected": {
                backgroundColor: "rgba(15, 110, 86, 0.08) !important",
              },
            }}
          >
            {users.length ? (
              <Table<Person>
                columns={columns}
                rows={users}
                getRowId={(row) => row.user_id}
                selectedId={selectedId}
                onRowSelect={setSelectedId}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.disabled",
                  textAlign: "center",
                  py: 4,
                }}
              >
                No hay usuarios registrados
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Lógica de Detalle Independiente */}
        {selectedUser &&
          (isMobile ? (
            /* COMPORTAMIENTO MÓVIL/TABLET: Drawer fluido con Glassmorphism */
            <Drawer
              anchor="bottom"
              open={Boolean(selectedUser)}
              onClose={() => setSelectedId(null)}
              // Añade desenfoque al fondo para un toque premium
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
                  maxHeight: "85vh", // Evita que tape toda la pantalla
                  boxShadow: "0px -4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Handle visual para indicar que se puede cerrar */}
              <Box
                sx={{
                  width: 40,
                  height: 4,
                  bgcolor: "action.disabled",
                  borderRadius: 2,
                  mx: "auto",
                  mb: 2,
                }}
              />
              <ProfileView user={selectedUser} isRowPosition={false} />
            </Drawer>
          ) : (
            /* COMPORTAMIENTO PC: Instantáneo al lado de la tabla */
            <Grid size={{ md: 4 }}>
              <ProfileView user={selectedUser} isRowPosition={false} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
