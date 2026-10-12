// FINAL
import type { Professional } from "@/typesResponse/Professional";
import type { Schedule } from "@/typesResponse/Schedule";
import type { Modalidad } from "@/typesResponse/WorkerSchedule";

export type WorkerProfessional = {
  worker_schedule_id: number;
  schedule_id: number;
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

  professional: Professional;
  schedule: Schedule;
};
