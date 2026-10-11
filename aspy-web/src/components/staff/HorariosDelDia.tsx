// Secretaría: de un vistazo, los turnos de hoy de TODOS los profesionales, libres y ocupados.
// Antes había que ir a Citas y revisar profesional por profesional para saber si quedaba un turno libre.
// Usa los horarios y las citas que ya cargó el rol (se refrescan al abrir el panel y con el botón).
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Campo from "@forms/Campo";
import CampoFecha from "@forms/CampoFecha";
import { campoSx } from "@forms/estilos";
import { useRoleData } from "@/observer/RoleDataContext";
import { estadoCita } from "@utils/estadoCita";
import { getProfessional, horaCorta, hoyEcuador, instanteEcuador } from "@utils/utils";
import { tone } from "@shared-theme/themePrimitives";
import type { Appointment } from "@/typesResponse/Appointment";
import type { Person } from "@/typesResponse/Person";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

type Vista = "todos" | "libres" | "ocupados";

interface Turno {
  id: number;
  inicio: string;
  fin: string;
  /** libre = se puede agendar; ocupado = tiene cita; pasado = quedó libre y ya terminó. */
  estado: "libre" | "ocupado" | "pasado";
  /** Libre y ya empezó: Secretaría todavía puede registrar ahí a alguien que llegó sin agendar. */
  enCurso: boolean;
  cita?: Appointment;
}

const VISTAS: [Vista, string][] = [
  ["todos", "Todos"],
  ["libres", "Disponibles"],
  ["ocupados", "Ocupados"],
];

const CITA_CANCELADA = 5;

const fechaLarga = (fecha: string) => {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" });
};

const contadorSx = (tono: "green" | "amber") => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.25,
  height: 28,
  borderRadius: "999px",
  fontSize: "0.8rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
  bgcolor: tone[tono].bg,
  color: tone[tono].fg,
  border: `0.5px solid ${tone[tono].border}`,
});

export default function HorariosDelDia() {
  const { data, refreshAppointments, refreshWorkerProfessional } = useRoleData();
  const hoy = hoyEcuador();
  const [fecha, setFecha] = useState(hoy);
  const [vista, setVista] = useState<Vista>("todos");
  const [actualizando, setActualizando] = useState(false);
  // La hora del momento, al minuto: un turno libre que ya terminó deja de contarse como disponible
  const [ahora, setAhora] = useState(() => Date.now());

  const actualizar = async () => {
    setActualizando(true);
    try {
      await Promise.all([refreshWorkerProfessional(), refreshAppointments()]);
      setAhora(Date.now());
    } finally {
      setActualizando(false);
    }
  };

  // Al abrir el panel se piden los horarios y las citas del momento (otra persona pudo agendar mientras tanto)
  useEffect(() => {
    refreshWorkerProfessional();
    refreshAppointments();
    const reloj = window.setInterval(() => setAhora(Date.now()), 60_000);
    return () => window.clearInterval(reloj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { grupos, libres, ocupados, sinHorarios } = useMemo(() => {
    const horarios: WorkerProfessional[] = data.workerProfessional ?? [];
    const citas: Appointment[] = data.appointments ?? [];
    // Solo cuentas habilitadas: a las demás no se les puede agendar
    const profesionales: Person[] = getProfessional(data.persons ?? []).filter((p) => p.user_account?.is_available ?? true);

    // La cita vigente de cada turno ocupado (una cancelada ya liberó su turno)
    const citaDelTurno = new Map<number, Appointment>();
    for (const cita of citas) {
      if (cita.appointment_status?.appointment_status_id === CITA_CANCELADA) continue;
      const turno = cita.worker_schedule?.worker_schedule_id;
      if (turno) citaDelTurno.set(turno, cita);
    }

    const porProfesional = new Map<number, Turno[]>();
    for (const h of horarios) {
      if (!h.schedule || String(h.schedule.date).split("T")[0] !== fecha) continue;
      const profesional = h.professional?.person_id;
      if (!profesional) continue;
      // Las horas de los turnos son de Ecuador, esté donde esté el dispositivo
      const termino = instanteEcuador(fecha, h.schedule.end_time) <= ahora;
      const turno: Turno = {
        id: h.worker_schedule_id,
        inicio: horaCorta(h.schedule.start_time),
        fin: horaCorta(h.schedule.end_time),
        estado: !h.is_available ? "ocupado" : termino ? "pasado" : "libre",
        enCurso: Boolean(h.is_available) && !termino && instanteEcuador(fecha, h.schedule.start_time) <= ahora,
        cita: h.is_available ? undefined : citaDelTurno.get(h.worker_schedule_id),
      };
      porProfesional.set(profesional, [...(porProfesional.get(profesional) ?? []), turno]);
    }

    const grupos = profesionales
      .filter((p) => porProfesional.has(p.person_id))
      .map((p) => ({ persona: p, turnos: porProfesional.get(p.person_id)!.sort((a, b) => a.inicio.localeCompare(b.inicio)) }))
      .sort((a, b) => `${a.persona.first_name} ${a.persona.last_name}`.localeCompare(`${b.persona.first_name} ${b.persona.last_name}`, "es"));
    const todos = grupos.flatMap((g) => g.turnos);

    return {
      grupos,
      libres: todos.filter((t) => t.estado === "libre").length,
      ocupados: todos.filter((t) => t.estado === "ocupado").length,
      // Profesionales con la cuenta habilitada que no tienen ningún turno ese día
      sinHorarios: profesionales.filter((p) => !porProfesional.has(p.person_id)),
    };
  }, [data.workerProfessional, data.appointments, data.persons, fecha, ahora]);

  const pasa = (t: Turno) => vista === "todos" || (vista === "libres" ? t.estado === "libre" : t.estado === "ocupado");
  const visibles = grupos.map((g) => ({ ...g, turnos: g.turnos.filter(pasa) })).filter((g) => g.turnos.length > 0);
  const esHoy = fecha === hoy;

  return (
    <Paper component="section" aria-label="Horarios del día" elevation={0} sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      {/* Encabezado: qué día es y cuántos turnos quedan */}
      <Box sx={{ px: { xs: 1.75, sm: 2.25 }, py: 1.5, borderBottom: "0.5px solid", borderColor: "divider", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: "9px", display: "grid", placeItems: "center", flex: "none", bgcolor: tone.green.bg, color: tone.green.fg }}>
          <EventAvailableRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: "1 1 180px", minWidth: 0 }}>
          <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", lineHeight: 1.25 }}>
            {esHoy ? "Horarios de hoy" : "Horarios del día"}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.3, "&::first-letter": { textTransform: "uppercase" } }}>{fechaLarga(fecha)}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75 }}>
          <Box component="span" sx={contadorSx("green")}>
            {libres} {libres === 1 ? "disponible" : "disponibles"}
          </Box>
          <Box component="span" sx={contadorSx("amber")}>
            {ocupados} {ocupados === 1 ? "ocupado" : "ocupados"}
          </Box>
          <IconButton
            size="small"
            aria-label="Actualizar los horarios"
            title="Actualizar"
            onClick={actualizar}
            disabled={actualizando}
            sx={{ width: 30, height: 30, borderRadius: "8px", border: "0.5px solid", borderColor: "divider" }}
          >
            {actualizando ? <CircularProgress size={14} /> : <RefreshRoundedIcon sx={{ fontSize: 17 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Día y qué turnos mostrar */}
      <Box sx={{ px: { xs: 1.75, sm: 2.25 }, pt: 1.5, display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 1.5 }}>
        <Box sx={{ flex: "0 1 200px", minWidth: 170 }}>
          <Campo etiqueta="Día" htmlFor="horarios-dia-fecha">
            <CampoFecha id="horarios-dia-fecha" titulo="Día a consultar" tipo="cualquiera" value={fecha} onChange={(v) => v && setFecha(v)} fieldSx={campoSx} />
          </Campo>
        </Box>
        <Box role="group" aria-label="Qué turnos mostrar" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, pb: 0.75 }}>
          {VISTAS.map(([valor, texto]) => {
            const activa = vista === valor;
            return (
              <Button
                key={valor}
                size="small"
                aria-pressed={activa}
                onClick={() => setVista(valor)}
                sx={{
                  minWidth: 0,
                  height: 30,
                  px: 1.5,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: "0.5px solid",
                  borderColor: activa ? tone.blue.fg : "divider",
                  bgcolor: activa ? tone.blue.fg : "transparent",
                  color: activa ? "background.paper" : "text.secondary",
                  "&:hover": { bgcolor: activa ? tone.blue.fg : "action.hover" },
                }}
              >
                {texto}
              </Button>
            );
          })}
          {!esHoy && (
            <Button size="small" onClick={() => setFecha(hoy)} sx={{ minWidth: 0, height: 30, px: 1.5, borderRadius: "999px", textTransform: "none", fontSize: "0.8rem", fontWeight: 600, color: tone.green.fg, bgcolor: tone.green.bg, border: `0.5px solid ${tone.green.border}` }}>
              Volver a hoy
            </Button>
          )}
        </Box>
      </Box>

      {/* Turnos por profesional */}
      <Box sx={{ px: { xs: 1.75, sm: 2.25 }, py: 1.75, display: "flex", flexDirection: "column", gap: 1.75, maxHeight: 440, overflowY: "auto" }}>
        {visibles.length === 0 && (
          <Box sx={{ py: 4, textAlign: "center", borderRadius: 3, border: "1.5px dashed", borderColor: "divider" }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {grupos.length === 0
                ? `Ningún profesional tiene horarios ${esHoy ? "para hoy" : "ese día"}.`
                : vista === "libres"
                  ? `No queda ningún turno disponible ${esHoy ? "hoy" : "ese día"}.`
                  : `No hay turnos ocupados ${esHoy ? "hoy" : "ese día"}.`}
            </Typography>
          </Box>
        )}

        {visibles.map(({ persona, turnos }) => (
          <Box key={persona.person_id}>
            <Box sx={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: 1, mb: 0.75 }}>
              <Typography component="h3" sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
                {persona.first_name} {persona.last_name}
              </Typography>
              {persona.professional?.specialty && <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>{persona.professional.specialty}</Typography>}
            </Box>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 0.75 }}>
              {turnos.map((t) => {
                const estado = t.cita ? estadoCita(t.cita.appointment_status) : null;
                const colores =
                  t.estado === "libre"
                    ? { bg: tone.green.bg, borde: tone.green.border, texto: tone.green.fg }
                    : t.estado === "ocupado"
                      ? { bg: "action.hover", borde: "divider", texto: "text.primary" }
                      : { bg: "transparent", borde: "divider", texto: "text.disabled" };
                return (
                  <Box
                    component="li"
                    key={t.id}
                    sx={{ minWidth: 0, px: 1.25, py: 0.875, borderRadius: 2, border: "0.5px solid", borderColor: colores.borde, bgcolor: colores.bg, borderLeft: `3px solid ${t.estado === "libre" ? tone.green.main : estado?.main ?? tone.gray.main}` }}
                  >
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, fontFamily: "monospace", color: colores.texto, lineHeight: 1.3 }}>
                      {t.inicio} – {t.fin}
                    </Typography>
                    {t.estado === "libre" && <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: tone.green.fg, lineHeight: 1.35 }}>{t.enCurso ? "Disponible · en curso" : "Disponible"}</Typography>}
                    {t.estado === "pasado" && <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.35 }}>Quedó libre (ya pasó)</Typography>}
                    {t.estado === "ocupado" && (
                      <>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.primary", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.cita?.client ? `${t.cita.client.first_name} ${t.cita.client.last_name}` : "Ocupado"}
                        </Typography>
                        {t.cita && (
                          // Hasta dos líneas: el nombre de un servicio largo no se corta a la mitad
                          <Typography sx={{ fontSize: 11, color: estado?.fg ?? "text.secondary", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflowWrap: "anywhere" }}>
                            {[estado?.nombre, t.cita.service?.name].filter(Boolean).join(" · ")}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}

        {vista !== "ocupados" && sinHorarios.length > 0 && grupos.length > 0 && (
          <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.5 }}>
            Sin horarios {esHoy ? "hoy" : "ese día"}: {sinHorarios.map((p) => `${p.first_name} ${p.last_name}`).join(", ")}.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
