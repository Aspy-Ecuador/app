export interface User {
  id?: number;
  identity: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role?: string;
  photo?: string;
  aboutme?: string;
  age?: number;
  gender: string | number;
  email: string;
  phone: string;
  address: string;
  province: string | number;
  city: string | number;
  password: string;
  confirmPassword?: string;
  birthdate: string;
  occupation: string | number;
  marital_status: string | number;
  education: string | number;
  role_id?: number;
}
