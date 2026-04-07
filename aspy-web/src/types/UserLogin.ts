import type { Role } from "@/typesResponse/Role";
import type { UserAccountStatus } from "@/typesResponse/UserAccountStatus";
import type { Person } from "@/typesResponse/Person";

// FINAL
export interface UserLogin {
  user_account_id: number;
  role_id: number;
  status_id: number;

  email: string;
  password_hash?: string;

  last_login: string | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  role: Role;
  status: UserAccountStatus;
  person: Person;
}
