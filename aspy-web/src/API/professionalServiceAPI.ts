// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { ProService } from "@/typesRequest/ProService";
import type { ProfessionalService } from "@/typesResponse/ProfessionalService";

const professionalServiceAPI = {
  getAllProfessionalServices: async (): Promise<ProfessionalService[]> =>
    (await api.get(`/professional-service`)).data,

  createProfessionalService: async (
    data: ProService,
  ): Promise<AxiosResponse> => {
    return api.post(`/professional-service`, data);
  },

  updateProService: async (
    professional_service_id: number,
    professional_id: number,
  ) => {
    return (
      await api.put(`/professional-service/${professional_service_id}`, {
        professional_id,
      })
    ).data;
  },
};

export default professionalServiceAPI;
