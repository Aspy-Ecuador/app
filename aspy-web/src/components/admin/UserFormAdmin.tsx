import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { useRoleData } from "@/observer/RoleDataContext";
import type { UserForm } from "@/typesRequest/UserForm";
import Button from "@mui/material/Button";
import UserInput from "@forms/UserInput";
import Progress from "@components/Progress";
import CircularProgress from "@mui/material/CircularProgress";
import type { Person } from "@/typesResponse/Person";

interface UserFormProps {
  isEditMode: boolean;
  userId?: number;
  start: number;
  end: number;
  onNext: (data: UserForm) => void;
  onBack: () => void;
  onFinish: (data: UserForm) => void;
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
  const methods = useForm<UserForm>();
  const { data, loading } = useRoleData();
  const users: Person[] = data.persons ?? [];

  useEffect(() => {
    if (isEditMode) {
      const user = users.find((u) => u.person_id === userId);
      if (user) {
        methods.reset({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.user_account.email,
          birthdate: user.birthdate,
          gender_id: user.gender_id,
          occupation_id: user.occupation_id,
          marital_status_id: user.marital_status_id,
          education_id: user.education_id,
          role_id: user.user_account.role_id,
          phone: {
            number: user.phone?.number ?? "",
            type: user.phone?.type ?? "",
          },
          identification: {
            type: user.identification?.type ?? "",
            number: user.identification?.number ?? "",
          },
          address: {
            type: user.address?.type ?? "",
            country_id: user.address?.country_id ?? 0,
            state_id: user.address?.state_id ?? 0,
            city_id: user.address?.city_id ?? 0,
            primary_address: user.address?.primary_address ?? "",
            secondary_address: user.address?.secondary_address ?? "",
          },
          // Campos de profesional
          title: user.professional?.title ?? "",
          specialty: user.professional?.specialty ?? "",
        });
      }
    } else {
      methods.reset({
        first_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        password: "",
        password_confirmation: "",
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
        title: "",
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

  // Ocultar campos de profesional si el rol no es 2
  const filteredInputs = inputCreateUserAdminConfig.filter((input) => {
    const isProfessionalField = ["title", "about", "specialty"].includes(
      input.key,
    );
    return !(isProfessionalField && roleSelect !== 2);
  });

  const list_inputs = filteredInputs.slice(start, end).map((input) => (
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
    if (isLast) return isEditMode ? "Guardar" : "Crear";
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
