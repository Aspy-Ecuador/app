export const inputServiceConfig = [
  {
    label: "Nombre del servicio",
    key: "name",
    type: "text",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
    },
  },
  /*
  {
    label: "Descripción",
    key: "description",
    type: "text",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
    },
  },
  */
  {
    label: "Precio",
    key: "price",
    type: "number",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
      min: {
        value: 0,
        message: "El precio debe ser mayor o igual a 0",
      },
    },
  },
  /*
  {
    label: "Duración (minutos)",
    key: "durationMinutes",
    type: "number",
    validation: {
      required: {
        value: true,
        message: "Campo requerido",
      },
      min: {
        value: 10,
        message: "El tiempo debe ser mínimo 10 min",
      },
    },
  },
  {
    label: "Activo",
    key: "active",
    type: "select",
    validation: {
      required: {
        value: true,
        message: "Debe seleccionar una opción",
      },
    },
    options: [
      { label: "Sí", value: 1 },
      { label: "No", value: 2 },
    ],
  },
  {
    label: "Tipo",
    key: "serviceType",
    type: "select",
    validation: {
      required: {
        value: true,
        message: "Debe seleccionar una opción",
      },
    },

    options: [
      { label: "Consulta Médica", value: 1 },
      { label: "Terapia Psicológica", value: 2 },
      { label: "Terapia de Lenguaje", value: 2 },
    ],
  },
  */
];
