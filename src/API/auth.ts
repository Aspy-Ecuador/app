import axios from "axios";
import apiURL from "./apiConfig";
import { UserLogin } from "@/types/UserLogin";
import { getRolById } from "../API/rolAPI";
import { getUserById } from "../API/usuarioAPI";
import { setAuthenticatedUser } from "@store";
import { User } from "@/types/User";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${apiURL}/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );

  if (!response) {
    throw new Error("Credenciales incorrectas");
  }

  const data = response.data;

  // Guarda el token
  localStorage.setItem("token", data.access_token);

  await StoreUser();
  return data;
};

export const StoreUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Token no encontrado");

  const response = await axios.get(`${apiURL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userData: UserLogin = response.data;
  const roleInfo = await getRolById(userData.role_id);
  const userInfo: User = await getUserById(userData.user_id);

  const userWithRoleName: UserLogin = {
    ...userData,
    role: roleInfo.name,
    name: userInfo.first_name + " " + userInfo.middle_name,
  };

  setAuthenticatedUser(userWithRoleName);
  //Guarda el usuario logeado
  return userWithRoleName;
};

export const register = async () => {
  const token = localStorage.getItem("token");
  const userRegister = {
    role_id: 4,
    email: "staff5@aspy.com",
    password: "staff5",

    first_name: "Miguel",
    last_name: "Castro",
    birthdate: "1982-07-20",
    gender: 2,
    occupation: 4,
    marital_status: 1,
    education: 2,

    person_type: "staff",
  };

  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.post(`${apiURL}/user-account`, userRegister, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data as UserLogin;
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};
