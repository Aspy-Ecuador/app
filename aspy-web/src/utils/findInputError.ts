// FINAL
import { get } from "react-hook-form";
import type { FieldErrors, FieldError } from "react-hook-form";

// `get` entiende nombres anidados ("address.city_id", "phone.number"). Con `errors[name]` esos
// campos nunca mostraban su error y el formulario parecía no responder al pulsar "Siguiente".
export function findInputError(errors: FieldErrors, name: string) {
  const error = get(errors, name) as FieldError | undefined;

  return {
    error: {
      message: error?.message || "",
    },
  };
}
