// FINAL
export type AppointmentReportResponse = {
  appointment_report_id: number;
  comments: string;
  sign: string;

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

    scheduled_by: {
      person_id: number;
      first_name: string;
      last_name: string;
    };

    worker_schedule: {
      worker_schedule_id: number;

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
      };
    };
  };
};
