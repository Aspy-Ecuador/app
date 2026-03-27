// FINAL
export const inputCreateUserAdminConfig = [
  // ── STEP 1: Datos personales (índices 0–4) ────────────────────────────────
  {
    label: "Nombre",
    key: "first_name",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Apellido",
    key: "last_name",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Fecha de nacimiento",
    key: "birthdate",
    type: "date",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    validation: {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email no válido",
      },
    },
  },
  {
    label: "Rol",
    key: "role_id",
    type: "select",
    options: [
      { label: "Profesional", value: 2 },
      { label: "Cliente", value: 3 },
      { label: "Secretario", value: 4 },
    ],
    validation: {
      required: { value: true, message: "Debe seleccionar un rol" },
    },
  },

  // ── STEP 2: Datos generales (índices 5–10) ────────────────────────────────
  {
    label: "Género",
    key: "gender_id",
    type: "select",
    options: [
      { label: "Masculino", value: 1 },
      { label: "Femenino", value: 2 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Ocupación",
    key: "occupation_id",
    type: "select",
    options: [
      { label: "Doctor", value: 1 },
      { label: "Enfermero", value: 2 },
      { label: "Ingeniero", value: 3 },
      { label: "Estudiante", value: 4 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Estado civil",
    key: "marital_status_id",
    type: "select",
    options: [
      { label: "Soltero", value: 1 },
      { label: "Casado", value: 2 },
      { label: "Divorciado", value: 3 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Nivel educativo",
    key: "education_id",
    type: "select",
    options: [
      { label: "Secundaria", value: 1 },
      { label: "Pregrado", value: 2 },
      { label: "Postgrado", value: 3 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Número de teléfono",
    key: "phone.number",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Tipo de teléfono",
    key: "phone.type",
    type: "select",
    options: [
      { label: "Móvil", value: "mobile" },
      { label: "Casa", value: "home" },
      { label: "Trabajo", value: "work" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },

  // ── STEP 2 (solo professional): título, descripción, especialidad (11–13) ─
  {
    label: "Título",
    key: "title",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Descripción",
    key: "about",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Especialidad",
    key: "specialty",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },

  // ── STEP 3: Seguridad ─────────────────────────────────────────────────────
  {
    label: "Contraseña",
    key: "password",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: { value: 8, message: "Mínimo 8 caracteres" },
    },
  },
  {
    label: "Confirmar Contraseña",
    key: "password_confirmation",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: { value: 8, message: "Mínimo 8 caracteres" },
    },
  },

  // ── STEP 3: Identificación ────────────────────────────────────────────────
  {
    label: "Tipo de identificación",
    key: "identification.type",
    type: "select",
    options: [
      { label: "Cédula", value: "cedula" },
      { label: "Pasaporte", value: "passport" },
      { label: "RUC", value: "ruc" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Número de identificación",
    key: "identification.number",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },

  // ── STEP 3: Dirección (todos los campos requeridos por el store) ──────────
  {
    label: "Tipo de dirección",
    key: "address.type",
    type: "select",
    options: [
      { label: "Casa", value: "home" },
      { label: "Trabajo", value: "work" },
      { label: "Otro", value: "other" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "País",
    key: "address.country_id",
    type: "select",
    options: [{ label: "Ecuador", value: 1 }],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Provincia",
    key: "address.state_id",
    type: "select",
    options: [
      { label: "Guayas", value: 1 },
      { label: "Pichincha", value: 2 },
      { label: "Azuay", value: 3 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Ciudad",
    key: "address.city_id",
    type: "select",
    options: [
      { label: "Guayaquil", value: 1 },
      { label: "Quito", value: 2 },
      { label: "Cuenca", value: 3 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Dirección principal",
    key: "address.primary_address",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Dirección secundaria",
    key: "address.secondary_address",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
];
