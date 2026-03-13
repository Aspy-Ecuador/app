import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { User } from "@/types/User";
import { getUser } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import { register } from "@/API/auth";
import { PersonResponse } from "@/types/responses/PersonResponse";
import Box from "@mui/material/Box";
import UserFormAdmin from "@admin/UserFormAdmin";
import Steps from "@components/Steps";
import Grid from "@mui/material/Grid2";
import Success from "@components/Success";
import Progress from "@components/Progress";
import userAccountAPI from "@/API/userAccountAPI";
import Error from "@components/Error";

interface FormViewProps {
  isEdit: boolean;
  user_id?: number;
}

const stepsName = ["Datos personales", "Datos generales", "Seguridad"];

export default function FormViewAdmin({ isEdit, user_id }: FormViewProps) {
  const [step, setStep] = useState(0);
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [user, setUser] = useState<PersonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;
  const navigate = useNavigate();

  const { loading, refreshPersons, refreshUserAccounts, refreshProfessionals } =
    useRoleData();

  // Cargar usuario al montar el componente (solo en modo edición)
  useEffect(() => {
    if (isEdit && user_id && !loading) {
      const person: PersonResponse | null = getUser(user_id);

      if (!person) {
        setError("Usuario no encontrado");
      } else {
        setUser(person);
        // Establecer el rol inicial basado en el usuario cargado
        setRoleSelect(person.user_account.role.role_id);
      }
    }
  }, [isEdit, user_id, loading]);

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

  const formatUser = (data: any): UserAccountRequest => {
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "professional",
      3: "client",
      4: "staff",
    };

    const baseUser = {
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

    if (Number(data.role_id) === 2) {
      return {
        ...baseUser,
        title: data.title,
        about: data.about,
        specialty: data.specialty,
      };
    }

    return baseUser;
  };

  const formatUserEdit = (data: any): UserAccountRequest => {
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "professional",
      3: "client",
      4: "staff",
    };

    const baseUser = {
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

    if (Number(data.role_id) === 2) {
      return {
        ...baseUser,
        title: data.title,
        about: data.about,
        specialty: data.specialty,
      };
    }

    return baseUser;
  };

  const handleFinalSubmit = async (data: User) => {
    const fullData = { ...userData, ...data };
    setLoad(true);

    try {
      if (isEdit) {
        const userEdit = formatUserEdit(fullData);
        await userAccountAPI.updateUserAccount(user_id!, userEdit);
      } else {
        const userRegister = formatUser(fullData);
        await register(userRegister);
      }

      await refreshPersons();
      await refreshUserAccounts();
      await refreshProfessionals();

      handleOpen();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setError("Error al guardar el usuario");
    } finally {
      setLoad(false);
    }
  };

  // Calcular stepsFields basado en el rol seleccionado o el rol del usuario
  const getStepsFields = () => {
    const currentRole =
      isEdit && user ? user.user_account.role.role_id : roleSelect;

    if (currentRole === 2) {
      return [
        { start: 0, end: 4 },
        { start: 4, end: 10 },
        { start: 10, end: 13 },
      ];
    } else {
      return [
        { start: 0, end: 4 },
        { start: 4, end: 8 },
        { start: 8, end: 11 },
      ];
    }
  };

  const stepsFields = getStepsFields();

  // Estados de carga y error
  if (loading) return <Progress />;
  if (error) return <Error mensaje={error} />;

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
            user={user}
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
    </Box>
  );
}
