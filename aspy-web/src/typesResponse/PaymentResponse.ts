//SÍ SE USA
export type PaymentResponse = {
  payment_id: number;
  payment_data_id: number;
  person_id: number;
  service_id: number;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;

  discount: string | null;
  service_price: string;
  total_amount: string;

  payment_data: PaymentData;
  person: Person;
  service: Service;
  status: Status;
};

export type PaymentData = {
  payment_data_id: number;
  type: string;
  number: number;
  file: string;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
};

export type Person = {
  person_id: number;
  user_id: number;
  first_name: string;
  last_name: string | null;
  birthdate: string;

  gender_id: number;
  education_id: number;
  marital_status_id: number;
  occupation_id: number;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
};

export type Service = {
  service_id: number;
  name: string;
  price: string;

  created_by: string;
  creation_date: string;
  modified_by: string | null;
  modification_date: string | null;
};

export type Status = {
  status_id: number;
  name: string;
};
