import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface ServiceData {
  name: string;
  description: string;
  category_id: number;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const serviceAPI = {
  getAllServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/service`, config),

  getServiceById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/service/${id}`, config),

  createService: async (data: ServiceData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/service`, data, config),

  updateService: async (id: string, data: ServiceData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/service/${id}`, data, config),

  deleteService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/service/${id}`, config),
};

export default serviceAPI;
