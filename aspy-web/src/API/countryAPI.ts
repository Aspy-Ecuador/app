import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface CountryData {
  name: string;          // Name of the country
  phone_code: string;    // Country phone code
  created_by: string;    // Creator of the country
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const countryAPI = {
  // Get all countries
  getAllCountries: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/country`, config);
  },

  // Get country by ID
  getCountryById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/country/${id}`, config);
  },

  // Create a new country
  createCountry: async (countryData: CountryData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/country`, countryData, config);
  },

  // Update country by ID
  updateCountry: async (id: string, countryData: CountryData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/country/${id}`, countryData, config);
  },

  // Delete country by ID
  deleteCountry: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/country/${id}`, config);
  },
};

export default countryAPI;
