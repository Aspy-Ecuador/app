import { AxiosResponse } from "axios";
import api from "@API/api";

interface WorkerScheduleData {
  schedule_id: number;
  worker_id: number;
}

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<AxiosResponse> =>
    await api.get(`/worker-schedule`),

  getWorkerScheduleById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/worker-schedule/${id}`),

  createWorkerSchedule: async (
    data: WorkerScheduleData,
  ): Promise<AxiosResponse> => api.post(`/worker-schedule`, data),

  updateWorkerSchedule: async (
    id: string,
    data: WorkerScheduleData,
  ): Promise<AxiosResponse> => api.put(`/worker-schedule/${id}`, data),

  deleteWorkerSchedule: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/worker-schedule/${id}`),
};

export default workerScheduleAPI;
