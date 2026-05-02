// FINAL
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/API/auth";
import Box from "@mui/material/Box";
import Steps from "@components/Steps";
import Success from "@components/Success";
import FormRegister from "@components/FormRegister";
import type { UserForm } from "@/typesRequest/UserForm";

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

function buildPayload(data: UserForm) {
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
  };
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

  const handleFinalSubmit = async (stepData: UserForm) => {
    const fullData = { ...formData, ...stepData } as UserForm;
    const payload = buildPayload(fullData);
    setLoad(true);
    try {
      await register(payload);
      setOpen(true);
    } catch (error) {
      console.error("Register failed:", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Steps activeStep={step} steps={stepsName} />

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
