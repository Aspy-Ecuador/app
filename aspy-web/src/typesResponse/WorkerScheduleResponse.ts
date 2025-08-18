// SÍ SE USA
export type WorkerScheduleResponse = {
  worker_schedule_id: number;
  schedule_id: number;
  person_id: number;
  is_available: boolean;
  created_by: string;
  modified_by: string | null;
  creation_date: string; // formato ISO: "2025-07-29 19:07:00"
  modification_date: string | null;
  schedule: {
    schedule_id: number;
    date: string; // formato: "YYYY-MM-DD"
    start_time: string; // formato: "HH:mm:ss"
    end_time: string;
    name: string;
    created_by: string;
    modified_by: string | null;
    creation_date: string;
    modification_date: string | null;
  };
  person: {
    person_id: number;
    user_id: number;
    first_name: string;
    last_name: string | null;
    birthdate: string; // formato: "YYYY-MM-DD"
    gender: string;
    occupation: string;
    marital_status: string;
    education: string;
    created_by: string;
    modified_by: string | null;
    creation_date: string;
    modification_date: string | null;
  };
};
