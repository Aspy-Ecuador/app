// FINAL
import type { Schedule } from "@/typesResponse/Schedule";

export type Modalidad = "presencial" | "virtual";

export interface WorkerSchedule {
  worker_schedule_id: number;

  schedule_id: number;
  professional_id: number;

  is_available: boolean;

  /** "presencial" o "virtual": la elige quien crea el horario. */
  modalidad?: Modalidad;
  /** false = lo creó un profesional y Secretaría (o el Admin) todavía no lo aprobó: no se ofrece a las familias. */
  aprobado?: boolean;
  /** Enlace de la reunión de un horario virtual. Solo lo reciben Secretaría, el Admin y su profesional. */
  enlace_virtual?: string | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  schedule: Schedule;
}
