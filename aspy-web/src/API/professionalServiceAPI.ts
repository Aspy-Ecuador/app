import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface ProfessionalServiceData {
  service_id: number;
  professional_id: number;
  cost: number;
}

const professionalServiceAPI = {
  getAllProfessionalServices: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional-service`, getConfig()),

  getProfessionalServiceById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional-service/${id}`, getConfig()),

  createProfessionalService: async (
    data: ProfessionalServiceData
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/professional-service`, data, getConfig()),

  updateProfessionalService: async (
    id: string,
    data: ProfessionalServiceData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/professional-service/${id}`, data, getConfig()),

  deleteProfessionalService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/professional-service/${id}`, getConfig()),
};

export default professionalServiceAPI;
