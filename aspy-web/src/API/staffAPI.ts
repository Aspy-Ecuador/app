import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface StaffData {
  person_id: number;
  hire_date: string;
  department: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const staffAPI = {
  getAllStaff: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/staff`, config),

  getStaffById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/staff/${id}`, config),

  createStaff: async (data: StaffData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/staff`, data, config),

  updateStaff: async (id: string, data: StaffData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/staff/${id}`, data, config),

  deleteStaff: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/staff/${id}`, config),
};

export default staffAPI;
