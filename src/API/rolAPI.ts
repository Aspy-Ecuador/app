import axios from 'axios';
import apiURL from './apiConfig';

const rolAPI = {
    getAllRoles: () =>
        axios.get(`${apiURL}/roles`),

    getRolById: (id: string) =>
        axios.get(`${apiURL}/roles/${id}`),

    createRol: (rolData: { nombre: string, descripcion?: string, permisos?: string[] }) =>
        axios.post(`${apiURL}/roles`, rolData),

    updateRol: (id: string, rolData: { nombre?: string, descripcion?: string, permisos?: string[] }) =>
        axios.put(`${apiURL}/roles/${id}`, rolData),
};

export default rolAPI;