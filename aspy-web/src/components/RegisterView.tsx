// FINAL
import { useState } from "react";
import { VERSION_POLITICA } from "@/config/politica";
import { useNavigate } from "react-router-dom";
import { register } from "@/API/auth";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import PasosRegistro from "@components/auth/PasosRegistro";
import Success from "@components/Success";
import FormRegister from "@components/FormRegister";
import type { UserForm } from "@/typesRequest/UserForm";

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

function buildPayload(data: UserForm, acceptedPrivacyPolicy: boolean) {
  return {
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    role_id: 3,
    first_name: data.first_name,
    last_name: data.last_name,
    birthdate: data.birthdate,
    gender_id: Number(data.gender_id),
    occupation_id: Number(data.occupation_id),
    occupation_other: Number(data.occupation_id) === 10 ? data.occupation_other ?? "" : null,
    marital_status_id: Number(data.marital_status_id),
    education_id: Number(data.education_id),
    role: "client" as const,
    phone: data.phone,
    address: {
      ...data.address,
      country_id: Number(data.address.country_id),
      state_id: Number(data.address.state_id),
      city_id: Number(data.address.city_id),
    },
    identification: data.identification,
    // NUEVO: Esto le avisa al backend que el usuario completó la lectura y aceptó el modal
    accepted_privacy_policy: acceptedPrivacyPolicy,
    policy_version: VERSION_POLITICA,
  };
}

/** Explica por qué no se pudo crear la cuenta, con lo que responde el servidor. */
function mensajeDeError(error: unknown): string {
  const res = (error as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } })?.response;
  if (res?.status === 429) return "Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.";
  const errores = res?.data?.errors;
  if (res?.status === 422 && errores) {
    if (errores.email) return "Ese correo ya tiene una cuenta. Inicia sesión o usa otro correo.";
    if (errores["identification.number"]) return "El número de identificación no es válido. Revísalo en el primer paso.";
    return "Hay datos que no son válidos. Revisa los pasos anteriores e inténtalo de nuevo.";
  }
  return "No pudimos crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.";
}

const stepsFields = [
  { start: 0, end: 10 },
  { start: 10, end: 18 },
  { start: 18, end: 21 },
];

export default function RegisterView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState<Partial<UserForm>>({});
  const [errorRegistro, setErrorRegistro] = useState("");

  const handleNext = (stepData: UserForm) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/app");
  };

  const handleFinalSubmit = async (stepData: UserForm, acceptedPrivacyPolicy: boolean) => {
    const fullData = { ...formData, ...stepData } as UserForm;
    const payload = buildPayload(fullData, acceptedPrivacyPolicy);
    setLoad(true);
    setErrorRegistro("");
    try {
      await register(payload);
      setOpen(true);
    } catch (error) {
      setErrorRegistro(mensajeDeError(error));
    } finally {
      setLoad(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      <PasosRegistro paso={step} pasos={stepsName} />

      {errorRegistro && (
        <Alert severity="error" onClose={() => setErrorRegistro("")} sx={{ borderRadius: 3, fontSize: "0.88rem" }}>
          {errorRegistro}
        </Alert>
      )}

      <FormRegister
        start={stepsFields[step].start}
        end={stepsFields[step].end}
        onNext={handleNext}
        onBack={handleBack}
        onFinish={handleFinalSubmit}
        isLast={step === totalSteps - 1}
        load={load}
      />

      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message="Se ha registrado con éxito!!"
      />
    </Box>
  );
}
