import api from "@API/api";
import apiURL from "@API/apiConfig";

/** Pase temporal y firmado para abrir los manuales que puede ver el rol (los archivos no son públicos). */
export interface AccesoManuales {
  pase: string;
  manuales: string[];
  /** Fecha de vencimiento (segundos Unix). */
  expira: number;
}

const manualAPI = {
  acceso: async (): Promise<AccesoManuales> => (await api.get(`/manuales/acceso`)).data,

  /** URL de un archivo del manual con el pase (las imágenes y el PDF se piden relativas a ella). */
  url: (pase: string, archivo: string): string => `${apiURL}/manuales/archivo/${pase}/${archivo}.html`,
};

export default manualAPI;
