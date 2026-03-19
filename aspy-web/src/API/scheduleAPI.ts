import { AxiosResponse } from "axios";
import api from "@API/api";

interface ScheduleData {
  person_id: number;
  start_time: string;
  end_time: string;
  days: string[];
}

const scheduleAPI = {
  getAllSchedules: async (): Promise<AxiosResponse> => api.get(`/schedule`),

  getScheduleById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/schedule/${id}`),

  createSchedule: async (data: ScheduleData): Promise<AxiosResponse> =>
    api.post(`/schedule`, data),

  updateSchedule: async (
    id: string,
    data: ScheduleData,
  ): Promise<AxiosResponse> => api.put(`/schedule/${id}`, data),

  deleteSchedule: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/schedule/${id}`),
};

export default scheduleAPI;
