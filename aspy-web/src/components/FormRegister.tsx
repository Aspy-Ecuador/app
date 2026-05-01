import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputRegisterUserConfig } from "@/config/userFormRegister";
import type { UserForm } from "@/typesRequest/UserForm";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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

  const list_inputs = inputRegisterUserConfig.slice(start, end).map((input) => (
    <UserInput
      key={input.key}
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
      options={input.options}
    />
  ));

  const onSubmit = methods.handleSubmit((data) => {
    if (isLast) {
      onFinish(data);
    } else {
      onNext(data);
    }
  });

  const getButtonLabel = () => {
    if (isLast) return "Registrar";
    return "Siguiente";
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        noValidate
        className="flex flex-col w-full h-full p-6"
      >
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {list_inputs}
          </div>
        </div>
        <div className="gap-10 mt-4 flex flex-row items-center justify-center">
          {start !== 0 && (
            <Button
              variant="outlined"
              onClick={onBack}
              className="md:w-[250px]"
            >
              Anterior
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            className="md:w-[250px]"
          >
            {load ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              getButtonLabel()
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
