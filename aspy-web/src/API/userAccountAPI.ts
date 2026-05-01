import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { UserForm } from "@/typesRequest/UserForm";

const userAccountAPI = {
  updateUserAccount: async (
    id: number,
    userAccountData: UserForm,
  ): Promise<AxiosResponse> => {
    return api.put(`/user-account/${id}`, userAccountData);
  },
};

export default userAccountAPI;
