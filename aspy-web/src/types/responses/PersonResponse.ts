// FINAL
export type PersonResponse = {
  person_id: number;

  first_name: string;
  last_name: string;
  birthdate: string;

  gender: string;
  marital_status: string;
  education: string;
  occupation: string;

  is_client: boolean;
  is_professional: boolean;
  is_staff: boolean;

  email: string;

  created_by: string;
  creation_date: string;
  modification_date: string | null;
  modified_by: string | null;

  addresses: {
    address_id: number;
    type: string;
    primary_address: string;
    secondary_address: string | null;

    city: {
      city_id: number;
      name: string;
    };

    state: {
      state_id: number;
      name: string;
    };

    country: {
      country_id: number;
      name: string;
      phone_code: string;
    };
  };

  phones: {
    phone_id: number;
    number: string;
    type: string;
  };

  identifications: {
    identification_id: number;
    type: string;
    number: string;
    due_date: string;
  };

  professional_info: {
    title: string;
    specialty: string;
  } | null;

  user_account: {
    user_id: number;

    role: {
      role_id: number;
      name: string;
    };

    status: {
      status_id: number;
      name: string;
    };
  };
};
