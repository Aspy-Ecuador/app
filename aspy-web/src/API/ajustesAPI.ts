import api from "@API/api";

/** Hasta cuándo se pueden crear horarios. Deben coincidir con `Ajuste::ALCANCES` del backend. */
export type AlcanceHorario = "dia" | "semana" | "dos_semanas" | "mes" | "dos_meses";

/** Opciones del alcance, de la más corta a la más larga (el texto es el que lee el Admin). */
export const ALCANCES: [valor: AlcanceHorario, texto: string][] = [
  ["dia", "Solo el día de hoy"],
  ["semana", "La semana en curso (hasta el domingo)"],
  ["dos_semanas", "La semana en curso y la siguiente"],
  ["mes", "El mes en curso (recomendado)"],
  ["dos_meses", "El mes en curso y el siguiente"],
];

/** Ajustes del sistema. Los leen Secretaría y el Admin; solo el Admin los cambia. */
export interface Ajustes {
  /** Días que se conserva el comprobante de un pago rechazado. 0 = no se borra nunca. */
  comprobante_rechazado_dias: number;
  /** Valores que acepta el servidor. */
  opciones_dias: number[];
  /** Hasta cuándo pueden crear horarios los profesionales (y Secretaría, si está habilitada). */
  horario_alcance: AlcanceHorario;
  opciones_alcance: AlcanceHorario[];
  /** Último día en que hoy se puede crear un horario con ese alcance ("AAAA-MM-DD"). */
  horario_hasta: string;
  /** true si Secretaría puede crear y quitar horarios de los profesionales. */
  horario_secretaria: boolean;
}

/** Lo que el Admin puede cambiar; cada ajuste se guarda por separado. */
export type CambiosDeAjustes = Partial<Pick<Ajustes, "comprobante_rechazado_dias" | "horario_alcance" | "horario_secretaria">>;

/** "un día", "7 días"… (0 = no se borra). */
export function plazoEnPalabras(dias: number): string {
  if (dias <= 0) return "siempre";
  return dias === 1 ? "un día" : `${dias} días`;
}

const ajustesAPI = {
  get: async (): Promise<Ajustes> => (await api.get(`/ajustes`)).data,

  guardar: async (cambios: CambiosDeAjustes): Promise<Ajustes> => (await api.put(`/ajustes`, cambios)).data,
};

export default ajustesAPI;
