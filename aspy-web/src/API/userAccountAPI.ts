import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { UserForm } from "@/typesRequest/UserForm";

interface UserAccountData {
  email: string; // Email address
  password: string; // Password for the user
}

const userAccountAPI = {
  // Get all user accounts
  getAllUserAccounts: async (): Promise<AxiosResponse> => {
    return api.get(`/user-account`);
  },

  // Get user account by ID
  getUserAccountById: async (id: string): Promise<AxiosResponse> => {
    return api.get(`/user-account/${id}`);
  },

  // Create a new user account
  createUserAccount: async (
    userAccountData: UserAccountData,
  ): Promise<AxiosResponse> => {
    return api.post(`/user-account`, userAccountData);
  },

  // Update user account by ID
  updateUserAccount: async (
    id: number,
    userAccountData: UserForm,
  ): Promise<AxiosResponse> => {
    return api.put(`/user-account/${id}`, userAccountData);
  },

  // Delete user account by ID
  deleteUserAccount: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/user-account/${id}`);
  },
};

export default userAccountAPI;
