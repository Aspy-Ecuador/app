// FINAL
export type LoginResponse = {
  user_id: number;
  email: string;
  last_login: string;

  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    birthdate: string;
    gender: string;
    marital_status: string;
    education: string;
    occupation: string;
  };

  role: {
    role_id: number;
    name: string;
  };

  status: {
    status_id: number;
    name: string;
  };
};
