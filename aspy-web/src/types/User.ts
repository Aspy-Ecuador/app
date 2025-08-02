// SÍ SE USA
import { RoleResponse } from "@/typesResponse/RoleResponse";

export type User = {
  user_id: number;
  person_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  role: RoleResponse;
  birthdate: string;
  education: string;
  email: string;
  gender: string;
  marital_status: string;
  occupation: string;
};
