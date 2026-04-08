// FINAL
import type { Professional } from "@/typesResponse/Professional";
import type { Schedule } from "@/typesResponse/Schedule";

export type WorkerProfessional = {
  worker_schedule_id: number;
  schedule_id: number;
  is_available: boolean;
  created_by: number | null;
  modified_by: number | null;
  creation_date: string;
  modification_date: string;

  professional: Professional;
  schedule: Schedule;
};
