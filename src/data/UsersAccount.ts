import { UserAccount } from "@/types/UserAccount";

export const users: UserAccount[] = [
  {
    role_id: 4,
    email: "staff1@aspy.com",
    password: "staff1",
    first_name: "Luisa",
    last_name: "Castro",
    birthdate: "1982-07-20",
    gender: 2,
    occupation: 4,
    marital_status: 1,
    education: 2,
    person_type: "staff",
  },
  {
    role_id: 4,
    email: "staff2@aspy.com",
    password: "staff2",
    first_name: "Andrés",
    last_name: "Mendoza",
    birthdate: "1985-03-15",
    gender: 1,
    occupation: 3,
    marital_status: 2,
    education: 3,
    person_type: "staff",
  },
  // Puedes agregar más usuarios aquí
];
