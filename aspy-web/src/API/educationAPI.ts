import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface EducationData {
  name: string;           // Name of the education level
  created_by: string;     // Creator of the education level
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const educationAPI = {
  // Get all education levels
  getAllEducations: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/education`, config);
  },

  // Get education by ID
  getEducationById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/education/${id}`, config);
  },

  // Create a new education level
  createEducation: async (educationData: EducationData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/education`, educationData, config);
  },

  // Update education by ID
  updateEducation: async (id: string, educationData: EducationData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/education/${id}`, educationData, config);
  },

  // Delete education by ID
  deleteEducation: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/education/${id}`, config);
  },
};

export default educationAPI;
