// FINAL
// Campo de los formularios del panel (usuarios y servicios): etiqueta arriba y error debajo.
// Los valores se registran igual que antes (`register`), así que lo que se envía no cambia.
import { Controller, useFormContext } from "react-hook-form";
import { findInputError } from "@utils/findInputError";
import { isFormInvalid } from "@utils/isFormInvalid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import Campo from "@forms/Campo";
import CampoFecha from "@forms/CampoFecha";
import { campoSx, selectNativoSx } from "@forms/estilos";

type Option = {
  label: string;
  value: number | string;
};

interface UserInputProps {
  label: string;
  type: string;
  id: string;
  validation: object;
  options?: Option[];
  dependsOn?: string;
  getOptions?: (selectedValue: number) => Option[];
  disabled?: boolean;
}

export default function UserInput({
  label,
  type,
  id,
  validation,
  options = [],
  dependsOn,
  getOptions,
  disabled = false, // ← NUEVO
}: UserInputProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const [dynamicOptions, setDynamicOptions] = useState<Option[]>(options);
  const [verContrasena, setVerContrasena] = useState(false);

  const dependentValue = dependsOn ? watch(dependsOn) : null;

  const currentOptions = getOptions ? dynamicOptions : options;

  useEffect(() => {
    if (!dependsOn || !getOptions) return;

    const subscription = watch((value, { name, type }) => {
      if (name === dependsOn && type === "change") {
        const newValue = value[dependsOn];
        if (newValue) {
          const newOptions = getOptions(Number(newValue));
          setDynamicOptions(newOptions);
          setValue(id, "");
        } else {
          setDynamicOptions([]);
          setValue(id, "");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [dependsOn, getOptions, id, setValue, watch]);

  const inputError = findInputError(errors, id);
  const isInvalid = isFormInvalid(inputError);
  const mensajeError = isInvalid ? String(inputError.error.message ?? "Revisa este campo") : undefined;

  // Si disabled viene explícito desde el padre, toma precedencia.
  // Si no, mantiene la lógica original: deshabilitar cuando depende de otro campo vacío.
  const isDisabled = disabled || (dependsOn ? !dependentValue : false); // ← MODIFICADO

  return (
    <Campo etiqueta={label} htmlFor={id} error={mensajeError}>
      {type === "select" ? (
        <Box
          component="select"
          id={id}
          {...register(id, validation)}
          disabled={isDisabled} // ← MODIFICADO
          aria-invalid={isInvalid}
          sx={selectNativoSx}
        >
          <option value="">Seleccione una opción</option>
          {currentOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Box>
      ) : id === "birthdate" ? (
        // Fecha de nacimiento: mismo calendario que el registro (guarda AAAA-MM-DD, como antes)
        <Controller
          name={id}
          control={control}
          rules={validation}
          render={({ field }) => (
            <CampoFecha
              id={id}
              name={field.name}
              titulo={label}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={isInvalid}
              helperText=""
              disabled={isDisabled}
              fieldSx={campoSx}
            />
          )}
        />
      ) : (
        <TextField
          id={id}
          type={type === "password" && verContrasena ? "text" : type}
          variant="outlined"
          fullWidth
          disabled={isDisabled} // ← NUEVO: también aplica a TextField
          error={isInvalid}
          sx={campoSx}
          slotProps={{
            htmlInput: type === "password" ? { autoComplete: "new-password" } : undefined,
            input:
              type === "password"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                          onClick={() => setVerContrasena((v) => !v)}
                          edge="end"
                          size="small"
                          sx={{ border: 0, bgcolor: "transparent", width: 32, height: 32 }}
                        >
                          {verContrasena ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : undefined,
          }}
          {...register(id, validation)}
        />
      )}
    </Campo>
  );
}
