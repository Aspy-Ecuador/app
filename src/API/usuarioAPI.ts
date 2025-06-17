import axios from 'axios';
import apiURL from './apiConfig';

const usuarioAPI = {
    getAllUsuarios: () =>
        axios.get(`${apiURL}/usuarios`),

    getUsuarioById: (id: string) =>
        axios.get(`${apiURL}/usuarios/${id}`),

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
    }) =>
        axios.post(`${apiURL}/usuarios`, usuarioData),

    updateUsuario: (id: string, usuarioData: {
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
    }) =>
        axios.put(`${apiURL}/usuarios/${id}`, usuarioData),
};

export default usuarioAPI;