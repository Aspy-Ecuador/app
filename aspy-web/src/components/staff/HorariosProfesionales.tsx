// Horarios de los profesionales, para Secretaría y el Admin:
// 1) aprobar los que crean los profesionales (hasta entonces no se ofrecen a las familias) y revisar su
//    modalidad —presencial o virtual— y el enlace de la reunión;
// 2) crearlos o quitarlos por un profesional (Secretaría, solo si el Admin lo habilitó en Datos bancarios →
//    "Horarios de los profesionales"). El servidor vuelve a comprobar los permisos en cada cambio.
import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import Campo from "@forms/Campo";
import { campoSx } from "@forms/estilos";
import HorarioProfessional from "@professional/HorarioProfessional";
import { ChipModalidad, EditorModalidad } from "@components/horarios/modalidad";
import { modalidadDe } from "@utils/citaVirtual";
import professionalAPI, { type ReglasHorario } from "@API/professionalAPI";
import workerScheduleAPI from "@API/workerScheduleAPI";
import { useRoleData } from "@/observer/RoleDataContext";
import { getProfessional, horaCorta, hoyEcuador } from "@utils/utils";
import { tone } from "@shared-theme/themePrimitives";
import type { Person } from "@/typesResponse/Person";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

const diaDe = (h: WorkerProfessional) => String(h.schedule?.date ?? "").split("T")[0];

const fechaLarga = (dia: string) => {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
};

/** Horarios que crearon los profesionales y que Secretaría o el Admin todavía no aprobaron. */
function PorAprobar({ personas, version, onCambio }: { personas: Person[]; version: number; onCambio: () => void }) {
  const { refreshWorkerProfessional, refreshAppointments } = useRoleData();
  const [horarios, setHorarios] = useState<WorkerProfessional[] | null>(null);
  const [editando, setEditando] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [aviso, setAviso] = useState<{ texto: string; error: boolean } | null>(null);

  // Se vuelve a pedir la lista cuando aquí se aprueba o se cambia algo (`recargas`) y cuando cambia la otra lista (`version`)
  const [recargas, setRecargas] = useState(0);

  useEffect(() => {
    let vigente = true;
    workerScheduleAPI
      .getAllWorkerSchedules()
      .then((lista) => vigente && setHorarios(lista))
      .catch(() => {
        if (!vigente) return;
        setHorarios([]);
        setAviso({ texto: "No se pudieron cargar los horarios. Vuelve a intentarlo en un momento.", error: true });
      });
    return () => {
      vigente = false;
    };
  }, [version, recargas]);

  const nombres = useMemo(() => new Map(personas.map((p) => [p.person_id, `${p.first_name} ${p.last_name}`])), [personas]);
  const pendientes = useMemo(() => {
    const hoy = hoyEcuador();
    return (horarios ?? [])
      .filter((h) => h.aprobado === false && diaDe(h) >= hoy)
      .sort((a, b) => `${diaDe(a)} ${a.schedule.start_time}`.localeCompare(`${diaDe(b)} ${b.schedule.start_time}`));
  }, [horarios]);

  const trasCambiar = (texto: string) => {
    setAviso({ texto, error: false });
    setEditando(null);
    setRecargas((n) => n + 1);
    refreshWorkerProfessional();
    refreshAppointments();
    onCambio();
  };

  const aprobar = async (id: number) => {
    setOcupado(id);
    try {
      trasCambiar((await workerScheduleAPI.aprobar(id, true)).message);
    } catch (e) {
      setAviso({ texto: (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "No se pudo aprobar el horario.", error: true });
    } finally {
      setOcupado(null);
    }
  };

  return (
    <Paper component="section" aria-label="Horarios por aprobar" elevation={0} sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: "0.5px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
            Horarios por aprobar
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.4 }}>
            Los crean los profesionales. Hasta que los apruebes no se ofrecen a las familias.
          </Typography>
        </Box>
        {horarios && (
          <Box component="span" sx={{ px: 1.25, py: 0.375, borderRadius: "999px", fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap", color: pendientes.length ? tone.amber.fg : tone.green.fg, bgcolor: pendientes.length ? tone.amber.bg : tone.green.bg, border: `0.5px solid ${pendientes.length ? tone.amber.border : tone.green.border}` }}>
            {pendientes.length === 1 ? "1 por aprobar" : `${pendientes.length} por aprobar`}
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {!horarios && <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>Cargando…</Typography>}
        {horarios && pendientes.length === 0 && <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>No hay horarios esperando tu aprobación.</Typography>}
        {pendientes.map((h) => {
          const horas = `${horaCorta(h.schedule.start_time)} – ${horaCorta(h.schedule.end_time)}`;
          const quien = nombres.get(h.professional?.person_id) ?? "Profesional";
          const abierto = editando === h.worker_schedule_id;
          return (
            <Box key={h.worker_schedule_id} sx={{ border: `0.5px solid ${tone.amber.border}`, borderRadius: 2, bgcolor: tone.amber.bg, overflow: "hidden" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 1.5, rowGap: 0.75, px: 1.5, py: 1 }}>
                <Box sx={{ flex: "1 1 220px", minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "text.primary", lineHeight: 1.35 }}>{quien}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.35, "&::first-letter": { textTransform: "uppercase" } }}>
                    {fechaLarga(diaDe(h))} · <Box component="span" sx={{ fontFamily: "monospace", fontWeight: 700, color: "text.primary" }}>{horas}</Box>
                  </Typography>
                </Box>
                <ChipModalidad modalidad={modalidadDe(h)} enlace={h.enlace_virtual} />
                <Button
                  size="small"
                  disabled={ocupado === h.worker_schedule_id}
                  onClick={() => aprobar(h.worker_schedule_id)}
                  startIcon={<TaskAltRoundedIcon sx={{ fontSize: "14px !important" }} />}
                  aria-label={`Aprobar el horario de ${quien}, ${fechaLarga(diaDe(h))}, ${horas}`}
                  sx={{ minHeight: 30, px: 1.5, borderRadius: 1.5, textTransform: "none", fontSize: 11.5, fontWeight: 600, bgcolor: "#1D9E75", color: "#fff", "&:hover": { bgcolor: "#0F6E56" }, "&.Mui-disabled": { bgcolor: tone.green.border, color: "#fff" } }}
                >
                  Aprobar
                </Button>
                <IconButton
                  size="small"
                  aria-label={`Cambiar la modalidad o el enlace del horario de ${quien}, ${horas}`}
                  title="Cambiar la modalidad o el enlace"
                  aria-expanded={abierto}
                  onClick={() => setEditando(abierto ? null : h.worker_schedule_id)}
                  sx={{ width: 30, height: 30, border: "0.5px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: 1.5 }}
                >
                  <EditRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              {abierto && (
                <Box sx={{ px: 1.5, py: 1.5, borderTop: "0.5px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                  <EditorModalidad
                    id={`aprobar-${h.worker_schedule_id}`}
                    horarioId={h.worker_schedule_id}
                    modalidad={modalidadDe(h)}
                    enlace={h.enlace_virtual ?? null}
                    puedeCambiarModalidad
                    onGuardado={(estado) => trasCambiar(estado.message)}
                    onCancelar={() => setEditando(null)}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* En un Portal: fuera del contenedor con zoom de los televisores (si no, el globo se agranda dos veces) */}
      <Portal>
        <Snackbar open={aviso !== null} autoHideDuration={4000} onClose={() => setAviso(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={aviso?.error ? "error" : "success"} variant="filled" onClose={() => setAviso(null)} sx={{ borderRadius: 2, fontSize: 12 }}>
            {aviso?.texto}
          </Alert>
        </Snackbar>
      </Portal>
    </Paper>
  );
}

export default function HorariosProfesionales() {
  const { data, loading } = useRoleData();
  const [reglas, setReglas] = useState<ReglasHorario | null>(null);
  const [fallo, setFallo] = useState(false);
  const [elegido, setElegido] = useState("");
  // Cada lista se vuelve a cargar cuando la otra cambia algo
  const [versionPendientes, setVersionPendientes] = useState(0);
  const [versionLista, setVersionLista] = useState(0);

  useEffect(() => {
    professionalAPI
      .reglasHorario(true)
      .then(setReglas)
      .catch(() => setFallo(true));
  }, []);

  const personas: Person[] = useMemo(() => getProfessional(data.persons ?? []), [data.persons]);
  // Solo profesionales con la cuenta habilitada: a los demás no se les puede agendar
  const profesionales = useMemo(() => personas.filter((p) => p.user_account?.is_available ?? true), [personas]);
  const profesional = profesionales.find((p) => String(p.person_id) === elegido) ?? null;

  if (loading || (!reglas && !fallo)) return <Progress />;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Horarios de profesionales" chip="Horarios" />

      {fallo && <Alert severity="error">No se pudieron cargar las reglas de los horarios. Vuelve a intentarlo en un momento.</Alert>}

      <PorAprobar personas={personas} version={versionPendientes} onCambio={() => setVersionLista((n) => n + 1)} />

      {reglas && (
        <>
          <Paper elevation={0} sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ maxWidth: 420 }}>
              <Campo
                etiqueta="Profesional"
                idEtiqueta="horarios-profesional-etiqueta"
                ayuda={
                  profesionales.length
                    ? reglas.puede_gestionar
                      ? "Elige de quién son los horarios que vas a revisar, crear o quitar."
                      : "Elige de quién son los horarios que vas a revisar."
                    : "Todavía no hay profesionales registrados."
                }
              >
                <Select
                  fullWidth
                  displayEmpty
                  labelId="horarios-profesional-etiqueta"
                  value={elegido}
                  onChange={(e) => setElegido(String(e.target.value))}
                  disabled={profesionales.length === 0}
                  sx={campoSx}
                >
                  <MenuItem value="">
                    <Typography component="span" sx={{ color: "text.secondary" }}>
                      Seleccione una opción
                    </Typography>
                  </MenuItem>
                  {profesionales.map((p) => (
                    <MenuItem key={p.person_id} value={String(p.person_id)}>
                      {p.first_name} {p.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </Campo>
            </Box>
            {!reglas.puede_gestionar && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                La administración no habilitó que Secretaría cree o quite horarios: eso lo hace cada profesional. Aquí puedes aprobarlos y cambiar su modalidad o su enlace.
              </Alert>
            )}
          </Paper>

          {profesional && (
            <HorarioProfessional
              key={`${profesional.person_id}-${versionLista}`}
              professionalId={profesional.person_id}
              nombre={`${profesional.first_name} ${profesional.last_name}`}
              soloRevisar={!reglas.puede_gestionar}
              onCambio={() => setVersionPendientes((n) => n + 1)}
            />
          )}
        </>
      )}
    </Box>
  );
}
