import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import type { Service } from "@typesResponse/Service";
import type { ProfessionalService } from "@typesResponse/ProfessionalService";
import { useRoleData } from "@/observer/RoleDataContext";
import serviceAPI from "@API/serviceAPI";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Header from "@components/Header";
import Table from "@components/Table";
import professionalServiceAPI from "@API/professionalServiceAPI";
import Progress from "@components/Progress";
import { exportServicesPDF, exportServicesCSV } from "@/utils/utils";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Switch from "@mui/material/Switch";

export default function ServicesList() {
  const { data, loading, refreshProServices, refreshServices } = useRoleData();
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [savingMap, setSavingMap] = useState<Record<number, boolean>>({});
  const [togglingMap, setTogglingMap] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const services: Service[] = data?.services ?? [];

  const professionals = (data?.persons ?? []).filter(
    (p: any) =>
      p.professional !== null && p.user_account?.role?.name === "Professional",
  );

  const proServices: ProfessionalService[] = data?.proServices ?? [];

  const assignedMap: Record<number, number[]> = {};
  for (const ps of proServices) {
    if (!assignedMap[ps.service_id]) assignedMap[ps.service_id] = [];
    assignedMap[ps.service_id].push(ps.professional.person_id);
  }

  async function handleSelectProfessional(
    service_id: number,
    person_id: number,
  ) {
    setSavingMap((prev) => ({ ...prev, [service_id]: true }));
    try {
      const existing = proServices.find((ps) => ps.service_id === service_id);
      if (existing) {
        await professionalServiceAPI.updateProService(
          existing.professional_service_id,
          person_id,
        );
      } else {
        await professionalServiceAPI.createProfessionalService({
          service_id: service_id,
          professional_id: person_id,
        });
      }
      await refreshProServices();
    } catch (e) {
      console.error("Error al asignar profesional:", e);
    } finally {
      setSavingMap((prev) => ({ ...prev, [service_id]: false }));
    }
  }

  async function handleToggleAvailable(service_id: number, current: boolean) {
    setTogglingMap((prev) => ({ ...prev, [service_id]: true }));
    try {
      await serviceAPI.changeAvailable(service_id, !current);
      await refreshProServices();
      await refreshServices();
    } catch (e) {
      console.error("Error al cambiar disponibilidad:", e);
    } finally {
      setTogglingMap((prev) => ({ ...prev, [service_id]: false }));
    }
  }

  const columns: GridColDef[] = [
    {
      field: "service_id",
      headerName: "ID",
      flex: 1,
      minWidth: 60,
      disableColumnMenu: true,
      resizable: false,
    },
    {
      field: "name",
      headerName: "Nombre",
      flex: 3,
      minWidth: 130,
      disableColumnMenu: true,
      resizable: false,
    },
    {
      field: "price",
      headerName: "Costo",
      flex: 2,
      minWidth: 80,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            variant="body1"
            sx={{ color: "#0F6E56", fontWeight: 500 }}
          >
            ${Number(params.value).toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "profesional",
      headerName: "Profesional",
      flex: 3,
      minWidth: 210,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => {
        const serviceId: number = params.row.service_id;
        const existing = proServices.find((ps) => ps.service_id === serviceId);
        const currentValue = existing?.professional.person_id ?? "";
        const isSaving = savingMap[serviceId] ?? false;

        return (
          <Box display="flex" alignItems="center" height="100%" gap={1}>
            <Select
              displayEmpty
              size="small"
              value={currentValue}
              disabled={isSaving}
              onChange={(e) =>
                handleSelectProfessional(serviceId, e.target.value as number)
              }
              renderValue={(selected) =>
                !selected ? (
                  <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                    Seleccione un profesional
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: 12 }}>
                    {(() => {
                      const p = professionals.find(
                        (pr: any) => pr.person_id === selected,
                      );
                      return p
                        ? `${p.first_name} ${p.last_name}`
                        : "Profesional desconocido";
                    })()}
                  </Typography>
                )
              }
              sx={{
                fontSize: 12,
                minWidth: 160,
                bgcolor: "background.paper",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9FE1CB",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0F6E56",
                },
              }}
            >
              {professionals.length === 0 && (
                <MenuItem disabled sx={{ fontSize: 12 }}>
                  Sin profesionales
                </MenuItem>
              )}
              {professionals.map((person: any) => (
                <MenuItem
                  key={person.person_id}
                  value={person.person_id}
                  sx={{ fontSize: 12 }}
                >
                  {person.first_name} {person.last_name}
                </MenuItem>
              ))}
            </Select>
            {isSaving && (
              <CircularProgress size={14} sx={{ color: "#0F6E56" }} />
            )}
          </Box>
        );
      },
    },
    {
      field: "acciones",
      headerName: "",
      flex: 1,
      minWidth: 56,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <IconButton
            size="small"
            onClick={() =>
              navigate(`${location.pathname}/${params.row.service_id}`)
            }
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: 1.5,
              "&:hover": {
                borderColor: "#9FE1CB",
                color: "#0F6E56",
                bgcolor: "#E1F5EE",
              },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "is_available",
      headerName: "Disponible",
      flex: 1,
      minWidth: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const serviceId: number = params.row.service_id;
        const isAvailable: boolean = params.row.is_available;
        const isToggling = togglingMap[serviceId] ?? false;

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
                onChange={() => handleToggleAvailable(serviceId, isAvailable)}
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

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      {/* Contenedor principal con Header inyectado para el botón '+' */}
      <Grid container spacing={2}>
        <Grid
          size={12}
          className="grid-p-patients-tittle"
          sx={{
            "& button": {
              display: "inline-flex !important",
              alignItems: "center !important",
              justifyContent: "center !important",
              minWidth: "40px !important",
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: "50%",
            },
            "& .MuiButton-startIcon, & .MuiButton-endIcon": {
              margin: "0 !important",
            },
            "& svg": {
              margin: "0 !important",
            },
          }}
        >
          <Header
            textHeader={"Lista de servicios"}
            isCreate={true}
            textIcon=""
            handle={() => navigate("/crear-servicio")}
          />
        </Grid>

        {/* Panel de Estadísticas y Exportación */}
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            {/* Tarjeta total de servicios */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.75,
                py: 1.25,
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#EEEDFE",
                  color: "#534AB7",
                  "& svg": { fontSize: 16 },
                }}
              >
                <AssignmentTurnedInRoundedIcon fontSize="inherit" />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                    lineHeight: 1,
                  }}
                >
                  Total servicios
                </Typography>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}
                >
                  {services.length}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ width: "0.5px", height: 36, bgcolor: "divider", mx: 0.5 }}
            />

            {/* Exportar PDF */}
            <Button
              onClick={() =>
                exportServicesPDF(services, proServices, professionals)
              }
              startIcon={
                <FileDownloadOutlinedIcon
                  sx={{ fontSize: "14px !important" }}
                />
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

            {/* Exportar CSV */}
            <Button
              onClick={() =>
                exportServicesCSV(services, proServices, professionals)
              }
              startIcon={
                <FileDownloadOutlinedIcon
                  sx={{ fontSize: "14px !important" }}
                />
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
        </Grid>

        {/* Tabla Responsiva */}
        <Grid size={12}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            {loading ? (
              <Progress />
            ) : services.length ? (
              <Table<Service>
                columns={columns}
                rows={services}
                getRowId={(row) => row.service_id}
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
                No hay servicios registrados
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
