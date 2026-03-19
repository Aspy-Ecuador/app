import { AxiosResponse } from "axios";
import api from "@API/api";
import { ServiceRequest } from "src/typesRequest/ServiceRequest";
import { Service } from "@/typesResponse/Service";

const serviceAPI = {
  getAllServices: async (): Promise<Service[]> =>
    (await api.get(`/service`)).data,

  getServiceById: async (id: number): Promise<Service> =>
    (await api.get(`/service/${id}`)).data,

  createService: async (data: ServiceRequest): Promise<AxiosResponse> =>
    api.post(`/service`, data),

  updateService: async (id: number, data: number): Promise<AxiosResponse> => {
    const data_update = { price: data };
    return api.put(`/service/${id}`, data_update);
  },

  deleteService: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/service/${id}`),
};

export default serviceAPI;
