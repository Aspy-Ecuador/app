import axios from 'axios';
import apiURL from './apiConfig';

const pagoAPI = {
    getPagosByPaciente: (id: string) =>
        axios.get(`${apiURL}/pagos/paciente/${encodeURIComponent(id)}`),

    getPagoByCita: (citaId: string) =>
        axios.get(`${apiURL}/pagos/cita/${citaId}`),

    getPagosByEstado: (estado: string) =>
        axios.get(`${apiURL}/pagos/estado/${encodeURIComponent(estado)}`),

    getPagosByServicio: (servicioId: string) =>
        axios.get(`${apiURL}/pagos/servicio/${encodeURIComponent(servicioId)}`),

    createPago: (pagoData: {
        citaId: string;
        metodoPago: string;
        fechaPago: string;
        comprobante: string;
    }) =>
        axios.post(`${apiURL}/pagos`, pagoData),

    updateEstadoPago: (
        idCita: string,
        estado: string,
    ) =>
        axios.put(`${apiURL}/pagos/${idCita}`, { estado }),
};

export default pagoAPI;