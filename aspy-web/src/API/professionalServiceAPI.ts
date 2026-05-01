// FINAL
import api from "@API/api";
import type { ProfessionalService } from "@/typesResponse/ProfessionalService";

const professionalServiceAPI = {
  getAllProfessionalServices: async (): Promise<ProfessionalService[]> =>
    (await api.get(`/professional-service`)).data,
};

export default professionalServiceAPI;
