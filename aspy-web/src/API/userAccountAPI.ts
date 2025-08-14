import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";

interface UserAccountData {
  email: string; // Email address
  password: string; // Password for the user
}

const userAccountAPI = {
  // Get all user accounts
  getAllUserAccounts: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/user-account`, getConfig());
  },

  // Get user account by ID
  getUserAccountById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/user-account/${id}`, getConfig());
  },

  // Create a new user account
  createUserAccount: async (
    userAccountData: UserAccountData
  ): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/user-account`, userAccountData, getConfig());
  },

  // Update user account by ID
  updateUserAccount: async (
    id: number,
    userAccountData: UserAccountRequest
  ): Promise<AxiosResponse> => {
    return axios.put(
      `${apiURL}/user-account/${id}`,
      userAccountData,
      getConfig()
    );
  },

  // Delete user account by ID
  deleteUserAccount: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/user-account/${id}`, getConfig());
  },
};

export default userAccountAPI;
