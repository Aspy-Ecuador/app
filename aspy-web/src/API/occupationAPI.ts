import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface OccupationData {
  name: string;           // Name of the occupation (e.g., 'Engineer', 'Doctor')
  created_by: string;     // Creator of the occupation
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const occupationAPI = {
  // Get all occupations
  getAllOccupations: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/occupation`, config);
  },

  // Get occupation by ID
  getOccupationById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/occupation/${id}`, config);
  },

  // Create a new occupation
  createOccupation: async (occupationData: OccupationData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/occupation`, occupationData, config);
  },

  // Update occupation by ID
  updateOccupation: async (id: string, occupationData: OccupationData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/occupation/${id}`, occupationData, config);
  },

  // Delete occupation by ID
  deleteOccupation: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/occupation/${id}`, config);
  },
};

export default occupationAPI;
