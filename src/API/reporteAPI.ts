import axios from "axios";
import apiURL from "./apiConfig";

const reporteAPI = {
  getReporteById: (id: string) => axios.get(`${apiURL}/reportes/${id}`),

  createReporte: (reporteData: {
    idPaciente: string;
    idProfesional: string;
    idCita: string;
    fecha: string;
    hora: string;
    comentarios: string;
    firma: string;
  }) => axios.post(`${apiURL}/reportes`, reporteData),

  //TODO VER QUE TAN NECESARIO ES TODO LO SIGUIENTE
  getReportesByPaciente: (nombre: string) =>
    axios.get(`${apiURL}/reportes/paciente/${encodeURIComponent(nombre)}`),

  getReportesEntreFechas: (fechaInicio: string, fechaFin: string) =>
    axios.get(
      `${apiURL}/reportes/entreFechas/${fechaInicio}/${fechaFin}`
    ),

  getReportesByProfesional: (profesional: string) =>
    axios.get(
      `${apiURL}/reportes/profesional/${encodeURIComponent(profesional)}`
    ),
};

export default reporteAPI;