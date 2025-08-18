import { User } from "@/types/User";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import { toNumber } from "@/utils/utils";

export function userAdapter(
  person: PersonResponse,
  role: RoleResponse,
  userAccount: UserAccountResponse
): User {
  return {
    user_id: userAccount.user_id,
    person_id: person.person_id,
    role_id: role.role_id,
    first_name: person.first_name,
    last_name: person.last_name,
    full_name: person.first_name + " " + person.last_name,
    role: {
      role_id: role.role_id,
      name: role.name,
    },
    birthdate: person.birthdate,
    education: toNumber(person.education),
    email: userAccount.email,
    gender: toNumber(person.gender),
    marital_status: toNumber(person.marital_status),
    occupation: toNumber(person.occupation), // Aunque el campo del tipo User es "ocupation", deberías corregirlo a "occupation"
    password: "",
  };
}
