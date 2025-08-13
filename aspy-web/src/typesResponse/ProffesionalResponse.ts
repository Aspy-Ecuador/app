import { User } from "@/types/User";

export interface ProfessionalResponse {
  person_id: number;
  specialty: string;
  title: string;
  about: string;
  created_by: string;
  modified_by: string;
  creation_date: string; // "YYYY-MM-DD HH:MM:SS"
  modification_date: string;
  person: User;
}
