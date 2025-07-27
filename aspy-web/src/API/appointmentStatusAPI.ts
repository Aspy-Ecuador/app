import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface AppointmentStatusData {
  name: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const appointmentStatusAPI = {
  getAllStatuses: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-status`, config),

  getStatusById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-status/${id}`, config),

  createStatus: async (data: AppointmentStatusData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/appointment-status`, data, config),

  updateStatus: async (id: string, data: AppointmentStatusData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/appointment-status/${id}`, data, config),

  deleteStatus: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/appointment-status/${id}`, config),
};

export default appointmentStatusAPI;
