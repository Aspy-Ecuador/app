// FINAL
export type PaymentResponse = {
  payment_id: number;
  created_by: string;
  creation_date: string;
  modification_date: string | null;
  modified_by: string | null;

  service_price: string;
  total_amount: string;

  client: {
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: {
      role_id: number;
      name: string;
    };
  };

  service: {
    service_id: number;
    name: string;
    price: string;
  };

  payment_status: {
    status_id: number;
    name: string;
  };

  payment_data: {
    payment_data_id: number;
    type: string;
    number: number;
    file: string;
  };

  receipt: {
    receipt_id: number;
    status: string;
  } | null;
};
