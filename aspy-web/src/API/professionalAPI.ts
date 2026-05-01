// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";

const professionalAPI = {
  crearHorario: async (data: {
    professional_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }): Promise<AxiosResponse> => api.post(`/professional/create-horario`, data),
};

export default professionalAPI;
