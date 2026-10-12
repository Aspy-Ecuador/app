import api from "@API/api";
import type { ResumenDeAvisos } from "@/typesResponse/Aviso";

/** Avisos de la cuenta con sesión: el servidor nunca entrega ni marca los de otra cuenta. */
const avisosAPI = {
  listar: async (): Promise<ResumenDeAvisos> => (await api.get(`/avisos`)).data,

  /** Marca como leídos los avisos indicados; sin lista, todos. */
  marcarLeidos: async (ids?: number[]): Promise<{ marcados: number; sin_leer: number }> =>
    (await api.put(`/avisos/leidos`, ids ? { ids } : {})).data,
};

export default avisosAPI;
