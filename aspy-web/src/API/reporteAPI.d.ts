declare const reporteAPI: {
    getReporteById: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createReporte: (reporteData: {
        idPaciente: string;
        idProfesional: string;
        idCita: string;
        fecha: string;
        hora: string;
        comentarios: string;
        firma: string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    getReportesByPaciente: (nombre: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getReportesEntreFechas: (fechaInicio: string, fechaFin: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getReportesByProfesional: (profesional: string) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default reporteAPI;
