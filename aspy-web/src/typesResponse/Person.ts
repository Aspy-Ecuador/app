import { Professional } from "@/typesResponse/Professional";
import { Staff } from "@/typesResponse/Staff";
import { Client } from "@/typesResponse/Client";
import { Gender } from "@/typesResponse/Gender";
import { Occupation } from "@/typesResponse/Occupation";
import { MaritalStatus } from "@/typesResponse/MaritalStatus";
import { Phone } from "@/typesResponse/Phone";
import { Identification } from "@/typesResponse/Identification";
import { Address } from "@/typesResponse/Address";
import { UserAccount } from "@/typesResponse/UserAccount";
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
