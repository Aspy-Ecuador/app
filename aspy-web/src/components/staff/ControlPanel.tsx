// FINAL
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { getAuthenticatedUserName } from "@store";
import type { ButtonControl } from "@/types/ButtonControl";
import type { Appointment } from "@/typesResponse/Appointment";
import { getNextAppointments } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import Progress from "@components/Progress";
import ButtonList from "@components/ButtonList";
import ShowAppointment from "@staff/ShowAppointment";
import WelcomePanel from "@components/WelcomePanel";

const selectSx = {
  fontSize: 12,
  borderRadius: 2,
  bgcolor: "action.hover",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
};

export default function ControlPanel() {
  const { data, loading } = useRoleData();
  const navigate = useNavigate();

  // ── Todos los hooks ANTES de cualquier return ──
  const [filterDate, setFilterDate] = useState("");
  const [filterProfessional, setFilterProfessional] = useState("");
  const [filterService, setFilterService] = useState("");

  const appointments: Appointment[] = useMemo(
    () => (loading ? [] : getNextAppointments(data.appointments)),
    [loading, data.appointments],
  );

  const professionals = useMemo(() => {
    const seen = new Set<string>();
    return appointments
      .map((a) => a.professional)
      .filter((p) => {
        const key = String(p.person_id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [appointments]);

  const services = useMemo(() => {
    const seen = new Set<string>();
    return appointments
      .map((a) => a.service)
      .filter((s) => {
        const key = String(s.service_id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [appointments]);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const date = a.worker_schedule.schedule.date.split("T")[0];
      if (filterDate && date !== filterDate) return false;
      if (
        filterProfessional &&
        String(a.professional.person_id) !== filterProfessional
      )
        return false;
      if (filterService && String(a.service.service_id) !== filterService)
        return false;
      return true;
    });
  }, [appointments, filterDate, filterProfessional, filterService]);

  // ── Early return DESPUÉS de todos los hooks ──
  if (loading) return <Progress />;

  const botones: ButtonControl[] = [
    {
      text: "Agendar cita",
      icon: <EditCalendarRoundedIcon />,
      accion: () => navigate("/agendar-cita"),
    },
    {
      text: "Agregar servicio",
      icon: <PersonAddAltRoundedIcon />,
      accion: () => navigate("/crear-servicio"),
    },
  ];

  const hasFilters = filterDate || filterProfessional || filterService;

  const clearFilters = () => {
    setFilterDate("");
    setFilterProfessional("");
    setFilterService("");
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <WelcomePanel user={"Secr. " + getAuthenticatedUserName()} />

      <Grid container spacing={2} alignItems="flex-start">
        {/* Sidebar — acciones rápidas + filtros */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Acciones rápidas */}
            <Paper
              elevation={0}
              sx={{
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 1.75,
                  py: 1.25,
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                  }}
                >
                  Acciones rápidas
                </Typography>
              </Box>
              <Box sx={{ p: 0.75 }}>
                <ButtonList botones={botones} />
              </Box>
            </Paper>

            {/* Filtros */}
            <Paper
              elevation={0}
              sx={{
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 1.75,
                  py: 1.25,
                  borderBottom: "0.5px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                  }}
                >
                  Filtrar citas
                </Typography>
                {hasFilters && (
                  <IconButton
                    size="small"
                    onClick={clearFilters}
                    title="Limpiar filtros"
                    sx={{ p: 0.25 }}
                  >
                    <FilterAltOffRoundedIcon
                      sx={{ fontSize: 14, color: "text.disabled" }}
                    />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <TextField
                  type="date"
                  size="small"
                  label="Fecha"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    "& .MuiInputLabel-root": { fontSize: 12 },
                    "& .MuiOutlinedInput-root": {
                      fontSize: 12,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      "& fieldset": { borderColor: "divider" },
                    },
                  }}
                />

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: 12 }}>Profesional</InputLabel>
                  <Select
                    value={filterProfessional}
                    label="Profesional"
                    onChange={(e) => setFilterProfessional(e.target.value)}
                    sx={selectSx}
                  >
                    <MenuItem value="" sx={{ fontSize: 12 }}>
                      <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                        Todos
                      </Typography>
                    </MenuItem>
                    {professionals.map((p) => (
                      <MenuItem
                        key={p.person_id}
                        value={String(p.person_id)}
                        sx={{ fontSize: 12 }}
                      >
                        {p.first_name} {p.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: 12 }}>Servicio</InputLabel>
                  <Select
                    value={filterService}
                    label="Servicio"
                    onChange={(e) => setFilterService(e.target.value)}
                    sx={selectSx}
                  >
                    <MenuItem value="" sx={{ fontSize: 12 }}>
                      <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                        Todos
                      </Typography>
                    </MenuItem>
                    {services.map((s) => (
                      <MenuItem
                        key={s.service_id}
                        value={String(s.service_id)}
                        sx={{ fontSize: 12 }}
                      >
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Columna de citas */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
            <Typography sx={{ textTransform: "uppercase" }}>Citas</Typography>
            {hasFilters && (
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                · {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>

          {filtered.length > 0 ? (
            <ShowAppointment appointments={filtered} />
          ) : (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                borderRadius: 3,
                border: "1.5px dashed",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
                No hay citas con los filtros seleccionados
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
