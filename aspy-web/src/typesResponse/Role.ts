// FINAL
export interface Role {
  role_id: number;
  name: string;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;
}
