import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface PhoneData {
  person_id: number;
  number: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const phoneAPI = {
  getAllPhones: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/phone`, config),

  getPhoneById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/phone/${id}`, config),

  createPhone: async (data: PhoneData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/phone`, data, config),

  updatePhone: async (id: string, data: PhoneData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/phone/${id}`, data, config),

  deletePhone: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/phone/${id}`, config),
};

export default phoneAPI;
