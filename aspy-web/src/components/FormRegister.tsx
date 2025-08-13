import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputRegisterUserConfig } from "@/config/userFormRegister";
import { User } from "@/types/User";
import Button from "@mui/material/Button";
import Input from "@components/Input";

interface FormRegisterProps {
  start: number;
  end: number;
  onNext: (data: User) => void;
  onBack: () => void;
  onFinish: (data: User) => void;
  isLast?: boolean;
}

export default function FormRegister({
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
}: FormRegisterProps) {
  const methods = useForm<User>();

  useEffect(() => {
    methods.reset({
      first_name: "",
      last_name: "",
      email: "",
      birthdate: "",
      title: "",
      about: "",
      specialty: "",
      role_id: 3,
    });
  }, [methods]);

  const list_inputs = inputRegisterUserConfig.slice(start, end).map((input) => (
    <Input
      key={input.key}
      label={input.label}
      type={input.type}
      id={input.key}
      validation={
        input.key === "confirmPassword"
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
    if (isLast) {
      return "Registrar";
    }
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
          {start != 0 && (
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
            {getButtonLabel()}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
