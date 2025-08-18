import { UserLogin } from "@/types/UserLogin";
import { LoginResponse } from "@/typesResponse/LoginResponse";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { toNumber } from "@/utils/utils";

export function loginAdapter(
  person: PersonResponse,
  role: RoleResponse,
  userLogin: LoginResponse
): UserLogin {
  return {
    user_id: userLogin.user_id,
    person_id: person.person_id,
    role: {
      role_id: role.role_id,
      name: role.name,
    },
    first_name: person.first_name,
    last_name: person.last_name,
    full_name: person.first_name + " " + person.last_name,
    birthdate: person.birthdate,
    education: toNumber(person.education),
    email: userLogin.email,
    gender: toNumber(person.gender),
    marital_status: toNumber(person.marital_status),
    occupation: toNumber(person.occupation),
  };
}
