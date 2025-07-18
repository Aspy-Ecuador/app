declare const usuarioAPI: {
    getAllUsuarios: () => Promise<import("axios").AxiosResponse<any, any>>;
    getUsuarioById: (id: string) => Promise<import("axios").AxiosResponse<any, any>>;
    getUsuariosByRol: (rol: string) => Promise<import("axios").AxiosResponse<any, any>>;
    createUsuario: (usuarioData: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        cedula: string;
        rol: string;
        contrasena: string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
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
    }) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default usuarioAPI;
