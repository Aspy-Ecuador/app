// UserFormProfessional.tsx - FINAL
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import type { InputConfig } from "@/config/userFormAdminConfig";
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
  roleId: number; // ← NUEVO: reemplaza la constante hardcodeada
  start: number;
  end: number;
  onNext: (data: UserForm) => void;
  onBack: () => void;
  onFinish: (data: UserForm) => void;
  isLast?: boolean;
  load?: boolean;
}

// Etiquetas por role_id para mostrar en el select deshabilitado
const roleLabelMap: Record<number, string> = {
  2: "Profesional",
  3: "Cliente",
  4: "Secretario",
};

export default function UserFormUser({
  isEditMode,
  userId,
  roleId, // ← recibe el rol dinámico
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
  load,
}: UserFormProps) {
  const methods = useForm<UserForm>();
  const { data, loading } = useRoleData();

  const users: Person[] = useMemo(() => data.persons ?? [], [data.persons]);

  // Construye la config con role_id bloqueado al valor recibido por prop
  const lockedInputConfig: InputConfig[] = inputCreateUserAdminConfig.map(
    (input) => {
      if (input.key !== "role_id") return input;
      return {
        ...input,
        disabled: true,
        options: [{ label: roleLabelMap[roleId] ?? "Rol", value: roleId }],
      };
    },
  );

  // Fija role_id al montar
  useEffect(() => {
    methods.setValue("role_id", roleId);
  }, [methods, roleId]); // ← roleId en dependencias por si cambia

  useEffect(() => {
    if (isEditMode) {
      const user = users.find((u) => u.person_id === userId);
      if (user) {
        methods.reset({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.user_account.email,
          birthdate: user.birthdate.split("T")[0],
          password: "",
          password_confirmation: "",
          gender_id: user.gender_id,
          occupation_id: user.occupation_id,
          marital_status_id: user.marital_status_id,
          education_id: user.education_id,
          role_id: roleId, // ← dinámico
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
        role_id: roleId, // ← dinámico
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
  }, [isEditMode, userId, users, methods, roleId]); // ← roleId en dependencias

  const selectedStateId = Number(
    useWatch({ control: methods.control, name: "address.state_id" }) ?? 0,
  );

  useEffect(() => {
    if (selectedStateId) {
      methods.setValue("address.city_id", 0);
    }
  }, [selectedStateId]);

  const list_inputs = lockedInputConfig.slice(start, end).map((input) => (
    <UserInput
      key={input.key}
      label={input.label}
      type={input.type}
      id={input.key}
      disabled={input.disabled}
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
      options={
        input.dependsOn
          ? input.options?.filter((opt) => opt.state_id === selectedStateId)
          : input.options
      }
    />
  ));

  const onSubmit = methods.handleSubmit((data) => {
    const safeData = { ...data, role_id: roleId }; // ← garantiza el rol correcto
    if (isLast) {
      onFinish(safeData);
    } else {
      onNext(safeData);
    }
  });

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
            ) : isLast ? (
              isEditMode ? (
                "Guardar"
              ) : (
                "Crear"
              )
            ) : (
              "Siguiente"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
