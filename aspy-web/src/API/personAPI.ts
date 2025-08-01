import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface PersonData {
  first_name: string; // First name of the person
  last_name: string; // Last name of the person
  email: string; // Email address of the person
  phone: string; // Phone number of the person
  birthdate: string; // Birthdate of the person
  gender: number; // Gender (e.g., 1 for male, 2 for female)
}

const personAPI = {
  // Get all persons
  getAllPersons: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/person`, getConfig());
  },

  // Get person by ID
  getPersonById: async (id: number): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/person/${id - 1}`, getConfig());
  },

  // Create a new person
  createPerson: async (personData: PersonData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/person`, personData, getConfig());
  },

  // Update person by ID
  updatePerson: async (
    id: string,
    personData: PersonData
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/person/${id}`, personData, getConfig());
  },

  // Delete person by ID
  deletePerson: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/person/${id}`, getConfig());
  },
};

export default personAPI;
