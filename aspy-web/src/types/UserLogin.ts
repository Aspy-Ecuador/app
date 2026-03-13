import { RoleResponse } from "@/typesResponse/RoleResponse";

// SÍ SE USA
export interface UserLogin {
  user_id: number;
  person_id: number;
  role: RoleResponse;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  birthdate: string;
  gender: number;
  occupation: number;
  marital_status: number;
  education: number;
}
