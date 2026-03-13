import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { ServiceRequest } from "src/typesRequest/ServiceRequest";
import { getConfig } from "./config";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";

const serviceAPI = {
  getAllServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/services`, getConfig()),

  getServiceById: async (id: number): Promise<ServiceResponse> =>
    (await axios.get(`${apiURL}/services/${id}`, getConfig())).data,

  createService: async (data: ServiceRequest): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/services`, data, getConfig()),

  updateService: async (id: number, data: number): Promise<AxiosResponse> => {
    const data_update = { price: data };
    return axios.put(`${apiURL}/services/${id}`, data_update, getConfig());
  },

  deleteService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/services/${id}`, getConfig()),
};

export default serviceAPI;
