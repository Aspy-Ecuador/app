// SÍ SE USA
import { RoleResponse } from "@/typesResponse/RoleResponse";

export type User = {
  user_id: number;
  person_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  role: RoleResponse;
  birthdate: string;
  education: number;
  email: string;
  gender: number;
  marital_status: number;
  occupation: number;
  title?: string;
  about?: string;
  specialty?: string;
  password: string;
};
