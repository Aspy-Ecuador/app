// Política de privacidad y consentimiento (Ley Orgánica de Protección de Datos Personales, LOPDP).
// Debe coincidir con `ConsentimientoController` del backend: si cambia el texto de la política
// (privacidad/seccionesPolitica.ts) o las declaraciones, sube la versión en los dos lados y todos
// tendrán que aceptarla de nuevo.
export const VERSION_POLITICA = "2.0";
export const FECHA_POLITICA = "octubre de 2026";

/** Edad desde la que una persona puede consentir por sí misma (LOPDP, art. 21). */
export const EDAD_PARA_CONSENTIR = 15;

/** Cada declaración se acepta por separado (arts. 8 y 26): nada va marcado de antemano. */
export type Declaracion = "tratamiento" | "datos_sensibles" | "confidencialidad" | "transferencia";

export interface Representante {
  nombre: string;
  identificacion: string;
}

/** Lo que se envía al servidor como constancia del consentimiento. */
export interface Consentimiento {
  declaraciones: Declaracion[];
  /** Madre, padre o representante legal: obligatorio si la cuenta es de una persona menor de 15 años. */
  representante: Representante | null;
}

export const DECLARACIONES: Record<Declaracion, { titulo: string; texto: string }> = {
  tratamiento: {
    titulo: "Mis datos personales",
    texto:
      "Leí esta política y autorizo a ASPY a tratar mis datos personales para todas las finalidades del punto 4: administrar mi cuenta, agendar y registrar mis citas, verificar mis pagos, dar seguimiento a la atención y comunicarse conmigo.",
  },
  datos_sensibles: {
    titulo: "Datos de salud y de discapacidad",
    texto:
      "Autorizo de forma expresa que ASPY trate datos de salud y de discapacidad (los míos o los de la persona a quien represento) solo para la atención terapéutica y su seguimiento: reportes de sesión, evaluaciones y registro de asistencia.",
  },
  confidencialidad: {
    titulo: "Compromiso de confidencialidad",
    texto:
      "Me comprometo a usar los datos personales y de salud que conozca por mi trabajo solo para cumplir mis funciones, a no compartirlos fuera de ASPY y a guardar reserva incluso después de terminar mi relación con la fundación.",
  },
  transferencia: {
    titulo: "Guardado fuera del Ecuador",
    texto:
      "Autorizo que mis datos se guarden en los servidores de los proveedores indicados en el punto 7, ubicados fuera del Ecuador. Entiendo que esos países pueden no tener una protección equivalente a la ecuatoriana y que ASPY sigue siendo responsable de cuidarlos.",
  },
};

/** Declaraciones que le tocan a cada quien (igual que `declaracionesRequeridas` en el backend). */
export function declaracionesPara(esPaciente: boolean): Declaracion[] {
  return esPaciente ? ["tratamiento", "datos_sensibles", "transferencia"] : ["tratamiento", "confidencialidad", "transferencia"];
}

/** Años cumplidos a hoy a partir de una fecha `AAAA-MM-DD` (null si no hay fecha válida). */
export function edadDe(fechaNacimiento?: string | null): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(fechaNacimiento ?? "");
  if (!m) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - Number(m[1]);
  if (hoy.getMonth() + 1 < Number(m[2]) || (hoy.getMonth() + 1 === Number(m[2]) && hoy.getDate() < Number(m[3]))) edad--;
  return edad;
}
