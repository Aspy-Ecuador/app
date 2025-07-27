import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface MedicalProfileData {
  person_id: number;    // Person ID associated with the medical profile
  diagnose: string;     // Diagnosis or medical condition
  created_by: string;   // Creator of the medical profile
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const medicalProfileAPI = {
  // Get all medical profiles
  getAllMedicalProfiles: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/medical-profile`, config);
  },

  // Get medical profile by ID
  getMedicalProfileById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/medical-profile/${id}`, config);
  },

  // Create a new medical profile
  createMedicalProfile: async (medicalProfileData: MedicalProfileData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/medical-profile`, medicalProfileData, config);
  },

  // Update medical profile by ID
  updateMedicalProfile: async (id: string, medicalProfileData: MedicalProfileData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/medical-profile/${id}`, medicalProfileData, config);
  },

  // Delete medical profile by ID
  deleteMedicalProfile: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/medical-profile/${id}`, config);
  },
};

export default medicalProfileAPI;
