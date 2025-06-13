import { useState } from "react";
import { User } from "@/types/User";
import { inputCreateUserConfig } from "../config/userFormConfig";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import UserForm from "@forms/UserForm";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";

interface FormViewProps {
  isEdit: boolean;
  userId?: number;
  role: string;
  isRegister?: boolean;
}

const stepsName = ["Datos personales", "Hogar", "Seguridad"];

export default function FormView({
  isEdit,
  userId,
  role,
  isRegister,
}: FormViewProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3; // O calculado según el tamaño de `inputCreateUserConfig`
  const fieldsPerStep = Math.ceil(inputCreateUserConfig.length / totalSteps);
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<Partial<User>>({});

  const handleNext = (data: Partial<User>) => {
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
    if (isRegister) {
      navigate("/login");
    } else {
      navigate(-1);
    }
  };

  const navigate = useNavigate();
  const handleFinalSubmit = (data: Partial<User>) => {
    const fullData = { ...userData, ...data };
    console.log("Usuario final:", fullData);
    handleOpen();
    // Aquí puedes guardar el usuario o enviarlo al backend
  };

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={step} steps={stepsName} />
        </Grid>
        <Grid size={12}>
          <UserForm
            isEditMode={isEdit}
            userId={userId}
            role={role}
            start={step * fieldsPerStep}
            end={(step + 1) * fieldsPerStep}
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
