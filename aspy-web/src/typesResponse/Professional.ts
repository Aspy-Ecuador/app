// FINAL
export interface Professional {
  person_id: number;

  specialty: string;
  title: string;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
