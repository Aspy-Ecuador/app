import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { ServiceResponse } from "src/types/ServiceResponse";
import { getConfig } from "./config";

const serviceAPI = {
  getAllServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/service`, getConfig()),

  getServiceById: async (id: number): Promise<ServiceResponse> =>
    (await axios.get(`${apiURL}/service/${id}`, getConfig())).data,

  createService: async (data: ServiceResponse): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/service`, data, getConfig()),

  updateService: async (id: number, data: number): Promise<AxiosResponse> => {
    const data_update = { price: data };
    return axios.put(`${apiURL}/service/${id}`, data_update, getConfig());
  },

  deleteService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/service/${id}`, getConfig()),
};

export default serviceAPI;
