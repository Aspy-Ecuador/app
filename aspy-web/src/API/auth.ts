import axios from "axios";
import apiURL from "./apiConfig";
import { setAuthenticatedUser } from "@store";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";
import { LoginResponse } from "@/types/responses/LoginResponse";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${apiURL}/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!response) {
    throw new Error("Credenciales incorrectas");
  }
  const data = response.data;
  localStorage.setItem("token", data.token);
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

  const user: LoginResponse = response.data;
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
