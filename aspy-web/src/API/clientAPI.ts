import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface ClientData {
  person_id: number;   // The person ID associated with the client
  created_by: string;  // The creator of the client
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const clientAPI = {
  // Get all clients
  getAllClients: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/client`, config);
  },

  // Get client by ID
  getClientById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/client/${id}`, config);
  },

  // Create a new client
  createClient: async (clientData: ClientData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/client`, clientData, config);
  },

  // Update client by ID
  updateClient: async (id: string, clientData: { modified_by: string }): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/client/${id}`, clientData, config);
  },

  // Delete client by ID
  deleteClient: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/client/${id}`, config);
  },
};

export default clientAPI;
