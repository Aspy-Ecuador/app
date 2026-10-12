// FINAL
import api from "@API/api";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import type { Modalidad } from "@/typesResponse/WorkerSchedule";

/** Lo que responde el servidor al cambiar la modalidad, el enlace o la aprobación de un horario. */
export interface EstadoDelHorario {
  worker_schedule_id: number;
  modalidad: Modalidad;
  es_virtual: boolean;
  enlace_virtual: string | null;
  plataforma: string | null;
  aprobado: boolean;
  message: string;
}

const workerScheduleAPI = {
  getAllWorkerSchedules: async (): Promise<WorkerProfessional[]> =>
    (await api.get(`/worker-schedule`)).data,

  deleteWorkerSchedule: async (id: number): Promise<void> =>
    api.delete(`/worker-schedule/${id}`),

  /**
   * Modalidad y enlace de la reunión de un horario. Solo se cambia lo que se manda: sin `modalidad` no
   * cambia la modalidad y sin `enlace` no cambia el enlace ("" lo quita).
   */
  cambiarModalidad: async (id: number, cambios: { modalidad?: Modalidad; enlace?: string }): Promise<EstadoDelHorario> =>
    (await api.put(`/worker-schedule/${id}/modalidad`, cambios)).data,

  /** Secretaría o el Admin aprueban un horario (o le quitan la aprobación mientras esté libre). */
  aprobar: async (id: number, aprobado = true): Promise<EstadoDelHorario> =>
    (await api.put(`/worker-schedule/${id}/aprobacion`, { aprobado })).data,
};

export default workerScheduleAPI;
