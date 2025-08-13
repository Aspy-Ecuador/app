import { useState } from "react";
import { inputCreateUserAdminConfig } from "@/config/userFormAdminConfig";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import UserFormAdmin from "@admin/UserFormAdmin";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
//import { addPerson } from "../API/usuarioAPI";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { User } from "@/types/User";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
}

const stepsName = ["Datos personales", "Hogar", "Seguridad"];

export default function FormViewAdmin({ isEdit, user_id }: FormViewProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const fieldsPerStep = Math.ceil(
    inputCreateUserAdminConfig.length / totalSteps
  );

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
    navigate(-1);
  };

  const navigate = useNavigate();

  const formatUser = (data: any): UserAccountRequest => {
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "proffesional",
      3: "client",
      4: "staff",
    };

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
      person_type: roleMap[data.role_id],
    };
  };

  const formatUserEdit = (data: any): UserAccountRequest => {
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "proffesional",
      3: "client",
      4: "staff",
    };

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
      person_type: roleMap[data.role_id],
    };
  };

  const handleFinalSubmit = async (data: User) => {
    const fullData = { ...userData, ...data };

    if (isEdit) {
      console.log("se editó");
      const userEdit = formatUserEdit(fullData);
      console.log(userEdit);
      //await register(newPerson);
    } else {
      console.log("se debe registrar");
      const userRegister = formatUser(fullData);
      console.log(userRegister);
      //await register(userRegister);
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
          <UserFormAdmin
            isEditMode={isEdit}
            start={step * fieldsPerStep}
            end={(step + 1) * fieldsPerStep}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            userId={user_id}
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
      ;
    </Box>
  );
}
