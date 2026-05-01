// FINAL
import api from "@API/api";
import type { Person } from "@/typesResponse/Person";

interface PersonData {
  first_name: string; // First name of the person
  last_name: string; // Last name of the person
  email: string; // Email address of the person
  phone: string; // Phone number of the person
  birthdate: string; // Birthdate of the person
  gender: number; // Gender (e.g., 1 for male, 2 for female)
}

const personAPI = {
  getAllPersons: async (): Promise<Person[]> => (await api.get(`/person`)).data,

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
};

export default personAPI;
