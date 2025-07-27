import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface CityData {
  name: string;          // Name of the city
  state_id: number;      // State ID the city belongs to
  created_by: string;    // Creator of the city
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const cityAPI = {
  // Get all cities
  getAllCities: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/city`, config);
  },

  // Get city by ID
  getCityById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/city/${id}`, config);
  },

  // Create a new city
  createCity: async (cityData: CityData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/city`, cityData, config);
  },

  // Update city by ID
  updateCity: async (id: string, cityData: CityData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/city/${id}`, cityData, config);
  },

  // Delete city by ID
  deleteCity: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/city/${id}`, config);
  },
};

export default cityAPI;
