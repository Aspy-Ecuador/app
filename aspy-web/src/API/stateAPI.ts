import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface StateData {
  name: string;           // State name (e.g., 'California', 'New York')
  country_id: number;     // Country ID the state belongs to
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const stateAPI = {
  // Get all states
  getAllStates: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/state`, config);
  },

  // Get state by ID
  getStateById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/state/${id}`, config);
  },

  // Create a new state
  createState: async (stateData: StateData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/state`, stateData, config);
  },

  // Update state by ID
  updateState: async (id: string, stateData: StateData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/state/${id}`, stateData, config);
  },

  // Delete state by ID
  deleteState: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/state/${id}`, config);
  },
};

export default stateAPI;
