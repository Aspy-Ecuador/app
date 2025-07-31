import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { UserAccount } from "@/types/UserAccount";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";

interface UserFormProps {
  isEditMode: boolean;
  userId?: number;
  start: number;
  end: number;
  onNext: (data: UserAccount) => void;
  onBack: () => void;
  onFinish: (data: UserAccount) => void;
  isLast?: boolean;
}

export default function UserFormAdmin({
  isEditMode,
  userId,
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
}: UserFormProps) {
  const methods = useForm<UserAccount>();

  useEffect(() => {
    if (isEditMode) {
      const getUsuariosFromLocalStorage = (): UserAccount[] => {
        const servicesData = localStorage.getItem("services");
        return servicesData ? (JSON.parse(servicesData) as UserAccount[]) : [];
      };

      const users = getUsuariosFromLocalStorage();
      const user = users.find((u) => u.role_id === userId);

      if (user) {
        methods.reset({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          birthdate: user.birthdate,
          gender: user.gender,
          occupation: user.occupation,
          marital_status: user.marital_status,
          education: user.education,
        });
      }
    } else {
      methods.reset({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        gender: -1,
        occupation: -1,
        marital_status: -1,
        education: -1,
      });
    }
  }, [isEditMode, userId]); // <- se ejecuta solo si cambia isEditMode o userId

  const list_inputs = inputCreateUserAdminConfig
    .slice(start, end)
    .map((input) => (
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
        //dependsOn={input.dependsOn}
        //getOptions={input.getOptions}
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
