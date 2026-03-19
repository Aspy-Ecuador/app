// FINAL
import { City } from "@/typesResponse/City";

export interface Address {
  address_id: number;
  person_id: number;

  type: string;

  country_id: number;
  state_id: number;
  city_id: number;

  primary_address: string;
  secondary_address: string | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  city: City;
}
