declare const rolAPI: {
    getAllRoles: () => Promise<import("axios").AxiosResponse<any, any>>;
    getRolById: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createRol: (rolData: {
        nombre: string;
        descripcion?: string;
        permisos?: string[];
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    updateRol: (id: string, rolData: {
        nombre?: string;
        descripcion?: string;
        permisos?: string[];
    }) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default rolAPI;
