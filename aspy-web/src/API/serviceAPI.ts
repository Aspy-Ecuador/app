// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { ServiceRequest } from "@/typesRequest/ServiceRequest";
import type { Service } from "@/typesResponse/Service";

const serviceAPI = {
  getAllServices: async (): Promise<Service[]> =>
    (await api.get(`/service`)).data,

  getServiceById: async (id: number): Promise<Service> =>
    (await api.get(`/service/${id}`)).data,

  createService: async (data: ServiceRequest): Promise<AxiosResponse> =>
    api.post(`/service`, data),

  updateService: async (
    id: number,
    data: ServiceRequest,
  ): Promise<AxiosResponse> => {
    return api.put(`/service/${id}`, data);
  },

  deleteService: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/service/${id}`),
};

export default serviceAPI;
