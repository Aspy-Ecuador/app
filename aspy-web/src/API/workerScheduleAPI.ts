import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

interface WorkerScheduleData {
  schedule_id: number;
  worker_id: number;
}

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<WorkerProfessional[]> =>
    (await api.get(`/worker-schedule`)).data,

  getWorkerScheduleById: async (id: string): Promise<WorkerProfessional> =>
    (await api.get(`/worker-schedule/${id}`)).data,

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
