declare const servicioAPI: {
    getAllServicios: () => Promise<import("axios").AxiosResponse<any, any>>;
    getServicioById: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createServicio: (servicioData: {
        nombre: string;
        descripcion: string;
        precio: number;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    updateServicio: (id: string, servicioData: {
        nombre?: string;
        descripcion?: string;
        precio?: number;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default servicioAPI;
