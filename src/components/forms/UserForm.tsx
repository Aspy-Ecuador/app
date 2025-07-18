import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserConfig } from "@/config/userFormConfig";
import { usuarios } from "@data/Usuarios";
import { User } from "@/types/User";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";

interface UserFormProps {
  isEditMode: boolean;
  userId?: number;
  role?: string;
  start: number;
  end: number;
  onNext: (data: Partial<User>) => void;
  onBack: () => void;
  onFinish: (data: Partial<User>) => void;
  isLast?: boolean;
}

export default function UserForm({
  isEditMode,
  userId,
  role,
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
}: UserFormProps) {
  const user = usuarios.find((u) => u.id === userId);
  const methods = useForm<User>();

  useEffect(() => {
    if (isEditMode && user) {
      methods.reset({
        identity: user.identity,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name || "",
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: "",
        confirmPassword: "",
        birthdate: user.birthdate || "",
        gender: user.gender || "",
        occupation: user.occupation || "",
        marital_status: user.marital_status || "",
        education: user.education || "",
        province: user.province || "",
        city: user.city || "",
      });
    } else {
      methods.reset({
        identity: 0,
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        birthdate: "",
        gender: "",
        occupation: "",
        marital_status: "",
        education: "",
        province: "",
        city: "",
      });
    }
  }, [isEditMode, user, methods, role]);

  const list_inputs = inputCreateUserConfig.slice(start, end).map((input) => (
    <UserInput
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
      dependsOn={input.dependsOn} // Agregar esta línea
      getOptions={input.getOptions} // Agregar esta línea
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
      return isEditMode ? "Guardar" : "Crear";
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
