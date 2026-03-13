import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface WorkerScheduleData {
  schedule_id: number;
  worker_id: number;
}

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<AxiosResponse> =>
    await axios.get(`${apiURL}/worker-schedules`, getConfig()),

  getWorkerScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/worker-schedules/${id}`, getConfig()),

  createWorkerSchedule: async (
    data: WorkerScheduleData,
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/worker-schedules`, data, getConfig()),

  updateWorkerSchedule: async (
    id: string,
    data: WorkerScheduleData,
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/worker-schedules/${id}`, data, getConfig()),

  deleteWorkerSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/worker-schedules/${id}`, getConfig()),
};

export default workerScheduleAPI;
