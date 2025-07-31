export interface UserAccountGetRequest {
  user_id: number;
  role_id: number;
  email: string;
  status: number;
  last_login: string;
  created_by: string;
  creation_date: string;
  modification_date: string;
  modified_by: string;
}
