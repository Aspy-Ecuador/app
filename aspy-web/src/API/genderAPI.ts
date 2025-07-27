import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface GenderData {
  name: string;           // Gender name (e.g., 'Male', 'Female')
  created_by: string;     // Creator of the gender
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const genderAPI = {
  // Get all genders
  getAllGenders: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/gender`, config);
  },

  // Get gender by ID
  getGenderById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/gender/${id}`, config);
  },

  // Create a new gender
  createGender: async (genderData: GenderData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/gender`, genderData, config);
  },

  // Update gender by ID
  updateGender: async (id: string, genderData: GenderData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/gender/${id}`, genderData, config);
  },

  // Delete gender by ID
  deleteGender: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/gender/${id}`, config);
  },
};

export default genderAPI;
