import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";

interface RoleData {
  name: string; // Role name (e.g., 'Admin', 'User')
  description: string; // Role description
}

// Función helper para obtener la configuración con token actualizado
const getConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const roleAPI = {
  // Get all roles
  getAllRoles: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/role`, getConfig());
  },

  // Get role by ID
  getRoleById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/role/${id}`, getConfig());
  },

  // Create a new role
  createRole: async (roleData: RoleData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/role`, roleData, getConfig());
  },

  // Update role by ID
  updateRole: async (
    id: string,
    roleData: RoleData
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/role/${id}`, roleData, getConfig());
  },

  // Delete role by ID
  deleteRole: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/role/${id}`, getConfig());
  },
};

export default roleAPI;
