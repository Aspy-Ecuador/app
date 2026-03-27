import type { Professional } from "@/typesResponse/Professional";
import type { Staff } from "@/typesResponse/Staff";
import type { Client } from "@/typesResponse/Client";
import type { Gender } from "@/typesResponse/Gender";
import type { Occupation } from "@/typesResponse/Occupation";
import type { MaritalStatus } from "@/typesResponse/MaritalStatus";
import type { Phone } from "@/typesResponse/Phone";
import type { Identification } from "@/typesResponse/Identification";
import type { Address } from "@/typesResponse/Address";
import type { UserAccount } from "@/typesResponse/UserAccount";
// FINAL
export interface Person {
  person_id: number;
  user_id: number;

  user_account: UserAccount;

  gender_id: number;
  occupation_id: number;
  marital_status_id: number;
  education_id: number;

  first_name: string;
  last_name: string;

  birthdate: string;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  professional: Professional | null;
  client: Client | null;
  staff: Staff | null;

  gender: Gender | null;
  occupation: Occupation | null;
  marital_status: MaritalStatus | null;

  phone: Phone | null;
  identification: Identification | null;

  address: Address | null;
}
