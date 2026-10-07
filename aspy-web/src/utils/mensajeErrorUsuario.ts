// Explica por qué no se pudo crear o guardar un usuario desde el panel, con lo que responde el servidor.
// (El registro público tiene su propia versión en RegisterView, con otro tono.)
const CAMPOS: Record<string, string> = {
  email: "Ese correo ya está registrado en otra cuenta (o no es un correo válido).",
  password: "La contraseña debe tener al menos 8 caracteres y coincidir con su confirmación.",
  "identification.number": "El número de identificación no es válido.",
  "phone.number": "El número de teléfono no es válido.",
  occupation_other: "Falta escribir cuál es la ocupación.",
  specialty: "Falta la especialidad del profesional.",
  birthdate: "La fecha de nacimiento no es válida.",
};

export function mensajeErrorUsuario(error: unknown): string {
  const res = (error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } })?.response;
  if (!res) return "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
  if (res.status === 403) return res.data?.message ?? "No tienes permiso para hacer este cambio.";
  if (res.status === 422) {
    const conocidos = Object.keys(res.data?.errors ?? {}).map((campo) => CAMPOS[campo]).filter(Boolean);
    if (conocidos.length) return conocidos.join(" ");
    return res.data?.errors ? "Hay datos que no son válidos. Revisa los pasos anteriores e inténtalo de nuevo." : res.data?.message ?? "No se pudo guardar.";
  }
  return "No se pudo guardar. Inténtalo de nuevo en unos minutos.";
}
