// FINAL
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import type { Service } from "@typesResponse/Service";
import type { ProfessionalService } from "@typesResponse/ProfessionalService";
import { useRoleData } from "@/observer/RoleDataContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@components/Table";
import Header from "@components/Header";
import Progress from "@components/Progress";
import professionalServiceAPI from "@API/professionalServiceAPI";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function Services() {
  const { data, loading, refreshProServices } = useRoleData();
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [savingMap, setSavingMap] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();
  const location = useLocation();

  const services: Service[] = data?.services ?? [];

  const professionals = (data?.persons ?? []).filter(
    (p: any) =>
      p.professional !== null && p.user_account?.role?.name === "Professional",
  );

  const proServices: ProfessionalService[] = data?.proServices ?? [];

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
          service_id,
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
          <Typography variant="body1" sx={{ color: "#0F6E56" }}>
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
  ];

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Servicios"}
            isCreate={true}
            textIcon={"Agregar Servicio"}
            handle={() => navigate("/crear-servicio")}
          />
        </Grid>

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
