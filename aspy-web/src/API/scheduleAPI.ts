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
    axios.get(`${apiURL}/schedules`, getConfig()),

  getScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/schedules/${id}`, getConfig()),

  createSchedule: async (data: ScheduleData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/schedules`, data, getConfig()),

  updateSchedule: async (
    id: string,
    data: ScheduleData,
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/schedules/${id}`, data, getConfig()),

  deleteSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/schedules/${id}`, getConfig()),
};

export default scheduleAPI;
