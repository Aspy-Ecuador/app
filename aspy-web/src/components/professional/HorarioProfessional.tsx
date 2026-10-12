// FINAL
import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Campo from "@forms/Campo";
import CampoFecha from "@forms/CampoFecha";
import { campoSx } from "@forms/estilos";
import Chip from "@mui/material/Chip";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { ChipModalidad, ChipPorAprobar, EditorModalidad, SelectorModalidad } from "@components/horarios/modalidad";
import type { Modalidad } from "@/typesResponse/WorkerSchedule";
import { AYUDA_ENLACE_VIRTUAL, modalidadDe, plataformaVirtual } from "@utils/citaVirtual";
import { getAuthenticatedPersonID } from "@store";
import workerScheduleAPI from "@/API/workerScheduleAPI";
import professionalAPI, { type ReglasHorario } from "@/API/professionalAPI";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import type { Schedule } from "@/typesResponse/Schedule";
import { paletteVar, tone } from "@shared-theme/themePrimitives";
import { useRoleData } from "@/observer/RoleDataContext";
import { hoyEcuador } from "@utils/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// "Hoy" en la hora de Ecuador: con la hora universal, desde las 19:00 los turnos de hoy desaparecían de la lista
const todayStr = () => hoyEcuador();

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const fmt = (t: string) => t.slice(0, 5);

/** "31/10/2026" a partir de "2026-10-31". */
const fechaCorta = (f: string) => f.split("-").reverse().join("/");

/** Aviso con el límite de fechas que definió la administración. */
const avisoDelLimite = (reglas: ReglasHorario | null): string | undefined => {
  if (!reglas || reglas.alcance === null) return undefined;
  return reglas.hasta === reglas.desde
    ? "Por ahora solo se pueden crear horarios para hoy. Ese límite lo define la administración."
    : `Se pueden crear horarios hasta el ${fechaCorta(reglas.hasta)}. Ese límite lo define la administración.`;
};

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
  ...campoSx,
  // Garantizamos que el icono del reloj del navegador se vea y sea cliqueable para el scroll
  "& input[type='time']::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

interface HorarioProfessionalProps {
  /** Profesional cuyos horarios se gestionan. Sin indicarlo, los de la propia cuenta (un profesional). */
  professionalId?: number;
  /** Nombre de ese profesional, cuando lo gestiona Secretaría. */
  nombre?: string;
  /** Sin el formulario ni el botón de quitar: Secretaría sin permiso para crear horarios solo los revisa. */
  soloRevisar?: boolean;
  /** Se llama después de crear, quitar, aprobar o cambiar un horario (p. ej., para refrescar otra lista). */
  onCambio?: () => void;
}

export default function HorarioProfessional({ professionalId: idIndicado, nombre, soloRevisar = false, onCambio }: HorarioProfessionalProps = {}) {
  const professionalId = idIndicado ?? getAuthenticatedPersonID();
  // Quien gestiona los horarios de otra persona es Secretaría o el Admin: aprueban y cambian la modalidad
  const ajeno = idIndicado !== undefined;
  // Agendar cita y el panel de Secretaría leen los horarios del contexto: se refrescan al cambiar alguno
  const { refreshWorkerProfessional, refreshAppointments } = useRoleData();
  // Hasta cuándo se puede planificar lo decide el Admin; el servidor lo vuelve a comprobar al guardar
  const [reglas, setReglas] = useState<ReglasHorario | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // La modalidad no viene elegida: quien crea el horario tiene que decir si es presencial o virtual
  const [modalidad, setModalidad] = useState<Modalidad | "">("");
  const [enlace, setEnlace] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [aprobandoMap, setAprobandoMap] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<WorkerProfessional[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingMap, setDeletingMap] = useState<Record<number, boolean>>({});
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
        all.filter((ws) => ws.professional?.person_id === professionalId),
      );
    } catch {
      // silent
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalId]);

  useEffect(() => {
    professionalAPI
      .reglasHorario(true)
      .then(setReglas)
      .catch(() => setReglas(null));
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
    if (reglas && date > reglas.hasta) {
      setSnackbar({ open: true, message: avisoDelLimite(reglas) ?? "Esa fecha está fuera del límite permitido.", severity: "error" });
      return;
    }
    if (!modalidad) {
      setSnackbar({ open: true, message: "Elige si el horario es presencial o virtual.", severity: "error" });
      return;
    }
    const enlaceLimpio = modalidad === "virtual" ? enlace.trim() : "";
    if (enlaceLimpio && plataformaVirtual(enlaceLimpio) === null) {
      setSnackbar({ open: true, message: AYUDA_ENLACE_VIRTUAL, severity: "error" });
      return;
    }
    try {
      setSubmitting(true);
      const respuesta = await professionalAPI.crearHorario({
        professional_id: professionalId,
        date,
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        name: turno,
        modalidad,
        ...(enlaceLimpio ? { enlace: enlaceLimpio } : {}),
      });
      setSnackbar({
        open: true,
        // El que crea un profesional queda por aprobar: el servidor lo avisa en su mensaje
        message: respuesta.data?.worker_schedule?.aprobado === false ? "Horario creado. Secretaría lo revisará antes de publicarlo." : "Horario creado correctamente.",
        severity: "success",
      });
      setDate("");
      setStartTime("");
      setEndTime("");
      setModalidad("");
      setEnlace("");
      fetchSchedules();
      refreshWorkerProfessional();
      onCambio?.();
    } catch (error: any) {
      const datos = error?.response?.data;
      setSnackbar({
        open: true,
        // El motivo exacto (p. ej., el límite de fechas) viene en el error del campo
        message: datos?.errors?.date?.[0] || datos?.errors?.end_time?.[0] || datos?.errors?.enlace?.[0] || datos?.errors?.modalidad?.[0] || datos?.message || "Error al crear el horario.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (workerScheduleId: number) => {
    setDeletingMap((prev) => ({ ...prev, [workerScheduleId]: true }));
    try {
      await workerScheduleAPI.deleteWorkerSchedule(workerScheduleId);
      await fetchSchedules();
      refreshWorkerProfessional();
      onCambio?.();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message || "Error al eliminar el horario.",
        severity: "error",
      });
    } finally {
      setDeletingMap((prev) => ({ ...prev, [workerScheduleId]: false }));
    }
  };

  // Secretaría o el Admin aprueban el horario (se ofrece a las familias) o le quitan la aprobación
  const handleAprobar = async (workerScheduleId: number, aprobado: boolean) => {
    setAprobandoMap((prev) => ({ ...prev, [workerScheduleId]: true }));
    try {
      const estado = await workerScheduleAPI.aprobar(workerScheduleId, aprobado);
      setSnackbar({ open: true, message: estado.message, severity: "success" });
      await fetchSchedules();
      refreshWorkerProfessional();
      onCambio?.();
    } catch (error) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSnackbar({ open: true, message: mensaje || "No se pudo cambiar la aprobación del horario.", severity: "error" });
    } finally {
      setAprobandoMap((prev) => ({ ...prev, [workerScheduleId]: false }));
    }
  };

  const today = todayStr();

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: soloRevisar
            ? "1fr"
            : {
                xs: "1fr",
                md: "minmax(300px, 36%) minmax(0,1fr)",
              },
          gap: { xs: 1.5, md: 2 },
          alignItems: "start",
        }}
      >
        {/* ── Formulario ── */}
        {!soloRevisar && (
        <SectionPanel label="Nuevo horario">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            <Campo etiqueta="Fecha" htmlFor="horario-fecha" ayuda={avisoDelLimite(reglas)}>
              <CampoFecha id="horario-fecha" titulo="Fecha del horario" tipo="futura" max={reglas?.hasta} value={date} onChange={setDate} fieldSx={campoSx} />
            </Campo>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
              }}
            >
              {/* Aquí están tus selectores de hora intactos */}
              <Campo etiqueta="Hora inicio" htmlFor="horario-inicio">
                <TextField
                  id="horario-inicio"
                  fullWidth
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  sx={fieldSx}
                />
              </Campo>
              <Campo etiqueta="Hora fin" htmlFor="horario-fin">
                <TextField
                  id="horario-fin"
                  fullWidth
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  sx={fieldSx}
                />
              </Campo>
            </Box>

            {/* Presencial o virtual: no viene elegida, hay que decidirla */}
            <Campo
              etiqueta="Modalidad"
              idEtiqueta="horario-modalidad-etiqueta"
              ayuda={ajeno ? undefined : "Secretaría revisa el horario antes de que las familias puedan agendarlo."}
            >
              <SelectorModalidad id="horario-modalidad" value={modalidad} onChange={setModalidad} disabled={submitting} />
            </Campo>
            {modalidad === "virtual" && (
              <Campo etiqueta="Enlace de la reunión (opcional)" htmlFor="horario-enlace" ayuda="De Zoom, Microsoft Teams o Google Meet. Si todavía no lo tienes, podrás ponerlo después.">
                <TextField
                  id="horario-enlace"
                  fullWidth
                  value={enlace}
                  onChange={(e) => setEnlace(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  autoComplete="off"
                  error={enlace.trim() !== "" && plataformaVirtual(enlace) === null}
                  sx={campoSx}
                  slotProps={{ htmlInput: { inputMode: "url", maxLength: 500 } }}
                />
              </Campo>
            )}

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
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                  }}
                >
                  Tipo de turno
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.primary",
                    ml: "auto",
                  }}
                >
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
                  bgcolor: tone.green.bg,
                  border: `0.5px solid ${tone.green.border}`,
                  borderRadius: 2,
                }}
              >
                <AccessTimeRoundedIcon
                  sx={{ fontSize: 13, color: tone.green.main, flexShrink: 0 }}
                />
                <Typography
                  sx={{ fontSize: 12, color: tone.green.main, fontWeight: 500 }}
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
                "&.Mui-disabled": { bgcolor: tone.green.border, color: "#fff" },
              }}
            >
              {submitting ? "Guardando…" : "Guardar horario"}
            </Button>
          </Box>
        </SectionPanel>
        )}

        {/* ── Lista de horarios ── */}
        <SectionPanel
          label={ajeno ? `Horarios de ${nombre ?? "este profesional"}` : "Mis horarios"}
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
                {ajeno ? "No hay horarios próximos registrados" : "No tienes horarios próximos registrados"}
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
                            bgcolor: tone.blue.bg,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 9,
                              fontWeight: 600,
                              color: tone.blue.fg,
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

                          const pendiente = ws.aprobado === false;
                          const modalidadWs = modalidadDe(ws);
                          // El profesional elige la modalidad mientras nadie reservó el horario, y el enlace de uno
                          // virtual, siempre. Secretaría y el Admin cambian las dos cosas cuando haga falta.
                          const puedeModalidad = ajeno || available;
                          const puedeEditar = puedeModalidad || modalidadWs === "virtual";
                          const abierto = editando === ws.worker_schedule_id;
                          const horas = `${fmt(startStr)} a ${fmt(endStr)}`;

                          return (
                            <Box
                              key={ws.worker_schedule_id}
                              sx={{
                                border: "0.5px solid",
                                borderColor: pendiente ? tone.amber.border : available ? tone.green.border : "divider",
                                borderRadius: 2,
                                bgcolor: pendiente ? tone.amber.bg : available ? tone.green.bg : "action.hover",
                                overflow: "hidden",
                              }}
                            >
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                columnGap: 1.5,
                                rowGap: 0.75,
                                px: 1.5,
                                py: 1,
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
                                    ? tone.green.main
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

                              {/* Modalidad y, si falta, la aprobación de Secretaría */}
                              <ChipModalidad modalidad={modalidadWs} enlace={ws.enlace_virtual} />
                              {pendiente && <ChipPorAprobar />}

                              {/* Estado */}
                              {!pendiente && (
                              <Chip
                                icon={
                                  available ? (
                                    <CheckCircleRoundedIcon
                                      sx={{
                                        fontSize: "11px !important",
                                        color: `${tone.green.main} !important`,
                                      }}
                                    />
                                  ) : (
                                    <EventBusyRoundedIcon
                                      sx={{
                                        fontSize: "11px !important",
                                        color: `${paletteVar("text.disabled")} !important`,
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
                                    ? tone.green.main
                                    : "text.disabled",
                                  border: "0.5px solid",
                                  borderColor: available
                                    ? tone.green.border
                                    : "divider",
                                  "& .MuiChip-label": { px: 0.875 },
                                }}
                              />
                              )}
                              {ajeno && pendiente && (
                                <Button
                                  size="small"
                                  disabled={aprobandoMap[ws.worker_schedule_id] ?? false}
                                  onClick={() => handleAprobar(ws.worker_schedule_id, true)}
                                  startIcon={<TaskAltRoundedIcon sx={{ fontSize: "14px !important" }} />}
                                  aria-label={`Aprobar el horario de ${horas}`}
                                  sx={{ minHeight: 26, px: 1.25, borderRadius: 1.5, textTransform: "none", fontSize: 11, fontWeight: 600, bgcolor: "#1D9E75", color: "#fff", "&:hover": { bgcolor: "#0F6E56" }, "&.Mui-disabled": { bgcolor: tone.green.border, color: "#fff" } }}
                                >
                                  Aprobar
                                </Button>
                              )}
                              {ajeno && !pendiente && available && (
                                <Button
                                  size="small"
                                  disabled={aprobandoMap[ws.worker_schedule_id] ?? false}
                                  onClick={() => handleAprobar(ws.worker_schedule_id, false)}
                                  aria-label={`Quitar la aprobación del horario de ${horas}`}
                                  title="Deja de ofrecerse a las familias hasta aprobarlo otra vez"
                                  sx={{ minHeight: 26, px: 1, borderRadius: 1.5, textTransform: "none", fontSize: 10.5, fontWeight: 600, color: "text.secondary", border: "0.5px solid", borderColor: "divider" }}
                                >
                                  Quitar aprobación
                                </Button>
                              )}
                              {puedeEditar && (
                                <IconButton
                                  size="small"
                                  aria-label={`${puedeModalidad ? "Cambiar la modalidad o el enlace" : "Poner o cambiar el enlace"} del horario de ${horas}`}
                                  title={puedeModalidad ? "Cambiar la modalidad o el enlace" : "Poner o cambiar el enlace de la reunión"}
                                  aria-expanded={abierto}
                                  onClick={() => setEditando(abierto ? null : ws.worker_schedule_id)}
                                  sx={{ width: 26, height: 26, border: "0.5px solid", borderColor: "divider", bgcolor: "action.hover", borderRadius: 1.5, flexShrink: 0 }}
                                >
                                  <EditRoundedIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                              )}
                              {available && !soloRevisar && (
                                <IconButton
                                  size="small"
                                  aria-label={`Quitar el horario de ${fmt(startStr)} a ${fmt(endStr)}`}
                                  title="Quitar este horario"
                                  disabled={
                                    deletingMap[ws.worker_schedule_id] ?? false
                                  }
                                  onClick={() =>
                                    handleDelete(ws.worker_schedule_id)
                                  }
                                  sx={{
                                    width: 26,
                                    height: 26,
                                    border: "0.5px solid",
                                    borderColor: "divider",
                                    bgcolor: "action.hover",
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                    "&:hover": {
                                      borderColor: tone.red.border,
                                      color: tone.red.fg,
                                      bgcolor: tone.red.bg,
                                    },
                                    "&.Mui-disabled": { opacity: 0.5 },
                                  }}
                                >
                                  {deletingMap[ws.worker_schedule_id] ? (
                                    <CircularProgress
                                      size={12}
                                      sx={{ color: tone.red.main }}
                                    />
                                  ) : (
                                    <DeleteOutlineRoundedIcon
                                      sx={{ fontSize: 13 }}
                                    />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                            {abierto && (
                              <Box sx={{ px: 1.5, py: 1.5, borderTop: "0.5px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                                <EditorModalidad
                                  id={`horario-${ws.worker_schedule_id}`}
                                  horarioId={ws.worker_schedule_id}
                                  modalidad={modalidadWs}
                                  enlace={ws.enlace_virtual ?? null}
                                  puedeCambiarModalidad={puedeModalidad}
                                  avisoAlCambiar={!ajeno && !pendiente ? "Si cambias la modalidad, Secretaría tendrá que aprobar el horario otra vez." : undefined}
                                  onGuardado={(estado) => {
                                    setEditando(null);
                                    setSnackbar({ open: true, message: estado.message, severity: "success" });
                                    fetchSchedules();
                                    refreshWorkerProfessional();
                                    onCambio?.();
                                    // La cita de ese horario toma su modalidad y su enlace: la agenda se pone al día
                                    refreshAppointments();
                                  }}
                                  onCancelar={() => setEditando(null)}
                                />
                              </Box>
                            )}
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

      {/* En un Portal: fuera del contenedor con zoom de los televisores (si no, el globo se agranda dos veces) */}
      <Portal>
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
      </Portal>
    </>
  );
}
