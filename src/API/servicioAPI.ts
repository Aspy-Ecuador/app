import axios from 'axios';
import apiURL from './apiConfig';

const servicioAPI = {
    getAllServicios: () =>
        axios.get(`${apiURL}/servicios`),

    getServicioById: (id: string) =>
        axios.get(`${apiURL}/servicios/${id}`),

    createServicio: (servicioData: {
        nombre: string;
        descripcion: string;
        precio: number;
    }) =>
        axios.post(`${apiURL}/servicios`, servicioData),

    updateServicio: (id: string, servicioData: {
        nombre?: string;
        descripcion?: string;
        precio?: number;
    }) =>
        axios.put(`${apiURL}/servicios/${id}`, servicioData),
};

export default servicioAPI;