// FINAL
export interface Schedule {
  schedule_id: number;

  date: string;
  start_time: string;
  end_time: string;
  name: string;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
