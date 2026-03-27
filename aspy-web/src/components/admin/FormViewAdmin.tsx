import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserForm } from "@/typesRequest/UserForm";
import { useRoleData } from "@/observer/RoleDataContext";
import { register } from "@/API/auth";
import Box from "@mui/material/Box";
import UserFormAdmin from "@admin/UserFormAdmin";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid";
import Success from "@components/Success";
import Progress from "@components/Progress";
import userAccountAPI from "@/API/userAccountAPI";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

// Mapeo role_id → person_type string que espera el backend
const roleMap: Record<number, "professional" | "client" | "staff"> = {
  2: "professional",
  3: "client",
  4: "staff",
};

/**
 * Construye el payload que espera el endpoint store del backend.
 * Los campos anidados (phone, address, identification) se envían tal como
 * vienen del formulario; solo se agregan los campos de profesional cuando
 * role_id === 2.
 */
function buildPayload(data: UserForm) {
  const isProfessional = Number(data.role_id) === 2;

  return {
    // UserAccount
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    role_id: Number(data.role_id),

    // Person
    first_name: data.first_name,
    last_name: data.last_name,
    birthdate: data.birthdate,
    gender_id: Number(data.gender_id),
    occupation_id: Number(data.occupation_id),
    marital_status_id: Number(data.marital_status_id),
    education_id: Number(data.education_id),

    // Subtipo
    role: roleMap[Number(data.role_id)] ?? undefined,

    // Objetos anidados
    phone: data.phone,
    address: {
      ...data.address,
      country_id: Number(data.address.country_id),
      state_id: Number(data.address.state_id),
      city_id: Number(data.address.city_id),
    },
    identification: data.identification,

    // Solo para profesionales
    ...(isProfessional && {
      title: data.title,
      specialty: data.specialty,
    }),
  };
}

export default function FormViewAdmin({ isEdit, user_id }: FormViewProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState<Partial<UserForm>>({});

  const { loading, refreshPersons } = useRoleData();

  const refreshAll = async () => {
    await refreshPersons();
  };

  const handleNext = (stepData: UserForm) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleFinalSubmit = async (stepData: UserForm) => {
    const fullData = { ...formData, ...stepData } as UserForm;
    const payload = buildPayload(fullData);

    setLoad(true);
    try {
      if (isEdit && user_id) {
        await userAccountAPI.updateUserAccount(user_id, payload);
      } else {
        await register(payload);
      }
      await refreshAll();
      setOpen(true);
    } finally {
      setLoad(false);
    }
  };

  // Rangos de campos por paso según el rol seleccionado
  // Config: [start, end] → índices sobre filteredInputs en UserFormAdmin
  // professional (role_id=2) tiene 3 campos extra (title, about, specialty) en step 2
  function getStepsFields(role: number) {
    if (role === 2) {
      return [
        { start: 0, end: 5 }, // Step 1: datos personales
        { start: 5, end: 14 }, // Step 2: generales + title/about/specialty
        { start: 14, end: 24 }, // Step 3: seguridad + identificación + dirección
      ];
    }
    return [
      { start: 0, end: 5 }, // Step 1: datos personales
      { start: 5, end: 11 }, // Step 2: generales (sin campos profesional)
      { start: 11, end: 21 }, // Step 3: seguridad + identificación + dirección
    ];
  }

  const stepsFields = getStepsFields(roleSelect);

  if (loading) return <Progress />;

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        <Grid size={12}>
          <UserFormAdmin
            isEditMode={isEdit}
            userId={user_id}
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            onRoleChange={setRoleSelect}
            load={load}
          />
        </Grid>
      </Grid>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message={
          isEdit
            ? "Se ha actualizado con éxito!!"
            : "Se ha registrado con éxito!!"
        }
      />
    </Box>
  );
}
