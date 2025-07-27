import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface MaritalStatusData {
  name: string;           // Name of the marital status (e.g., 'Single', 'Married')
  created_by: string;     // Creator of the marital status
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const maritalStatusAPI = {
  // Get all marital statuses
  getAllMaritalStatuses: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/marital-status`, config);
  },

  // Get marital status by ID
  getMaritalStatusById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/marital-status/${id}`, config);
  },

  // Create a new marital status
  createMaritalStatus: async (maritalStatusData: MaritalStatusData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/marital-status`, maritalStatusData, config);
  },

  // Update marital status by ID
  updateMaritalStatus: async (id: string, maritalStatusData: MaritalStatusData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/marital-status/${id}`, maritalStatusData, config);
  },

  // Delete marital status by ID
  deleteMaritalStatus: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/marital-status/${id}`, config);
  },
};

export default maritalStatusAPI;
