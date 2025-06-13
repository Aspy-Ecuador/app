import { useFormContext } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { findInputError } from "@utils/findInputError";
import { isFormInvalid } from "@utils/isFormInvalid";
import TextField from "@mui/material/TextField";
import InputError from "@forms/InputError";

interface UserInputProps {
  label: string;
  type: string;
  id: string;
  validation: object;
  options?: string[];
  role?: string;
}

export default function UserInput({
  label,
  type,
  id,
  validation,
  options,
  role,
}: UserInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, id);
  const isInvalid = isFormInvalid(inputError);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2 w-full">
        <h6 className="grow">{label}</h6>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={inputError.error.message}
              key={inputError.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      {type === "select" ? (
        <select
          id={id}
          {...register(id, validation)}
          className="border border-gray-300 rounded-md p-2 w-full"
          disabled={!!role}
        >
          <option value="">Seleccione una opción</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <TextField
          required
          id={id}
          type={type}
          variant="outlined"
          size="small"
          className="w-full md:w-[300px]"
          sx={{
            "& input::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
          {...register(id, validation)}
        />
      )}
    </div>
  );
}
