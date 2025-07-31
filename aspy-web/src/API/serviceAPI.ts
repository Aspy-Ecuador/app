import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { Service } from "@/types/Service";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const serviceAPI = {
  getAllServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/service`, config),

  getServiceById: async (id: number): Promise<Service> =>
    (await axios.get(`${apiURL}/service/${id}`, config)).data,

  createService: async (data: Service): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/service`, data, config),

  updateService: async (id: number, data: number): Promise<AxiosResponse> => {
    const data_update = { price: data };
    return axios.put(`${apiURL}/service/${id}`, data_update, config);
  },

  deleteService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/service/${id}`, config),
};

export default serviceAPI;
