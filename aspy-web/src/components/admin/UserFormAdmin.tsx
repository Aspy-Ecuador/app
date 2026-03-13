import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { User } from "@/types/User";
import { PersonResponse } from "@/types/responses/PersonResponse";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

interface UserFormProps {
  isEditMode: boolean;
  user?: PersonResponse | null;
  start: number;
  end: number;
  onNext: (data: User) => void;
  onBack: () => void;
  onFinish: (data: User) => void;
  isLast?: boolean;
  onRoleChange?: (roleId: number) => void;
  load?: boolean;
}

export default function UserFormAdmin({
  isEditMode,
  user,
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
  onRoleChange,
  load,
}: UserFormProps) {
  const methods = useForm<User>();

  useEffect(() => {
    if (isEditMode && user) {
      methods.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        birthdate: user.birthdate || "",
        gender: user.gender || "",
        occupation: user.occupation || "",
        marital_status: user.marital_status || "",
        education: user.education || "",
        role_id: user.user_account?.role?.role_id,
        title: user.professional_info?.title || "",
        specialty: user.professional_info?.specialty || "",
      });
    } else if (!isEditMode) {
      methods.reset({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        gender: "0",
        occupation: "0",
        marital_status: "0",
        education: "0",
        role_id: 0,
        title: "",
        specialty: "",
        password: "",
      });
    }
  }, [isEditMode, user, methods]);

  const roleSelect = Number(methods.watch("role_id") ?? 0);

  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(roleSelect);
    }
  }, [roleSelect, onRoleChange]);

  const filteredInputs = inputCreateUserAdminConfig.filter((input) => {
    const isExtraField = ["title", "specialty"].includes(input.key);
    return !(isExtraField && roleSelect !== 2);
  });

  const list_inputs = filteredInputs.slice(start, end).map((input) => (
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
            disabled={load}
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
