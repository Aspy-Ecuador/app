export interface User {
  id: number;
  identity?: number;
  firstName: string;
  lastName: string;
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
