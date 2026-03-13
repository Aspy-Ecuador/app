import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/User";
import { register } from "@/API/auth";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import Box from "@mui/material/Box";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
import FormRegister from "@components/FormRegister";

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function RegisterView() {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<User>();

  const handleNext = (data: User) => {
    setUserData((prev) => ({ ...prev, ...data }));
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/app");
  };

  const navigate = useNavigate();

  const formatUserAccount = (data: any): UserAccountRequest => {
    return {
      role_id: Number(data.role_id),
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      birthdate: data.birthdate,
      gender: Number(data.gender),
      occupation: Number(data.occupation),
      marital_status: Number(data.marital_status),
      education: Number(data.education),
      person_type: "client",
    };
  };

  const handleFinalSubmit = async (data: User) => {
    const fullData = { ...userData, ...data };
    const userRegister = formatUserAccount(fullData);
    try {
      await register(userRegister);
      handleOpen();
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  const stepsFields = [
    { start: 0, end: 5 },
    { start: 5, end: 9 },
    { start: 9, end: 11 },
  ];

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        <Grid size={12}>
          <FormRegister
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
          />
        </Grid>
      </Grid>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={true}
        message={"Se ha registrado con éxito!!"}
      />
      ;
    </Box>
  );
}
