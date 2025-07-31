import axios from "axios";
import apiURL from "./apiConfig";
import { User } from "@/types/User";
import { Person } from "@/types/Person";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const usuarioAPI = {
  getAllUsuarios: () => axios.get(`${apiURL}/person`, config),

  getUsuarioById: (id: string) => axios.get(`${apiURL}/usuarios/${id}`),

  getUsuariosByRol: (rol: string) =>
    axios.get(`${apiURL}/usuarios/rol/${encodeURIComponent(rol)}`),

  createUsuario: (usuarioData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    cedula: string;
    rol: string;
    contrasena: string;
  }) => axios.post(`${apiURL}/usuarios`, usuarioData),

  updateUsuario: (
    id: string,
    usuarioData: {
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
      cedula: string;
      rol: string;
      contrasena?: string;
      direccion?: string;
      fechaNacimiento?: string;
      estado?: string;
      foto?: string;
      sobreMi?: string;
      genero?: string;
      nombreRepresentante?: string;
      apellidoRepresentante?: string;
      telefonoRepresentante?: string;
      cedulaRepresentante?: string;
      emailRepresentante?: string;
      parentesco?: string;
    }
  ) => axios.put(`${apiURL}/usuarios/${id}`, usuarioData),
};

export default usuarioAPI;

export const getUserById = async (id: number): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.get(`${apiURL}/person/${id - 1}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as User;
  } catch (error) {
    console.error("Error al obtener el rol por ID:", error);
    throw error;
  }
};

export const addPerson = async (personData: Person): Promise<Person> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");

  try {
    const response = await axios.post(`${apiURL}/person`, personData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data as Person;
  } catch (error) {
    console.error("Error al agregar persona:", error);
    throw error;
  }
};

export const getAllUsuarios = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.get(`${apiURL}/person`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
};
