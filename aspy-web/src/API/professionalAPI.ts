import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface ProfessionalData {
  specialty_id: number;
  person_id: number;
}

const professionalAPI = {
  getAllProfessionals: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional`, getConfig()),

  getProfessionalById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional/${id}`, getConfig()),

  createProfessional: async (data: ProfessionalData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/professional`, data, getConfig()),

  updateProfessional: async (
    id: string,
    data: ProfessionalData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/professional/${id}`, data, getConfig()),

  deleteProfessional: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/professional/${id}`, getConfig()),
};

export default professionalAPI;
