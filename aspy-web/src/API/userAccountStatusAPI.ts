import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface UserAccountStatusData {
  name: string;
  description: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const userAccountStatusAPI = {
  getAllStatuses: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/user-account-status`, config),

  getStatusById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/user-account-status/${id}`, config),

  createStatus: async (data: UserAccountStatusData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/user-account-status`, data, config),

  updateStatus: async (id: string, data: UserAccountStatusData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/user-account-status/${id}`, data, config),

  deleteStatus: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/user-account-status/${id}`, config),
};

export default userAccountStatusAPI;
