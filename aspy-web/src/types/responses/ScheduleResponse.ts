// FINAL
export type ScheduleResponse = {
  schedule_id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;

  created_by: string;
  creation_date: string;
  modification_date: string | null;
  modified_by: string | null;
};
