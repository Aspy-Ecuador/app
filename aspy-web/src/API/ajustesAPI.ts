import api from "@API/api";

/** Ajustes del sistema. Los leen Secretaría y el Admin; solo el Admin los cambia. */
export interface Ajustes {
  /** Días que se conserva el comprobante de un pago rechazado. 0 = no se borra nunca. */
  comprobante_rechazado_dias: number;
  /** Valores que acepta el servidor. */
  opciones_dias: number[];
}

/** "un día", "7 días"… (0 = no se borra). */
export function plazoEnPalabras(dias: number): string {
  if (dias <= 0) return "siempre";
  return dias === 1 ? "un día" : `${dias} días`;
}

const ajustesAPI = {
  get: async (): Promise<Ajustes> => (await api.get(`/ajustes`)).data,

  guardar: async (comprobante_rechazado_dias: number): Promise<Ajustes> =>
    (await api.put(`/ajustes`, { comprobante_rechazado_dias })).data,
};

export default ajustesAPI;
