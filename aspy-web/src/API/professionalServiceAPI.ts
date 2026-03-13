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
    axios.get(`${apiURL}/professional-services`, getConfig()),

  getProfessionalServiceById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/professional-services/${id}`, getConfig()),

  createProfessionalService: async (
    data: ProfessionalServiceData,
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/professional-services`, data, getConfig()),

  updateProfessionalService: async (
    id: string,
    data: ProfessionalServiceData,
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/professional-services/${id}`, data, getConfig()),

  deleteProfessionalService: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/professional-services/${id}`, getConfig()),
};

export default professionalServiceAPI;
