// FINAL
import { Role } from "@/typesResponse/Role";

export interface UserAccount {
  user_account_id: number;

  role_id: number;
  status_id: number;

  email: string;
  last_login: string | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  role: Role;
}
