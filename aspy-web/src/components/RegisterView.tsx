// FINAL
import { useState, type ReactNode } from "react";
import { VERSION_POLITICA, type Consentimiento } from "@/config/politica";
import { useNavigate } from "react-router-dom";
import { register } from "@/API/auth";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { aspy } from "@shared-theme/themePrimitives";
import PasosRegistro from "@components/auth/PasosRegistro";
import Success from "@components/Success";
import FormRegister from "@components/FormRegister";
import type { UserForm } from "@/typesRequest/UserForm";

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

function buildPayload(data: UserForm, consentimiento: Consentimiento | null) {
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
    // Consentimiento que dio la persona en la ventana de la política: casillas por separado y,
    // si la cuenta es de una persona menor de 15 años, los datos de su representante legal
    accepted_privacy_policy: consentimiento !== null,
    policy_version: VERSION_POLITICA,
    consentimiento,
  };
}

/** Explica por qué no se pudo crear la cuenta, con lo que responde el servidor. */
function mensajeDeError(error: unknown): string {
  const res = (error as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } })?.response;
  if (res?.status === 429) return "Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.";
  const errores = res?.data?.errors;
  if (res?.status === 422 && errores) {
    if (errores.email) return "Ese correo ya tiene una cuenta. Inicia sesión o usa otro correo.";
    if (Object.keys(errores).some((campo) => campo.startsWith("consentimiento") || campo === "policy_version" || campo === "accepted_privacy_policy"))
      return "Falta completar el consentimiento. Abre la política de privacidad, léela y marca las casillas del final.";
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

interface RegisterViewProps {
  /** Logo, título y texto de bienvenida. */
  encabezado: ReactNode;
  /** Enlace para quien ya tiene cuenta. */
  pie: ReactNode;
}

export default function RegisterView({ encabezado, pie }: RegisterViewProps) {
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

  const handleFinalSubmit = async (stepData: UserForm, consentimiento: Consentimiento | null) => {
    const fullData = { ...formData, ...stepData } as UserForm;
    const payload = buildPayload(fullData, consentimiento);
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
    // Celular y tablet: todo en una columna. PC (lg): encabezado, pasos y enlace a la izquierda; campos a la derecha.
    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: { xs: 3, lg: 4.5 }, alignItems: "stretch" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 3, lg: 3.5 },
          flex: "none",
          width: { lg: 250 },
          pr: { lg: 4.5 },
          borderRight: { lg: "1px solid" },
          borderColor: { lg: aspy.border },
        }}
      >
        {encabezado}
        <PasosRegistro paso={step} pasos={stepsName} enColumnaEnPc />
        <Box sx={{ display: { xs: "none", lg: "block" }, mt: "auto" }}>{pie}</Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: { xs: 3, lg: 2 } }}>
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
        fechaNacimiento={formData.birthdate}
      />
      <Box sx={{ display: { lg: "none" } }}>{pie}</Box>
      </Box>

      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message="Se ha registrado con éxito!!"
      />
    </Box>
  );
}
