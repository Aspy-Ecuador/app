// FINAL
export type AppointmentResponse = {
  appointment_id: number;

  created_by: string;
  creation_date: string;
  modification_date: string | null;
  modified_by: string | null;

  status: {
    status_id: number;
    name: string;
  };

  appointment_report: {
    appointment_report_id: number;
    comments: string;
    sign: string;
  } | null;

  scheduled_by: {
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: {
      role_id: number;
      name: string;
    };
  };

  worker_schedule: {
    worker_schedule_id: number;
    is_available: boolean;

    person: {
      person_id: number;
      first_name: string;
      last_name: string;
    };

    schedule: {
      schedule_id: number;
      name: string;
      date: string;
      start_time: string;
      end_time: string;
    };
  };

  payment: {
    payment_id: number;

    service_price: string;
    total_amount: string;

    payment_status: {
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
      price: string;
    };

    payment_data: {
      payment_data_id: number;
      type: string;
      number: number;
      file: string;
    };
  };
};
