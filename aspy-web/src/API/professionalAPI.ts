// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { AlcanceHorario } from "@API/ajustesAPI";

/** Reglas para crear horarios según quien pregunta (las decide el Admin; ver `PUT /ajustes`). */
export interface ReglasHorario {
  /** null para el Admin, que no tiene ese límite. */
  alcance: AlcanceHorario | null;
  /** Primer y último día en que se puede crear un horario ("AAAA-MM-DD"). */
  desde: string;
  hasta: string;
  /** El profesional gestiona los suyos; Secretaría, solo si el Admin lo habilitó. */
  puede_gestionar: boolean;
  secretaria_puede: boolean;
}

// El menú consulta las reglas al cambiar de pantalla: se recuerdan un minuto por sesión (otra cuenta = otra
// consulta), así un cambio del Admin se nota pronto sin pedirlas en cada clic
const VIGENCIA_MS = 60_000;
let recordadas: { sesion: string | null; cuando: number; reglas: Promise<ReglasHorario> } | null = null;

const professionalAPI = {
  crearHorario: async (data: {
    professional_id: number;
    date: string;
    start_time: string;
    end_time: string;
    name: string;
  }): Promise<AxiosResponse> =>
    api.post(`/professional/create-horario`, data),

  /** `fresca` vuelve a preguntar al servidor (p. ej., al abrir la pantalla de horarios). */
  reglasHorario: async (fresca = false): Promise<ReglasHorario> => {
    const sesion = localStorage.getItem("token");
    if (fresca || !recordadas || recordadas.sesion !== sesion || Date.now() - recordadas.cuando > VIGENCIA_MS) {
      const reglas = api.get(`/professional/horario-reglas`).then((r) => r.data as ReglasHorario);
      recordadas = { sesion, cuando: Date.now(), reglas };
      // Si falla, no se recuerda el fallo: la próxima pantalla vuelve a intentar
      reglas.catch(() => {
        if (recordadas?.reglas === reglas) recordadas = null;
      });
    }
    return recordadas.reglas;
  },
};

export default professionalAPI;
