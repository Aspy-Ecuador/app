export const inputCreateUserConfig = [
  {
    label: "Nombre",
    key: "firstName",
    type: "text",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
    },
  },
  {
    label: "Apellido",
    key: "lastName",
    type: "text",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
    },
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
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
      required: {
        value: true,
        message: "Campo requerido",
      },
      pattern: {
        value: /^[0-9]{10}$/, // Expresión regular para exactamente 10 dígitos
        message: "Teléfono debe tener 10 dígitos",
      },
    },
  },
  {
    label: "Dirección",
    key: "address",
    type: "text",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
    },
  },
  {
    label: "Numero de Identificación",
    key: "identity",
    type: "number",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
      pattern: {
        value: /^[0-9]{10}$/, // Expresión regular para exactamente 10 dígitos
        message: "Cédula debe tener 10 dígitos",
      },
    },
  },
  {
    label: "Rol",
    key: "role",
    type: "select",
    validation: {
      required: {
        value: true,
        message: "Debe seleccionar un rol",
      },
    },
    options: ["Paciente", "Profesional", "Secretario", "Administrador"],
  },
  {
    label: "Contraseña",
    key: "password",
    type: "password",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
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
      required: {
        value: true,
        message: "Campo requerido",
      },
      minLength: {
        value: 6,
        message: "min 6 caracteres",
      },
    },
  },
];
