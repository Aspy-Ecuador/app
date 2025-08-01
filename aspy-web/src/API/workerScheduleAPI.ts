import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface WorkerScheduleData {
  schedule_id: number;
  worker_id: number;
}

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<AxiosResponse> =>
    await axios.get(`${apiURL}/worker-schedule`, getConfig()),

  getWorkerScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/worker-schedule/${id}`, getConfig()),

  createWorkerSchedule: async (
    data: WorkerScheduleData
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/worker-schedule`, data, getConfig()),

  updateWorkerSchedule: async (
    id: string,
    data: WorkerScheduleData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/worker-schedule/${id}`, data, getConfig()),

  deleteWorkerSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/worker-schedule/${id}`, getConfig()),
};

export default workerScheduleAPI;
