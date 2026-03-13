// FINAL
export type WorkerScheduleResponse = {
  worker_schedule_id: number;
  is_available: boolean;

  created_by: string;
  creation_date: string;
  modification_date: string | null;
  modified_by: string | null;

  appointment: {
    appointment_id: number;

    status: {
      status_id: number;
      name: string;
    };

    client: {
      person_id: number;
      first_name: string;
      last_name: string;
    };

    service: {
      service_id: number;
      name: string;
    };

    payment_status: {
      status_id: number;
      name: string;
    };
  } | null;

  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    birthdate: string;

    gender: string;
    marital_status: string;
    education: string;
    occupation: string;

    is_professional: boolean;
    is_staff: boolean;

    address: {
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

    phone: {
      phone_id: number;
      number: string;
      type: string;
    };

    identification: {
      identification_id: number;
      type: string;
      number: string;
      due_date: string;
    };

    professional_info: {
      title: string;
      specialty: string;
      about: string | null;
    } | null;

    user_account: {
      user_id: number;
      email: string;

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

  schedule: {
    schedule_id: number;
    name: string;
    date: string;
    start_time: string;
    end_time: string;

    created_by: string;
    creation_date: string;
  };
};
