// Comprobantes de pago y reportes de sesión: se guardan en el servidor y se piden con la sesión
// iniciada (ver ArchivoPrivadoController en el backend). No tienen enlace público.
import api from "@API/api";

export type TipoArchivo = "comprobante" | "reporte";

const PREFIJO = "privado:";

/** `payment_data.file` y `report.file` guardan "privado:123"; los registros viejos, un enlace http. */
export const esArchivoPrivado = (referencia?: string | null): referencia is string =>
  !!referencia && referencia.startsWith(PREFIJO);

/** Cuántos archivos tiene subidos la cuenta y cuáles son sus topes (los pone el servidor). */
export interface ResumenArchivos {
  /** Subidos, pero todavía de ninguna cita ni reporte. */
  sin_usar: number;
  maximo_sin_usar: number;
  /** Subidos hoy. */
  hoy: number;
  maximo_por_dia: number;
}

const archivoAPI = {
  resumen: async (): Promise<ResumenArchivos> => (await api.get("/archivos/resumen")).data,

  /** Sube el archivo y devuelve la referencia que se manda al crear la cita o el reporte. */
  subir: async (archivo: File, tipo: TipoArchivo): Promise<string> => {
    const datos = new FormData();
    datos.append("tipo", tipo);
    datos.append("archivo", archivo, archivo.name);
    return (await api.post("/archivos", datos)).data.archivo;
  },

  descargar: async (referencia: string): Promise<Blob> =>
    (await api.get(`/archivos/${referencia.slice(PREFIJO.length)}`, { responseType: "blob" })).data,
};

export default archivoAPI;
