import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";

interface WorkerScheduleData {
  schedule_id: number;
  worker_id: number;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<AxiosResponse> =>
    await axios.get(`${apiURL}/worker-schedule`, config),

  getWorkerScheduleById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/worker-schedule/${id}`, config),

  createWorkerSchedule: async (
    data: WorkerScheduleData
  ): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/worker-schedule`, data, config),

  updateWorkerSchedule: async (
    id: string,
    data: WorkerScheduleData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/worker-schedule/${id}`, data, config),

  deleteWorkerSchedule: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/worker-schedule/${id}`, config),
};

export default workerScheduleAPI;
