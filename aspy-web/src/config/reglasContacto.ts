// Reglas de identificación, teléfono y ocupación "Otra". Son las mismas que valida el backend
// (UserAccountController::reglasContacto), para que el error se vea antes de enviar.

/** id de la ocupación "Otra": la persona escribe la suya en occupation_other. */
export const OCUPACION_OTRA = 10;

type Valores = { identification?: { type?: string } };

/** Largo máximo del número según el tipo de identificación. */
export const largoIdentificacion = (tipo?: string) => (tipo === "ruc" ? 13 : tipo === "pasaporte" ? 20 : 10);

/** Cédula y RUC solo llevan números; el pasaporte admite letras. */
export const identificacionSoloNumeros = (tipo?: string) => tipo !== "pasaporte";

export const reglaIdentificacion = {
  required: { value: true, message: "Campo requerido" },
  validate: (valor: string, valores: Valores) => {
    const tipo = valores?.identification?.type;
    const v = String(valor ?? "").trim();
    if (tipo === "ruc") return /^\d{13}$/.test(v) || "El RUC debe tener 13 números";
    if (tipo === "pasaporte") return /^[A-Za-z0-9]{5,20}$/.test(v) || "Solo letras y números (5 a 20)";
    return /^\d{10}$/.test(v) || "La cédula debe tener 10 números";
  },
};

export const reglaTelefono = {
  required: { value: true, message: "Campo requerido" },
  pattern: {
    value: /^0\d{8,9}$/,
    message: "Celular: 10 números (09…). Fijo: 9 números (04…)",
  },
};

export const reglaOcupacionOtra = {
  required: { value: true, message: "Escribe tu ocupación" },
  maxLength: { value: 80, message: "Máximo 80 caracteres" },
};
