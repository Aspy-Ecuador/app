// SÍ SE USA
export type PersonResponse = {
  person_id: number;
  user_id: number;
  first_name: string;
  middle_name: string;
  birthdate: string; // formato ISO: "YYYY-MM-DD"
  gender: string;
  occupation: string;
  marital_status: string;
  education: string;
  created_by: string;
  modified_by: string | null;
  creation_date: string; // formato de fecha y hora
  modification_date: string | null;
};
