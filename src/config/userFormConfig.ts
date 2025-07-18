import { provincias, ciudadesPorProvincia } from "./provincias-ciudad";
type ProvinceValue = number;

export const inputCreateUserConfig = [
  {
    label: "Nombre",
    key: "first_name",
    type: "text",
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Apellido",
    key: "last_name",
    type: "text",
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Fecha de nacimiento",
    key: "birthdate",
    type: "date",
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
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
    label: "Teléfono",
    key: "phone",
    type: "text",
    validation: {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Teléfono debe tener 10 dígitos",
      },
    },
  },
  {
    label: "Dirección",
    key: "address",
    type: "text",
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Numero de Identificación",
    key: "identity",
    type: "number",
    validation: {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Cédula debe tener 10 dígitos",
      },
    },
  },
  {
    label: "Género",
    key: "gender",
    type: "select",
    options: [
      { label: "Masculino", value: 1 },
      { label: "Femenino", value: 2 },
      { label: "Otro", value: 3 },
    ],
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Ocupación",
    key: "occupation",
    type: "select",
    options: [
      { label: "Empleado", value: 1 },
      { label: "Estudiante", value: 2 },
      { label: "Desempleado", value: 3 },
      { label: "Otro", value: 4 },
    ],
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Estado civil",
    key: "marital_status",
    type: "select",
    options: [
      { label: "Soltero", value: 1 },
      { label: "Casado", value: 2 },
      { label: "Divorciado", value: 3 },
      { label: "Viudo", value: 4 },
    ],
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  {
    label: "Nivel educativo",
    key: "education",
    type: "select",
    options: [
      { label: "Primaria", value: 1 },
      { label: "Secundaria", value: 2 },
      { label: "Universitaria", value: 3 },
      { label: "Postgrado", value: 4 },
    ],
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  /*
  {
    label: "Rol",
    key: "role",
    type: "select",
    validation: {
      required: { value: true, message: "Debe seleccionar un rol" },
    },
    options: [
      { label: "Paciente", value: 1 },
      { label: "Profesional", value: 2 },
      { label: "Secretario", value: 3 },
      { label: "Administrador", value: 4 },
    ],
  },
  */
  {
    label: "Contraseña",
    key: "password",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: {
        value: 6,
        message: "min 6 caracteres",
      },
    },
  },
  {
    label: "Confirmar Contraseña",
    key: "confirmPassword",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: {
        value: 6,
        message: "min 6 caracteres",
      },
    },
  },
  /*
  {
    label: "Provincia",
    key: "province",
    type: "select",
    options: provincias,
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  */
  /*
  {
    label: "Ciudad",
    key: "city",
    type: "select",
    options: [],
    dependsOn: "province",
    getOptions: (selectedProvince: ProvinceValue) => {
      return selectedProvince
        ? ciudadesPorProvincia[selectedProvince] || []
        : [];
    },
    validation: {
      required: { value: true, message: "Campo requerido" },
    },
  },
  */
];
