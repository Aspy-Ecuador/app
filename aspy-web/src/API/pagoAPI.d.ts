declare const pagoAPI: {
    getPagosByPaciente: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getPagoByCita: (citaId: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getPagosByEstado: (estado: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getPagosByServicio: (servicioId: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createPago: (pagoData: {
        citaId: string;
        metodoPago: string;
        fechaPago: string;
        comprobante: string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    updateEstadoPago: (idCita: string, estado: string) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default pagoAPI;
