// FINAL
import api from "@API/api";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<WorkerProfessional[]> =>
    (await api.get(`/worker-schedule`)).data,
};

export default workerScheduleAPI;
