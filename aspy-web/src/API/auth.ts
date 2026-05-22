// FINAL
import api from "@API/api";
import type { UserLogin } from "@/types/UserLogin";
import type { UserForm } from "@/typesRequest/UserForm";
import { setAuthenticatedUser } from "@store";

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
    await api.post("/user-account/registro", userRegister);
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};

export const crearUsuario = async (userRegister: UserForm) => {
  try {
    await api.post("/user-account/crear", userRegister);
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};

export const logoutRequest = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
