import axios from "axios";
import apiURL from "./apiConfig";
import { RoleAccount } from "@/types/RoleAccount";

const rolAPI = {
  getAllRoles: () => axios.get(`${apiURL}/roles`),

  getRolById: (id: string) => axios.get(`${apiURL}/roles/${id}`),

  createRol: (rolData: {
    nombre: string;
    descripcion?: string;
    permisos?: string[];
  }) => axios.post(`${apiURL}/roles`, rolData),

  updateRol: (
    id: string,
    rolData: { nombre?: string; descripcion?: string; permisos?: string[] }
  ) => axios.put(`${apiURL}/roles/${id}`, rolData),
};

export default rolAPI;

export const getRolById = async (id: number): Promise<RoleAccount> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.get(`${apiURL}/role/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as RoleAccount;
  } catch (error) {
    console.error("Error al obtener el rol por ID:", error);
    throw error;
  }
};
