// FINAL
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { inputRegisterUserConfig } from "@/config/userFormRegister";
import type { UserForm } from "@/typesRequest/UserForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import UserInput from "@forms/UserInput";

interface FormRegisterProps {
  start: number;
  end: number;
  onNext: (data: UserForm) => void;
  onBack: () => void;
  onFinish: (data: UserForm) => void;
  isLast?: boolean;
  load?: boolean;
}

export default function FormRegister({
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
  load,
}: FormRegisterProps) {
  const methods = useForm<UserForm>();

  useEffect(() => {
    methods.reset({
      first_name: "",
      last_name: "",
      email: "",
      birthdate: "",
      password: "",
      password_confirmation: "",
      role_id: 3,
      phone: { number: "", type: "" },
      identification: { type: "", number: "" },
      address: {
        type: "",
        country_id: 0,
        state_id: 0,
        city_id: 0,
        primary_address: "",
        secondary_address: "",
      },
    });
  }, [methods]);

  // ← NUEVO: observa la provincia seleccionada
  const selectedStateId = Number(
    useWatch({ control: methods.control, name: "address.state_id" }) ?? 0,
  );

  // ← NUEVO: resetea la ciudad cuando cambia la provincia
  useEffect(() => {
    if (selectedStateId) {
      methods.setValue("address.city_id", 0);
    }
  }, [selectedStateId]);

  // ← MODIFICADO: filtra ciudades según la provincia seleccionada
  const list_inputs = inputRegisterUserConfig.slice(start, end).map((input) => {
    const resolvedOptions = input.dependsOn
      ? input.options?.filter((opt) => opt.state_id === selectedStateId)
      : input.options;

    return (
      <Box key={input.key} sx={{ minWidth: 0, width: "100%" }}>
        <UserInput
          label={input.label}
          type={input.type}
          id={input.key}
          validation={
            input.key === "password_confirmation"
              ? {
                  ...input.validation,
                  validate: (value: string) =>
                    value === methods.getValues("password") ||
                    "Las contraseñas no coinciden",
                }
              : input.validation
          }
          options={resolvedOptions}
        />
      </Box>
    );
  });

  const onSubmit = methods.handleSubmit((data) => {
    if (isLast) {
      onFinish(data);
    } else {
      onNext(data);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
            mb: 3,
            width: "100%",
            boxSizing: "border-box",
            "& > *": { minWidth: 0 },
          }}
        >
          {list_inputs}
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: start !== 0 ? "space-between" : "flex-end",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {start !== 0 && (
            <Button
              variant="text"
              onClick={onBack}
              startIcon={<ChevronLeftRoundedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Anterior
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            disabled={!!load}
            startIcon={
              !load && isLast ? (
                <CheckRoundedIcon fontSize="small" />
              ) : undefined
            }
            endIcon={
              !load && !isLast ? (
                <ChevronRightRoundedIcon fontSize="small" />
              ) : undefined
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              px: 4,
              py: 1.1,
              borderRadius: 2.5,
              fontSize: "0.92rem",
              minWidth: 140,
              background: isLast
                ? "linear-gradient(135deg, #0F6E56 0%, #1B8C6E 100%)"
                : "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
              boxShadow: isLast
                ? "0 4px 14px rgba(15,110,86,0.35)"
                : "0 4px 14px rgba(25,118,210,0.35)",
              "&:hover": {
                boxShadow: isLast
                  ? "0 6px 20px rgba(15,110,86,0.45)"
                  : "0 6px 20px rgba(25,118,210,0.45)",
              },
              "&:disabled": {
                background: "rgba(0,0,0,0.12)",
                boxShadow: "none",
              },
            }}
          >
            {load ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : isLast ? (
              "Registrarse"
            ) : (
              "Siguiente"
            )}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
}