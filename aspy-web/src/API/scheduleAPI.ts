import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface ScheduleData {
  person_id: number;
  start_time: string;
  end_time: string;
  days: string[];
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const scheduleAPI = {
  getAllSchedules: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/schedule`, config),

  getScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/schedule/${id}`, config),

  createSchedule: async (data: ScheduleData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/schedule`, data, config),

  updateSchedule: async (id: string, data: ScheduleData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/schedule/${id}`, data, config),

  deleteSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/schedule/${id}`, config),
};

export default scheduleAPI;
