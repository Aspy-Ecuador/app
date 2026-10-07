// FINAL
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { campoContrasena, ciudadEsDeProvincia, inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { OCUPACION_OTRA, reglaOcupacionOtra } from "@/config/reglasContacto";
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

  const users: Person[] = useMemo(() => {
    return data.persons ?? [];
  }, [data.persons]);

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
  }, [isEditMode, userId, users, methods]);

  const roleSelect = Number(
    useWatch({ control: methods.control, name: "role_id" }) ?? 0,
  );

  // ← NUEVO: observa la provincia seleccionada
  const selectedStateId = Number(
    useWatch({ control: methods.control, name: "address.state_id" }) ?? 0,
  );

  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(roleSelect);
    }
  }, [roleSelect, onRoleChange]);

  // Al cambiar de provincia se borra la ciudad, salvo que ya sea de esa provincia (al abrir una
  // edición la provincia "cambia" de vacía a la guardada, y antes eso dejaba la ciudad en blanco).
  useEffect(() => {
    if (!selectedStateId) return;
    const ciudad = Number(methods.getValues("address.city_id") ?? 0);
    if (!ciudadEsDeProvincia(ciudad, selectedStateId)) methods.setValue("address.city_id", "" as unknown as number);
  }, [selectedStateId, methods]);

  const filteredInputs = inputCreateUserAdminConfig.filter((input) => {
    const isProfessionalField = ["title", "specialty"].includes(input.key);
    return !(isProfessionalField && roleSelect !== 2);
  });

  // ← MODIFICADO: filtra ciudades según la provincia seleccionada

  // Ocupación "Otra": campo para escribirla, justo después de la lista
  const ocupacion = Number(useWatch({ control: methods.control, name: "occupation_id" }) ?? 0);
  const conOtra = (input: { key: string }, nodo: React.ReactNode) =>
    input.key === "occupation_id" && ocupacion === OCUPACION_OTRA
      ? [
          nodo,
          <UserInput key="occupation_other" label="¿Cuál es su ocupación?" type="text" id="occupation_other" validation={reglaOcupacionOtra} />,
        ]
      : [nodo];

  const list_inputs = filteredInputs.slice(start, end).flatMap((input) => {
    const resolvedOptions = input.dependsOn
      ? input.options?.filter((opt) => opt.state_id === selectedStateId)
      : input.options;

    const campo = campoContrasena(input, isEditMode, () => methods.getValues("password"));

    return conOtra(
      input,
      <UserInput
        key={input.key}
        label={campo.label}
        type={input.type}
        id={input.key}
        validation={campo.validation}
        options={resolvedOptions}
      />,
    );
  });

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
              {load ? <CircularProgress size={22} sx={{ color: "white" }} /> : getButtonLabel()}
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
}