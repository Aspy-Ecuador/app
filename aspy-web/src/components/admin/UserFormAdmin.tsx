import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { useRoleData } from "@/observer/RoleDataContext";
import { User } from "@/types/User";
import { getUsers } from "@utils/utils";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";
import Progress from "@components/Progress";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

interface UserFormProps {
  isEditMode: boolean;
  userId?: number;
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
  userId,
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
  const { data, loading } = useRoleData();
  const users: User[] = getUsers(data);

  useEffect(() => {
    if (isEditMode) {
      const user = users.find((u) => u.user_id === userId);
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
          role_id: user.role.role_id,
          title: user.title,
          about: user.about,
          specialty: user.specialty,
        });
      }
    } else {
      methods.reset({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        title: "",
        about: "",
        specialty: "",
      });
    }
  }, [isEditMode, userId]);

  const roleSelect = Number(methods.watch("role_id") ?? 0);

  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(roleSelect);
    }
  }, [roleSelect]);

  const filteredInputs = inputCreateUserAdminConfig.filter((input) => {
    const isExtraField = ["title", "about", "specialty"].includes(input.key);
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

  if (loading) return <Progress />;

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
            {load ? (
              <CircularProgress size={24} sx={{ color: "white" }} /> // Mostrar ciclo de carga
            ) : (
              getButtonLabel()
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
