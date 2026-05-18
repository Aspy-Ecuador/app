// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";

const professionalAPI = {
  crearHorario: async (data: {
    professional_id: number;
    date: string;
    start_time: string;
    end_time: string;
    name: string;
  }): Promise<AxiosResponse> =>
    api.post(`/professional/create-horario`, data),
};

export default professionalAPI;