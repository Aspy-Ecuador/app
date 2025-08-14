import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/utils/utils";
import { User } from "@/types/User";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import UserForm from "@forms/UserForm";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
//import userAccountAPI from "@/API/userAccountAPI";
//import { register } from "@API/auth";
import Progress from "@components/Progress";

interface FormViewProps {
  isEdit: boolean;
  userId?: number;
  isRegister?: boolean;
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function FormView({
  isEdit,
  userId,
  isRegister,
}: FormViewProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const [roleSelect, setRoleSelect] = useState<number>(0);

  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<User>();

  const { data, loading } = useRoleData();

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

    if (isRegister) {
      navigate("/login");
    } else {
      navigate(-1);
    }
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

  const formatUserEdit = (data: any): UserAccountRequest => {
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
    const fullData = { ...userData, ...data, role_id: 3 };
    const userRegister = formatUserAccount(fullData);
    console.log(userRegister);

    if (isEdit) {
      const userEdit = formatUserEdit(fullData);
      console.log(userEdit);
      //await userAccountAPI.updateUserAccount( user_id!, userRegister);
    } else {
      const userRegister = formatUserAccount(fullData);
      console.log(userRegister);
      //await register(userRegister);
    }
    handleOpen();
  };

  let stepsFields = [];
  if (roleSelect === 2) {
    stepsFields = [
      { start: 0, end: 5 },
      { start: 5, end: 12 },
      { start: 12, end: 14 },
    ];
  } else {
    stepsFields = [
      { start: 0, end: 5 },
      { start: 5, end: 9 },
      { start: 9, end: 12 },
    ];
  }
  if (loading) return <Progress />;

  if (isEdit) {
    if (userId) {
      const user: User = getUser(data, userId);
      if (user.role_id === 2) {
        stepsFields = [
          { start: 0, end: 5 },
          { start: 5, end: 12 },
          { start: 12, end: 14 },
        ];
      } else {
        stepsFields = [
          { start: 0, end: 5 },
          { start: 5, end: 9 },
          { start: 9, end: 12 },
        ];
      }
      if (roleSelect === 2) {
        stepsFields = [
          { start: 0, end: 5 },
          { start: 5, end: 12 },
          { start: 12, end: 14 },
        ];
      } else {
        stepsFields = [
          { start: 0, end: 5 },
          { start: 5, end: 9 },
          { start: 9, end: 12 },
        ];
      }
    }
  }

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
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            onRoleChange={setRoleSelect}
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
