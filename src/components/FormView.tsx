import { useState } from "react";
import { UserAccount } from "@/types/UserAccount";
import { inputCreateUserConfig } from "../config/userFormConfig";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import UserForm from "@forms/UserForm";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
//import { addPerson } from "../API/usuarioAPI";
import { register } from "../API/auth";
import { Person } from "@/types/Person";

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

  const [userData, setUserData] = useState<UserAccount>();

  const handleNext = (data: UserAccount) => {
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

  const formatUserAccount = (data: any): UserAccount => {
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
      person_type: "staff",
    };
  };

  const handleFinalSubmit = async (data: UserAccount) => {
    const fullData = { ...userData, ...data, role_id: 1 };
    const userRegister = formatUserAccount(fullData);
    console.log(userRegister);

    if (isEdit) {
      console.log("se debe editar");
      //await register(newPerson);
    } else {
      await register(userRegister);
    }
    handleOpen();
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
