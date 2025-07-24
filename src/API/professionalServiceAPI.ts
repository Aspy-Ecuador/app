import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface ProfessionalServiceData {
  service_id: number;
  professional_id: number;
  cost: number;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const professionalServiceAPI = {
  getAllProfessionalServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional-service`, config),

  getProfessionalServiceById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional-service/${id}`, config),

  createProfessionalService: async (
    data: ProfessionalServiceData
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/professional-service`, data, config),

  updateProfessionalService: async (
    id: string,
    data: ProfessionalServiceData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/professional-service/${id}`, data, config),

  deleteProfessionalService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/professional-service/${id}`, config),
};

export default professionalServiceAPI;
