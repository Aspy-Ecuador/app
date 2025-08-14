// SÍ SE USA
import { User } from "./User";
import { Service } from "@/types/Service";
import { StatusResponse } from "@/typesResponse/StatusResponse";

export type Appointment = {
  id_appointment: number;
  service: Service;
  client: User;
  proffesional: User;
  status: StatusResponse;
  date: string;
  startTime: string;
  endTime: string;
};
