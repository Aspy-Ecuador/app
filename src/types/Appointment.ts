import { User } from "./User";

export interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  professional: User;
  patient: User;
  assist: boolean;
  report?: string;
}
