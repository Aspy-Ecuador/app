// FINAL
import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { getAuthenticatedPersonID } from "@store";
import workerScheduleAPI from "@/API/workerScheduleAPI";
import professionalAPI from "@/API/professionalAPI";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import type { Schedule } from "@/typesResponse/Schedule";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** "2026-05-07" o "2026-05-07T00:00:00.000000Z" → "miércoles, 7 de mayo" */
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

/** "09:00:00" → "09:00" */
const fmt = (t: string) => t.slice(0, 5);

/** Today's date as YYYY-MM-DD (for min attribute) */
const today = () => new Date().toISOString().split("T")[0];

// ─── Shared sub-components ───────────────────────────────────────────────────

const SectionPanel = ({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{
      border: "0.5px solid",
      borderColor: "divider",
      borderRadius: { xs: 3, md: 4 },
      overflow: "hidden",
      height: "100%",
    }}
  >
    <Box
      sx={{
        px: { xs: 1.75, md: 2.5 },
        py: { xs: 1.25, md: 1.75 },
        borderBottom: "0.5px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 10, md: 11 },
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.disabled",
        }}
      >
        {label}
      </Typography>
      {badge}
    </Box>
    <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
  </Paper>
);

// Shared TextField sx — responsive font size
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    fontSize: { xs: 12, md: 14 },
    bgcolor: "action.hover",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "#1D9E75" },
    "&.Mui-focused fieldset": { borderColor: "#1D9E75" },
  },
  "& .MuiInputLabel-root": { fontSize: { xs: 12, md: 14 } },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1D9E75" },
};

export default function HorarioProfessional() {
  const professionalId = getAuthenticatedPersonID();

  // ── Form state
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Schedule list state
  const [schedules, setSchedules] = useState<WorkerProfessional[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // ── Feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  // ── Fetch professional's own schedules
  const fetchSchedules = async () => {
    try {
      setLoadingList(true);
      const all = await workerScheduleAPI.getAllWorkerSchedules();
      setSchedules(
        all.filter((ws) => ws.professional.person_id === professionalId),
      );
    } catch {
      // silent — list just stays empty
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ── Group schedules by date, sorted ascending
  const grouped = useMemo(() => {
    const map = new Map<string, WorkerProfessional[]>();
    schedules.forEach((ws) => {
      const d = (ws.schedule.date as unknown as string).split("T")[0];
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(ws);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [schedules]);

  // ── Submit
  const handleSubmit = async () => {
    if (!name.trim() || !date || !startTime || !endTime) {
      setSnackbar({
        open: true,
        message: "Completa todos los campos antes de guardar.",
        severity: "error",
      });
      return;
    }
    if (startTime >= endTime) {
      setSnackbar({
        open: true,
        message: "La hora de fin debe ser mayor a la hora de inicio.",
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      await professionalAPI.crearHorario({
        professional_id: professionalId,
        date,
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        name: name.trim(),
      });
      setSnackbar({
        open: true,
        message: "Horario creado correctamente.",
        severity: "success",
      });
      setName("");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSchedules();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Error al crear el horario.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(340px, 38%) minmax(0, 1fr)",
          },
          gap: { xs: 1.5, md: 2.5 },
          alignItems: "start",
        }}
      >
        <SectionPanel label="Nuevo horario">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, md: 2.25 },
            }}
          >
            <Typography
              sx={{
                display: { xs: "none", md: "block" },
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.5,
              }}
            >
              Configura un nuevo turno seleccionando el tipo, la fecha y el
              rango horario.
            </Typography>

            <FormControl fullWidth size="medium">
              <InputLabel sx={{ fontSize: { xs: 12, md: 14 } }}>
                Tipo de turno
              </InputLabel>
              <Select
                value={name}
                label="Tipo de turno"
                onChange={(e) => setName(e.target.value)}
                sx={{
                  fontSize: { xs: 12, md: 14 },
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1D9E75",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1D9E75",
                  },
                }}
              >
                <MenuItem
                  value="Turno Mañana"
                  sx={{ fontSize: { xs: 12, md: 14 } }}
                >
                  Turno Mañana
                </MenuItem>
                <MenuItem
                  value="Turno Tarde"
                  sx={{ fontSize: { xs: 12, md: 14 } }}
                >
                  Turno Tarde
                </MenuItem>
                <MenuItem
                  value="Turno Noche"
                  sx={{ fontSize: { xs: 12, md: 14 } }}
                >
                  Turno Noche
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="medium"
              type="date"
              label="Fecha"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today() }}
              sx={fieldSx}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              <TextField
                size="medium"
                type="time"
                label="Hora inicio"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                size="medium"
                type="time"
                label="Hora fin"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Box>

            {date && startTime && endTime && startTime < endTime && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: { xs: 1.25, md: 1.75 },
                  py: { xs: 1, md: 1.25 },
                  bgcolor: "#F0FAF6",
                  border: "0.5px solid #A8DEC9",
                  borderRadius: 2.5,
                }}
              >
                <AccessTimeRoundedIcon
                  sx={{
                    fontSize: { xs: 13, md: 15 },
                    color: "#1D9E75",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: 11, md: 13 },
                    color: "#1D9E75",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(date)} · {fmt(startTime + ":00")} –{" "}
                  {fmt(endTime + ":00")}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                bgcolor: "#1D9E75",
                color: "#fff",
                fontSize: { xs: 12, md: 14 },
                fontWeight: 600,
                borderRadius: 2.5,
                py: { xs: 1, md: 1.4 },
                mt: { xs: 0.5, md: 1 },
                textTransform: "none",
                letterSpacing: 0,
                "&:hover": { bgcolor: "#0F6E56" },
                "&.Mui-disabled": { bgcolor: "#A8DEC9", color: "#fff" },
              }}
            >
              {submitting ? "Guardando…" : "Guardar horario"}
            </Button>
          </Box>
        </SectionPanel>

        <SectionPanel
          label="Mis horarios"
          badge={
            !loadingList && (
              <Typography
                sx={{ fontSize: { xs: 10, md: 11 }, color: "text.disabled" }}
              >
                {schedules.length} {schedules.length === 1 ? "turno" : "turnos"}
              </Typography>
            )
          }
        >
          {loadingList && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={56}
                  sx={{ borderRadius: 2.5 }}
                />
              ))}
            </Box>
          )}

          {!loadingList && grouped.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 6, md: 10 },
                gap: 1.5,
              }}
            >
              <CalendarMonthRoundedIcon
                sx={{
                  fontSize: { xs: 38, md: 48 },
                  color: "text.disabled",
                  opacity: 0.35,
                }}
              />
              <Typography
                sx={{ fontSize: { xs: 12, md: 14 }, color: "text.disabled" }}
              >
                Aún no tienes horarios registrados
              </Typography>
            </Box>
          )}

          {!loadingList && grouped.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2.5, md: 3 },
              }}
            >
              {grouped.map(([dateStr, slots]) => (
                <Box key={dateStr}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: { xs: 1, md: 1.25 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 11, md: 12 },
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(dateStr)}
                    </Typography>
                    <Box
                      sx={{ flex: 1, height: "0.5px", bgcolor: "divider" }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 0.75, md: 1 },
                    }}
                  >
                    {[...slots]
                      .sort((a, b) =>
                        (
                          a.schedule.start_time as unknown as string
                        ).localeCompare(
                          b.schedule.start_time as unknown as string,
                        ),
                      )
                      .map((ws) => {
                        const available = ws.is_available;
                        const startStr = ws.schedule
                          .start_time as unknown as string;
                        const endStr = ws.schedule
                          .end_time as unknown as string;

                        return (
                          <Box
                            key={ws.worker_schedule_id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: { xs: 1.5, md: 2 },
                              px: { xs: 1.5, md: 2 },
                              py: { xs: 1, md: 1.25 },
                              border: "0.5px solid",
                              borderColor: available ? "#A8DEC9" : "divider",
                              borderRadius: 2.5,
                              bgcolor: available ? "#F0FAF6" : "action.hover",
                              transition: "background 0.15s",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: { xs: 1, md: 1.25 },
                                py: 0.5,
                                borderRadius: 1.5,
                                bgcolor: available
                                  ? "#1D9E75"
                                  : "rgba(0,0,0,0.18)",
                                flexShrink: 0,
                              }}
                            >
                              <AccessTimeRoundedIcon
                                sx={{
                                  fontSize: { xs: 11, md: 13 },
                                  color: "#fff",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: { xs: 10, md: 12 },
                                  fontWeight: 700,
                                  color: "#fff",
                                  lineHeight: 1,
                                }}
                              >
                                {fmt(startStr)} – {fmt(endStr)}
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                fontSize: { xs: 12, md: 14 },
                                fontWeight: 500,
                                flex: 1,
                                color: available
                                  ? "text.primary"
                                  : "text.disabled",
                              }}
                            >
                              {(ws.schedule as Schedule).name ?? "Sin nombre"}
                            </Typography>

                            {available ? (
                              <Chip
                                icon={
                                  <CheckCircleRoundedIcon
                                    sx={{
                                      fontSize: "12px !important",
                                      color: "#1D9E75 !important",
                                    }}
                                  />
                                }
                                label="Disponible"
                                size="small"
                                sx={{
                                  height: { xs: 20, md: 24 },
                                  fontSize: { xs: 9, md: 10 },
                                  fontWeight: 600,
                                  bgcolor: "transparent",
                                  color: "#1D9E75",
                                  border: "0.5px solid #A8DEC9",
                                  "& .MuiChip-label": {
                                    px: { xs: 0.75, md: 1 },
                                  },
                                }}
                              />
                            ) : (
                              <Chip
                                icon={
                                  <EventBusyRoundedIcon
                                    sx={{
                                      fontSize: "12px !important",
                                      color: "text.disabled !important",
                                    }}
                                  />
                                }
                                label="Ocupado"
                                size="small"
                                sx={{
                                  height: { xs: 20, md: 24 },
                                  fontSize: { xs: 9, md: 10 },
                                  fontWeight: 600,
                                  bgcolor: "transparent",
                                  color: "text.disabled",
                                  border: "0.5px solid",
                                  borderColor: "divider",
                                  "& .MuiChip-label": {
                                    px: { xs: 0.75, md: 1 },
                                  },
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </SectionPanel>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
          sx={{ borderRadius: 2, fontSize: 12 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
