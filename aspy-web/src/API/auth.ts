import axios from "axios";
import apiURL from "./apiConfig";
import { UserLogin } from "@/types/UserLogin";
import { getRolById } from "../API/rolAPI";
import { setAuthenticatedUser } from "@store";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { LoginResponse } from "@/typesResponse/LoginResponse";
import { loginAdapter } from "@/adapters/loginAdapter";
import personAPI from "./personAPI";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import { PersonResponse } from "@/typesResponse/PersonResponse";

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

  const userLogin: LoginResponse = response.data;
  const roleLogin: RoleResponse = await getRolById(userLogin.role_id);
  const personsResponse = await personAPI.getAllPersons();
  const persons: PersonResponse[] = personsResponse.data;
  const personLogin = persons.find(
    (person) => person.user_id === userLogin.user_id
  );

  if (!personLogin) throw new Error("Person no encontrado");

  const user: UserLogin = loginAdapter(personLogin, roleLogin, userLogin);
  console.log(user);
  setAuthenticatedUser(user);
  return user;
};

export const register = async (userRegister: UserAccountRequest) => {
  try {
    await axios.post(`${apiURL}/user-account`, userRegister);
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};
