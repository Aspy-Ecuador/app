// Nombre y color de cada estado de cita, por identificador (los ids son fijos; ver CLAUDE.md).
// Es la única fuente para tarjetas, líneas de tiempo y etiquetas. Antes cada pantalla decidía el
// color por el NOMBRE guardado en la base y no coincidían entre sí ni con la leyenda del calendario
// (p. ej., "Guardada" salía verde en el panel de secretaría y naranja en la agenda).
import { tone } from "@shared-theme/themePrimitives";

const ESTADOS: Record<number, { nombre: string; tono: keyof typeof tone }> = {
  1: { nombre: "Guardada", tono: "amber" },
  2: { nombre: "Agendada", tono: "green" },
  3: { nombre: "Asistió", tono: "blue" },
  4: { nombre: "No Asistió", tono: "red" },
  5: { nombre: "Cancelada", tono: "purple" },
};

export interface EstiloEstadoCita {
  nombre: string;
  /** Fondo suave. */
  bg: string;
  /** Texto sobre el fondo suave. */
  fg: string;
  /** Color pleno (puntos, líneas, bordes de acento). */
  main: string;
  border: string;
}

/** Estilo del estado; si llega un id desconocido usa gris y el nombre que venga de la base. */
export function estadoCita(estado: { appointment_status_id?: number; name?: string } | null | undefined): EstiloEstadoCita {
  const def = ESTADOS[Number(estado?.appointment_status_id)];
  const t = tone[def?.tono ?? "gray"];
  return { nombre: def?.nombre ?? estado?.name ?? "Sin estado", bg: t.bg, fg: t.fg, main: t.main, border: t.border };
}
