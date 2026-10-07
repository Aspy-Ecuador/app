// UserFormProfessional.tsx - FINAL
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { campoContrasena, ciudadEsDeProvincia, inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { OCUPACION_OTRA, reglaOcupacionOtra } from "@/config/reglasContacto";
import type { InputConfig } from "@/config/userFormAdminConfig";
import { useRoleData } from "@/observer/RoleDataContext";
import type { UserForm } from "@/typesRequest/UserForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { botonPrimarioSx, botonSecundarioSx } from "@forms/estilos";
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
  // Título y especialidad solo se piden a los profesionales (antes también se exigían a un paciente)
  const lockedInputConfig: InputConfig[] = inputCreateUserAdminConfig
    .filter((input) => roleId === 2 || !["title", "specialty"].includes(input.key))
    .map(
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
          occupation_other: user.occupation_other ?? "",
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
          // Vacío (no 0) para que las listas muestren "Seleccione una opción"
          country_id: "" as unknown as number,
          state_id: "" as unknown as number,
          city_id: "" as unknown as number,
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

  // Al cambiar de provincia se borra la ciudad, salvo que ya sea de esa provincia (al abrir una
  // edición la provincia "cambia" de vacía a la guardada, y antes eso dejaba la ciudad en blanco).
  useEffect(() => {
    if (!selectedStateId) return;
    const ciudad = Number(methods.getValues("address.city_id") ?? 0);
    if (!ciudadEsDeProvincia(ciudad, selectedStateId)) methods.setValue("address.city_id", "" as unknown as number);
  }, [selectedStateId, methods]);


  // Ocupación "Otra": campo para escribirla, justo después de la lista
  const ocupacion = Number(useWatch({ control: methods.control, name: "occupation_id" }) ?? 0);
  const conOtra = (input: { key: string }, nodo: React.ReactNode) =>
    input.key === "occupation_id" && ocupacion === OCUPACION_OTRA
      ? [
          nodo,
          <UserInput key="occupation_other" label="¿Cuál es su ocupación?" type="text" id="occupation_other" validation={reglaOcupacionOtra} />,
        ]
      : [nodo];

  const list_inputs = lockedInputConfig.slice(start, end).flatMap((input) => conOtra(input,
    <UserInput
      key={input.key}
      label={campoContrasena(input, isEditMode, () => methods.getValues("password")).label}
      type={input.type}
      id={input.key}
      disabled={input.disabled}
      validation={campoContrasena(input, isEditMode, () => methods.getValues("password")).validation}
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
      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
        noValidate
        sx={{ display: "flex", justifyContent: "center", p: { xs: 1.5, md: 3 } }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 860, p: { xs: 2.5, md: 4 }, border: "0.5px solid", borderColor: "divider", borderRadius: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 3, rowGap: 2.25, "& > *": { minWidth: 0 } }}>
            {list_inputs}
          </Box>
          <Box
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: "0.5px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: start !== 0 ? "space-between" : "flex-end",
              gap: 1.5,
            }}
          >
            {start !== 0 && (
              <Button onClick={onBack} startIcon={<ChevronLeftRoundedIcon />} sx={botonSecundarioSx}>
                Anterior
              </Button>
            )}
            <Button type="submit" variant="contained" onClick={onSubmit} disabled={!!load} sx={botonPrimarioSx}>
              {load ? <CircularProgress size={22} sx={{ color: "white" }} /> : isLast ? (isEditMode ? "Guardar" : "Crear") : "Siguiente"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
}
