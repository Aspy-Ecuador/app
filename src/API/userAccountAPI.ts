import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface UserAccountData {
  email: string;                    // Email address
  password: string;                 // Password for the user
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const userAccountAPI = {
  // Get all user accounts
  getAllUserAccounts: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/user-account`, config);
  },

  // Get user account by ID
  getUserAccountById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/user-account/${id}`, config);
  },

  // Create a new user account
  createUserAccount: async (userAccountData: UserAccountData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/user-account`, userAccountData, config);
  },

  // Update user account by ID
  updateUserAccount: async (id: string, userAccountData: UserAccountData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/user-account/${id}`, userAccountData, config);
  },

  // Delete user account by ID
  deleteUserAccount: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/user-account/${id}`, config);
  },
};

export default userAccountAPI;
