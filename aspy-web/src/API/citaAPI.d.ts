declare const citaAPI: {
    getCitaById: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getCitasByPaciente: (id_paciente: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getCitasEntreFechas: (fechaInicio: string, fechaFin: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getCitasByProfesional: (id_profesional: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getCitasByEstado: (estado: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getHistoriaClinicaByPaciente: (id_paciente: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createCita: (citaData: {
        cedulaPaciente: string;
        profesional: string;
        servicio: string;
        tipoConsulta: string;
        fecha: string;
        horainicio: string;
        horafin: string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    updateEstadoCita: (id: string, estado: string) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default citaAPI;
