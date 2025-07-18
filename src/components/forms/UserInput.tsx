import { useFormContext } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { findInputError } from "@utils/findInputError";
import { isFormInvalid } from "@utils/isFormInvalid";
import TextField from "@mui/material/TextField";
import InputError from "@forms/InputError";
import { useEffect, useState } from "react";

type Option = {
  label: string;
  value: number;
};

interface UserInputProps {
  label: string;
  type: string;
  id: string;
  validation: object;
  options?: Option[];
  dependsOn?: string;
  getOptions?: (selectedValue: number) => Option[];
}

export default function UserInput({
  label,
  type,
  id,
  validation,
  options = [],
  dependsOn,
  getOptions,
}: UserInputProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const [dynamicOptions, setDynamicOptions] = useState<Option[]>(options);

  // Observar el campo del cual depende
  const dependentValue = dependsOn ? watch(dependsOn) : null;

  useEffect(() => {
    if (dependsOn && getOptions && dependentValue) {
      // Obtener las nuevas opciones basadas en el valor del campo dependiente
      const newOptions = getOptions(Number(dependentValue));
      setDynamicOptions(newOptions);

      // Limpiar el valor actual del campo cuando cambie la dependencia
      setValue(id, "");
    } else if (dependsOn && !dependentValue) {
      // Si no hay valor seleccionado en el campo dependiente, limpiar opciones
      setDynamicOptions([]);
      setValue(id, "");
    } else if (!dependsOn) {
      // Si no depende de ningún campo, usar las opciones estáticas
      setDynamicOptions(options);
    }
  }, [dependentValue, dependsOn, getOptions, id, setValue, options]);

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
          disabled={dependsOn && dependentValue} // Deshabilitar si depende de otro campo que no tiene valor
        >
          <option value="">Seleccione una opción</option>
          {dynamicOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
