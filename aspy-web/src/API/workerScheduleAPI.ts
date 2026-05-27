// FINAL
import api from "@API/api";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<WorkerProfessional[]> =>
    (await api.get(`/worker-schedule`)).data,

  deleteWorkerSchedule: async (id: number): Promise<void> =>
    api.delete(`/worker-schedule/${id}`),
};

export default workerScheduleAPI;
