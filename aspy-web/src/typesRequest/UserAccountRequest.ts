// SÍ SE USA
export interface UserAccountRequest {
  role_id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: number;
  occupation: number;
  marital_status: number;
  education: number;
  person_type: string;
  title?: string;
  about?: string;
  specialty?: string;
}
