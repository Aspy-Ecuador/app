import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface IdentificationData {
  person_id: number;       // Person ID associated with the identification
  type: string;            // Type of identification (e.g., 'DNI', 'Passport')
  number: string;          // Identification number
  due_date: string;        // Due date of the identification
  created_by: string;      // Creator of the identification
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const identificationAPI = {
  // Get all identifications
  getAllIdentifications: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/identification`, config);
  },

  // Get identification by ID
  getIdentificationById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/identification/${id}`, config);
  },

  // Create a new identification
  createIdentification: async (identificationData: IdentificationData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/identification`, identificationData, config);
  },

  // Update identification by ID
  updateIdentification: async (id: string, identificationData: IdentificationData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/identification/${id}`, identificationData, config);
  },

  // Delete identification by ID
  deleteIdentification: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/identification/${id}`, config);
  },
};

export default identificationAPI;
