import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { User } from "@/types/User";
import { getUser } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import { register } from "@/API/auth";
import Box from "@mui/material/Box";
import UserFormAdmin from "@admin/UserFormAdmin";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
import Progress from "@components/Progress";
import userAccountAPI from "@/API/userAccountAPI";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function FormViewAdmin({ isEdit, user_id }: FormViewProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const [userData, setUserData] = useState<User>();

  const {
    data,
    loading,
    refreshPersons,
    refreshUserAccounts,
    refreshRoles,
    refreshProfessionals,
  } = useRoleData();

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
      2: "professional",
      3: "client",
      4: "staff",
    };
    if (Number(data.role_id) === 2) {
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
        title: data.title,
        about: data.about,
        specialty: data.specialty,
      };
    }
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

    if (Number(data.role_id) === 2) {
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
        title: data.title,
        about: data.about,
        specialty: data.specialty,
      };
    }
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
    setLoad(true);
    if (isEdit) {
      const userEdit = formatUserEdit(fullData);
      console.log(userEdit);
      await userAccountAPI.updateUserAccount(user_id!, userEdit);
      await refreshPersons();
      await refreshUserAccounts();
      await refreshRoles();
      await refreshProfessionals();
    } else {
      const userRegister = formatUser(fullData);
      console.log(userRegister);
      await register(userRegister);
      await refreshPersons();
      await refreshUserAccounts();
      await refreshRoles();
      await refreshProfessionals();
    }
    setLoad(false);
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
    if (user_id) {
      const user: User = getUser(data, user_id);
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
          <UserFormAdmin
            isEditMode={isEdit}
            start={stepsFields[step].start}
            end={stepsFields[step].end}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinalSubmit}
            isLast={step === totalSteps - 1}
            userId={user_id}
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
      ;
    </Box>
  );
}
