import api from "@API/api";
import { UserLogin } from "@/types/UserLogin";
import type { UserForm } from "@/typesRequest/UserForm";
import { setAuthenticatedUser } from "@store";
import { UserAccountRequest } from "@/typesRequest/UserAccountRequest";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", {
    email,
    password,
  });

  const data = response.data;

  if (!response) {
    throw new Error("Credenciales incorrectas");
  }

  localStorage.setItem("token", data.access_token);
  await StoreUser();
  return data;
};

export const StoreUser = async () => {
  const response = await api.get("/user");

  const userLogin: UserLogin = response.data;

  if (!userLogin) throw new Error("Persona no encontrada");

  setAuthenticatedUser(userLogin);
  return userLogin;
};

export const register = async (userRegister: UserForm) => {
  try {
    await api.post("/user-account", userRegister);
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};
