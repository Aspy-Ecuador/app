// FINAL
import api from "@API/api";
import type { Person } from "@/typesResponse/Person";

const personAPI = {
  getAllPersons: async (): Promise<Person[]> => (await api.get(`/person`)).data,
};

export default personAPI;
