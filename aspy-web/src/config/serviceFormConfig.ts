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
];
