import { FieldErrors, FieldError } from "react-hook-form";

export function findInputError(errors: FieldErrors, name: string) {
  const error = errors[name] as FieldError | undefined;

  return {
    error: {
      message: error?.message || "",
    },
  };
}
