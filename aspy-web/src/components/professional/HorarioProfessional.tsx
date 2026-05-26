// FINAL
import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().split("T")[0];

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const fmt = (t: string) => t.slice(0, 5);

// Lógica inteligente para detectar el turno automáticamente
const getTurno = (time: string): string => {
  if (!time) return "";
  const [h] = time.split(":").map(Number);
  if (h < 12) return "Turno Mañana";
  if (h < 18) return "Turno Tarde";
  return "Turno Noche";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      borderRadius: 3,
      overflow: "hidden",
      height: "100%",
    }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.5,
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
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    fontSize: 13,
    bgcolor: "action.hover",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "#1D9E75" },
    "&.Mui-focused fieldset": { borderColor: "#1D9E75" },
  },
  "& .MuiInputLabel-root": { fontSize: 13 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1D9E75" },
  // Garantizamos que el icono del reloj del navegador se vea y sea cliqueable para el scroll
  "& input[type='time']::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function HorarioProfessional() {
  const professionalId = getAuthenticatedPersonID();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<WorkerProfessional[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const fetchSchedules = async () => {
    try {
      setLoadingList(true);
      const all = await workerScheduleAPI.getAllWorkerSchedules();
      setSchedules(
        all.filter((ws) => ws.professional.person_id === professionalId),
      );
    } catch {
      // silent
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ── Filtra solo hoy y fechas futuras, agrupa por fecha
  const grouped = useMemo(() => {
    const today = todayStr();
    const map = new Map<string, WorkerProfessional[]>();

    schedules.forEach((ws) => {
      const d = (ws.schedule.date as unknown as string).split("T")[0];
      if (d < today) return; // ← descarta pasados
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(ws);
    });

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [schedules]);

  const handleSubmit = async () => {
    const turno = getTurno(startTime);

    if (!turno || !date || !startTime || !endTime) {
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
        name: turno,
      });
      setSnackbar({
        open: true,
        message: "Horario creado correctamente.",
        severity: "success",
      });
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

  const today = todayStr();

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(300px, 36%) minmax(0,1fr)",
          },
          gap: { xs: 1.5, md: 2 },
          alignItems: "start",
        }}
      >
        {/* ── Formulario ── */}
        <SectionPanel label="Nuevo horario">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: todayStr() }}
              sx={fieldSx}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
              }}
            >
              {/* Aquí están tus selectores de hora intactos */}
              <TextField
                size="small"
                type="time"
                label="Hora inicio"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                size="small"
                type="time"
                label="Hora fin"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Box>

            {/* Turno detectado automáticamente */}
            {startTime && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  bgcolor: "action.hover",
                  border: "0.5px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled" }}>
                  Tipo de turno
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", ml: "auto" }}>
                  {getTurno(startTime)}
                </Typography>
              </Box>
            )}

            {/* Preview */}
            {date && startTime && endTime && startTime < endTime && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  bgcolor: "#F0FAF6",
                  border: "0.5px solid #A8DEC9",
                  borderRadius: 2,
                }}
              >
                <AccessTimeRoundedIcon
                  sx={{ fontSize: 13, color: "#1D9E75", flexShrink: 0 }}
                />
                <Typography
                  sx={{ fontSize: 12, color: "#1D9E75", fontWeight: 500 }}
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
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 2,
                py: 1,
                textTransform: "none",
                "&:hover": { bgcolor: "#0F6E56" },
                "&.Mui-disabled": { bgcolor: "#A8DEC9", color: "#fff" },
              }}
            >
              {submitting ? "Guardando…" : "Guardar horario"}
            </Button>
          </Box>
        </SectionPanel>

        {/* ── Lista de horarios ── */}
        <SectionPanel
          label="Mis horarios"
          badge={
            !loadingList && (
              <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
                {
                  schedules.filter(
                    (ws) =>
                      (ws.schedule.date as unknown as string).split("T")[0] >=
                      today,
                  ).length
                }{" "}
                turnos
              </Typography>
            )
          }
        >
          {loadingList && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={48}
                  sx={{ borderRadius: 2 }}
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
                py: 8,
                gap: 1.25,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  border: "0.5px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.disabled",
                }}
              >
                <CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                No tienes horarios próximos registrados
              </Typography>
            </Box>
          )}

          {!loadingList && grouped.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {grouped.map(([dateStr, slots]) => {
                const isToday = dateStr === today;
                return (
                  <Box key={dateStr}>
                    {/* Cabecera de fecha */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "text.secondary",
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isToday ? "hoy, " : ""}
                        {formatDate(dateStr)}
                      </Typography>
                      {isToday && (
                        <Box
                          sx={{
                            px: 0.875,
                            py: 0.25,
                            borderRadius: "20px",
                            bgcolor: "#E6F1FB",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 9,
                              fontWeight: 600,
                              color: "#185FA5",
                            }}
                          >
                            Hoy
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{ flex: 1, height: "0.5px", bgcolor: "divider" }}
                      />
                    </Box>

                    {/* Slots */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
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
                                gap: 1.5,
                                px: 1.5,
                                py: 1,
                                border: "0.5px solid",
                                borderColor: available ? "#A8DEC9" : "divider",
                                borderRadius: 2,
                                bgcolor: available ? "#F0FAF6" : "action.hover",
                                transition: "background 0.15s",
                              }}
                            >
                              {/* Pill de hora */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1.5,
                                  flexShrink: 0,
                                  bgcolor: available
                                    ? "#1D9E75"
                                    : "rgba(0,0,0,0.12)",
                                }}
                              >
                                <AccessTimeRoundedIcon
                                  sx={{ fontSize: 11, color: "#fff" }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#fff",
                                    lineHeight: 1,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {fmt(startStr)} – {fmt(endStr)}
                                </Typography>
                              </Box>

                              {/* Nombre */}
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  flex: 1,
                                  color: available
                                    ? "text.primary"
                                    : "text.disabled",
                                }}
                              >
                                {(ws.schedule as Schedule).name ?? "Sin nombre"}
                              </Typography>

                              {/* Estado */}
                              <Chip
                                icon={
                                  available ? (
                                    <CheckCircleRoundedIcon
                                      sx={{
                                        fontSize: "11px !important",
                                        color: "#1D9E75 !important",
                                      }}
                                    />
                                  ) : (
                                    <EventBusyRoundedIcon
                                      sx={{
                                        fontSize: "11px !important",
                                        color: "text.disabled !important",
                                      }}
                                    />
                                  )
                                }
                                label={available ? "Disponible" : "Ocupado"}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: 9,
                                  fontWeight: 600,
                                  bgcolor: "transparent",
                                  color: available
                                    ? "#1D9E75"
                                    : "text.disabled",
                                  border: "0.5px solid",
                                  borderColor: available
                                    ? "#A8DEC9"
                                    : "divider",
                                  "& .MuiChip-label": { px: 0.875 },
                                }}
                              />
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                );
              })}
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