import { AxiosResponse } from "axios";
import api from "@API/api";

interface ProfessionalServiceData {
  service_id: number;
  professional_id: number;
  cost: number;
}

const professionalServiceAPI = {
  getAllProfessionalServices: async (): Promise<AxiosResponse> =>
    api.get(`/professional-service`),

  getProfessionalServiceById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/professional-service/${id}`),

  createProfessionalService: async (
    data: ProfessionalServiceData,
  ): Promise<AxiosResponse> => api.post(`/professional-service`, data),

  updateProfessionalService: async (
    id: string,
    data: ProfessionalServiceData,
  ): Promise<AxiosResponse> => api.put(`/professional-service/${id}`, data),

  deleteProfessionalService: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/professional-service/${id}`),
};

export default professionalServiceAPI;
