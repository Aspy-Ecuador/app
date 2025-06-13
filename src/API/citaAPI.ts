import axios from 'axios';
import apiURL from './apiConfig';

const citaAPI = {
    getCitaById: (id: string) =>
        axios.get(`${apiURL}/citas/${id}`),

    getCitasByPaciente: (id_paciente: string) =>
        axios.get(`${apiURL}/citas/paciente/${encodeURIComponent(id_paciente)}`),

    getCitasEntreFechas: (fechaInicio: string, fechaFin: string) =>
        axios.get(`${apiURL}/citas/entreFechas/${fechaInicio}/${fechaFin}`),

    getCitasByProfesional: (id_profesional: string) =>
        axios.get(`${apiURL}/citas/profesional/${encodeURIComponent(id_profesional)}`),

    getCitasByEstado: (estado: string) =>
        axios.get(`${apiURL}/citas/estado/${encodeURIComponent(estado)}`),
    
    getHistoriaClinicaByPaciente: (id_paciente: string) =>
        axios.get(`${apiURL}/citas/historiaClinica/paciente/${encodeURIComponent(id_paciente)}`),
    
    createCita: (citaData: {
        cedulaPaciente: string;
        profesional: string;
        servicio: string;
        tipoConsulta: string;
        fecha: string;
        horainicio: string;
        horafin: string;
    }) =>
        axios.post(`${apiURL}/citas`, citaData),

    //NO SE DEBE USAR AQUI SOLO ES PARA EL BACKEND
    updateEstadoCita: (id: string, estado: string) =>
    axios.put(`${apiURL}/citas/${id}`, { estado }),

};

export default citaAPI;
