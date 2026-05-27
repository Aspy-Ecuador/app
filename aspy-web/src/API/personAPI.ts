// FINAL
import api from "@API/api";
import type { Person } from "@/typesResponse/Person";
import type { AxiosResponse } from "axios";

const personAPI = {
  getAllPersons: async (): Promise<Person[]> => (await api.get(`/person`)).data,

  changeAvailable: async (
    id: number,
    is_available: boolean,
  ): Promise<AxiosResponse> =>
    api.patch(`/person/${id}/available`, { is_available }),
};

export default personAPI;
