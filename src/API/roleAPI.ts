import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface RoleData {
  name: string;           // Role name (e.g., 'Admin', 'User')
  description: string;    // Role description
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const roleAPI = {
  // Get all roles
  getAllRoles: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/role`, config);
  },

  // Get role by ID
  getRoleById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/role/${id}`, config);
  },

  // Create a new role
  createRole: async (roleData: RoleData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/role`, roleData, config);
  },

  // Update role by ID
  updateRole: async (id: string, roleData: RoleData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/role/${id}`, roleData, config);
  },

  // Delete role by ID
  deleteRole: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/role/${id}`, config);
  },
};

export default roleAPI;
