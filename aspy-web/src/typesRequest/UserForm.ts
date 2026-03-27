// FINAL

export interface UserForm {
  // ── UserAccount ───────────────────────────────────
  email: string;
  password: string;
  password_confirmation: string; // requerido por Laravel `confirmed`
  role_id: number;

  // ── Person ────────────────────────────────────────
  first_name: string;
  last_name: string;
  birthdate: string;
  gender_id: number;
  occupation_id: number;
  marital_status_id: number;
  education_id: number;

  // ── Phone ─────────────────────────────────────────
  phone: {
    number: string;
    type: string;
  };

  // ── Address ───────────────────────────────────────
  address: {
    type: string;
    country_id: number;
    state_id: number;
    city_id: number;
    primary_address: string;
    secondary_address: string;
  };

  // ── Identification ────────────────────────────────
  identification: {
    type: string;
    number: string;
  };

  // ── Subtipo (solo para role professional) ─────────
  role?: "client" | "professional" | "staff"; // person_type string
  specialty?: string; // requerido si role === 'professional'
  title?: string;
}
