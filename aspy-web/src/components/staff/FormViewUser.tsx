// FormViewProfessional.tsx - FINAL
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserForm } from "@/typesRequest/UserForm";
import { useRoleData } from "@/observer/RoleDataContext";
import { crearUsuario } from "@/API/auth";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { mensajeErrorUsuario } from "@utils/mensajeErrorUsuario";
import UserFormUser from "@staff/UserFormUser";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid";
import Success from "@components/Success";
import Progress from "@components/Progress";
import userAccountAPI from "@/API/userAccountAPI";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
  role_id: number; // ← ahora requerido
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

const roleMap: Record<number, "professional" | "client" | "staff"> = {
  2: "professional",
  3: "client",
  4: "staff",
};

function buildPayload(data: UserForm, role_id: number) {
  // ← recibe role_id
  return {
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    role_id,

    first_name: data.first_name,
    last_name: data.last_name,
    birthdate: data.birthdate,
    gender_id: Number(data.gender_id),
    occupation_id: Number(data.occupation_id),
    occupation_other: Number(data.occupation_id) === 10 ? data.occupation_other ?? "" : null,
    marital_status_id: Number(data.marital_status_id),
    education_id: Number(data.education_id),

    role: roleMap[role_id],

    phone: data.phone,
    address: {
      ...data.address,
      country_id: Number(data.address.country_id),
      state_id: Number(data.address.state_id),
      city_id: Number(data.address.city_id),
    },
    identification: data.identification,

    // Solo si es profesional
    ...(role_id === 2 && {
      title: data.title,
      specialty: data.specialty,
    }),
  };
}

// El paso 2 del profesional tiene dos campos más (título y especialidad)
const pasosDe = (role_id: number) =>
  role_id === 2
    ? [{ start: 0, end: 10 }, { start: 10, end: 20 }, { start: 20, end: 24 }]
    : [{ start: 0, end: 10 }, { start: 10, end: 18 }, { start: 18, end: 24 }];

export default function FormViewProfessional({
  isEdit,
  user_id,
  role_id,
}: FormViewProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const stepsFields = pasosDe(role_id);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [formData, setFormData] = useState<Partial<UserForm>>({});

  const { loading, refreshPersons } = useRoleData();

  const handleNext = (stepData: UserForm) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/dashboard");
  };

  const handleFinalSubmit = async (stepData: UserForm) => {
    const fullData = { ...formData, ...stepData } as UserForm;
    const payload = buildPayload(fullData, role_id); // ← pasa role_id

    setLoad(true);
    setErrorEnvio("");
    try {
      if (isEdit && user_id) {
        await userAccountAPI.updateUserAccount(user_id, payload);
      } else {
        await crearUsuario(payload);
      }
      await refreshPersons();
      setOpen(true);
    } catch (error: unknown) {
      // Antes el error solo iba a la consola y el formulario parecía no hacer nada
      setErrorEnvio(mensajeErrorUsuario(error));
    } finally {
      setLoad(false);
    }
  };

  if (loading) return <Progress />;

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        {errorEnvio && (
          <Grid size={12} sx={{ display: "flex", justifyContent: "center", px: { xs: 1.5, md: 3 } }}>
            <Alert severity="error" onClose={() => setErrorEnvio("")} sx={{ width: "100%", maxWidth: 860, borderRadius: 3 }}>
              {errorEnvio}
            </Alert>
          </Grid>
        )}
        <Grid size={12}>
          <UserFormUser
            isEditMode={isEdit}
            userId={user_id}
            roleId={role_id} // ← NUEVO: baja la prop
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
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
            ? "Se ha actualizado el usuario con éxito!!"
            : "Se ha registrado el usuario con éxito!!"
        }
      />
    </Box>
  );
}
