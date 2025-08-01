// SÍ SE USA
export type ProfessionalServiceResponse = {
  professional_service_id: number;
  person_id: number;
  service_id: number;
  created_by: string;
  modified_by: string | null;
  creation_date: string; // formato: "YYYY-MM-DD HH:mm:ss"
  modification_date: string | null;
};
