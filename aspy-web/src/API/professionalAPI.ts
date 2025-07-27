import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface ProfessionalData {
  specialty_id: number;
  person_id: number;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const professionalAPI = {
  getAllProfessionals: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional`, config),

  getProfessionalById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional/${id}`, config),

  createProfessional: async (data: ProfessionalData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/professional`, data, config),

  updateProfessional: async (id: string, data: ProfessionalData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/professional/${id}`, data, config),

  deleteProfessional: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/professional/${id}`, config),
};

export default professionalAPI;
