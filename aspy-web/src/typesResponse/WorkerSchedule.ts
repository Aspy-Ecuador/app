// FINAL
import { Schedule } from "@/typesResponse/Schedule";

export interface WorkerSchedule {
  worker_schedule_id: number;

  schedule_id: number;
  professional_id: number;

  is_available: boolean;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  schedule: Schedule;
}
