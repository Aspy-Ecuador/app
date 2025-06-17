export interface User {
  id: number;
  identity?: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: string;
  photo?: string;
  aboutme?: string;
  age: number;
  gender: string;
  email: string;
  phone?: string;
  address?: string;
  province?: string;
  password?: string;
}
