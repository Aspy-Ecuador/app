import { AxiosResponse } from "axios";
import api from "@API/api";
import { Person } from "@/typesResponse/Person";

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
  getAllPersons: async (): Promise<Person[]> => (await api.get(`/person`)).data,

  // Get person by ID
  getPersonById: async (id: number): Promise<AxiosResponse> => {
    return api.get(`/person/${id - 1}`);
  },

  // Create a new person
  createPerson: async (personData: PersonData): Promise<AxiosResponse> => {
    return api.post(`/person`, personData);
  },

  // Update person by ID
  updatePerson: async (
    id: string,
    personData: PersonData,
  ): Promise<AxiosResponse> => {
    return api.put(`/person/${id}`, personData);
  },

  // Delete person by ID
  deletePerson: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/person/${id}`);
  },
};

export default personAPI;
