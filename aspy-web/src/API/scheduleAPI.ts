import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface ScheduleData {
  person_id: number;
  start_time: string;
  end_time: string;
  days: string[];
}

const scheduleAPI = {
  getAllSchedules: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/schedule`, getConfig()),

  getScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/schedule/${id}`, getConfig()),

  createSchedule: async (data: ScheduleData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/schedule`, data, getConfig()),

  updateSchedule: async (
    id: string,
    data: ScheduleData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/schedule/${id}`, data, getConfig()),

  deleteSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/schedule/${id}`, getConfig()),
};

export default scheduleAPI;
