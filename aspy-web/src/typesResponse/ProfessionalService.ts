// FINAL
import type { Professional } from "@/typesResponse/Professional";
import type { Service } from "@/typesResponse/Service";

export type ProfessionalService = {
  professional_service_id: number;
  service_id: number;
  created_by: number | null;
  modified_by: number | null;
  creation_date: string;
  modification_date: string;

  professional: Professional;
  service: Service;
};
