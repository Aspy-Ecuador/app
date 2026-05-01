// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { ServiceRequest } from "@/typesRequest/ServiceRequest";
import type { Service } from "@/typesResponse/Service";

const serviceAPI = {
  getAllServices: async (): Promise<Service[]> =>
    (await api.get(`/service`)).data,

  createService: async (data: ServiceRequest): Promise<AxiosResponse> =>
    api.post(`/service`, data),
};

export default serviceAPI;
