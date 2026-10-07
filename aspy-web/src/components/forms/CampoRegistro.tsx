// Campo del formulario de registro: etiqueta arriba, ayuda debajo y errores en el mismo lugar.
// - La etiqueta va fuera del recuadro (el tema del sistema no usa etiquetas flotantes).
// - Listas con MUI Select (se ven igual en todos los navegadores y en modo oscuro).
// - Cédula/RUC y teléfono: solo aceptan números mientras se escribe.
// - Contraseñas: botón para mostrar u ocultar.
// - Fechas: calendario propio en español (CampoFecha).
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { identificacionSoloNumeros, largoIdentificacion } from "@/config/reglasContacto";
import { authFieldSx, authLabelSx } from "@components/auth/estilos";
import CampoFecha from "@forms/CampoFecha";

type Opcion = { label: string; value: number | string };

interface CampoRegistroProps {
  id: string;
  label: string;
  type: string;
  validation: object;
  options?: Opcion[];
  disabled?: boolean;
  ayuda?: string;
  placeholder?: string;
}

/** Lee un valor anidado ("address.state_id") del objeto de errores. */
function errorDe(errors: Record<string, unknown>, id: string): string | undefined {
  const e = id.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], errors);
  return (e as { message?: string } | undefined)?.message;
}

export default function CampoRegistro({ id, label, type, validation, options = [], disabled, ayuda, placeholder }: CampoRegistroProps) {
  const { control, formState: { errors }, watch } = useFormContext();
  const [ver, setVer] = useState(false);
  const error = errorDe(errors as Record<string, unknown>, id);
  const idEtiqueta = `${id}-etiqueta`;

  const tipoIdentificacion = watch("identification.type") as string | undefined;
  const esNumerico = id === "phone.number" || (id === "identification.number" && identificacionSoloNumeros(tipoIdentificacion));
  const largo = id === "phone.number" ? 10 : id === "identification.number" ? largoIdentificacion(tipoIdentificacion) : undefined;

  const comun = {
    id,
    fullWidth: true,
    disabled,
    error: !!error,
    helperText: error ?? ayuda ?? " ",
    placeholder,
    sx: authFieldSx,
  };

  return (
    <Box>
      <Box component="label" id={idEtiqueta} htmlFor={type === "select" ? undefined : id} sx={authLabelSx}>
        {label}
      </Box>
      <Controller
        name={id}
        control={control}
        rules={validation}
        render={({ field }) => {
          if (type === "select") {
            return (
              <TextField
                {...comun}
                {...field}
                select
                value={field.value ?? ""}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    labelId: idEtiqueta,
                    MenuProps: {
                      anchorOrigin: { vertical: "bottom", horizontal: "left" },
                      transformOrigin: { vertical: "top", horizontal: "left" },
                      slotProps: { paper: { sx: { maxHeight: 320 } } },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ opacity: 0.6, fontStyle: "normal" }}>Elige una opción</em>
                </MenuItem>
                {options.map((o) => (
                  <MenuItem key={String(o.value)} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }
          if (type === "date") {
            return (
              <CampoFecha
                id={id}
                name={field.name}
                titulo={label}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={!!error}
                helperText={error ?? ayuda ?? " "}
                disabled={disabled}
              />
            );
          }
          return (
            <TextField
              {...comun}
              {...field}
              value={field.value ?? ""}
              type={type === "password" && ver ? "text" : type}
              onChange={(e) => {
                let v = e.target.value;
                if (esNumerico) v = v.replace(/\D/g, ""); // solo números
                if (largo) v = v.slice(0, largo);
                field.onChange(v);
              }}
              slotProps={{
                htmlInput: {
                  ...(esNumerico ? { inputMode: "numeric", pattern: "[0-9]*" } : {}),
                  ...(largo ? { maxLength: largo } : {}),
                  ...(type === "email" ? { autoComplete: "email" } : {}),
                  ...(type === "password" ? { autoComplete: "new-password" } : {}),
                },
                input:
                  type === "password"
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
                              onClick={() => setVer((x) => !x)}
                              edge="end"
                              size="small"
                              sx={{ border: 0, bgcolor: "transparent", width: 32, height: 32 }}
                            >
                              {ver ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined,
              }}
            />
          );
        }}
      />
    </Box>
  );
}
