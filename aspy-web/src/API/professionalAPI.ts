import { AxiosResponse } from "axios";
import api from "@API/api";

interface ProfessionalData {
  specialty_id: number;
  person_id: number;
}

const professionalAPI = {
  getAllProfessionals: async (): Promise<AxiosResponse> =>
    api.get(`/professional`),

  getProfessionalById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/professional/${id}`),

  createProfessional: async (data: ProfessionalData): Promise<AxiosResponse> =>
    api.post(`/professional`, data),

  updateProfessional: async (
    id: string,
    data: ProfessionalData,
  ): Promise<AxiosResponse> => api.put(`/professional/${id}`, data),

  deleteProfessional: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/professional/${id}`),

  crearHorario: async (data: {
    professional_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }): Promise<AxiosResponse> => api.post(`/professional/create-horario`, data),
};

export default professionalAPI;
