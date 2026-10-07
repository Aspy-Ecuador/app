// FINAL
import axios from "axios";
import apiURL from "./apiConfig";

const api = axios.create({
  baseURL: apiURL,
  // Laravel responde errores (401, 403, 422) como JSON en vez de redirigir
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token vencido o inválido, o cuenta deshabilitada por el administrador:
// se cierra la sesión local y se vuelve al login (con el motivo, si lo hay)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/login");
    const status = error.response?.status;
    const deshabilitada = status === 403 && error.response?.data?.code === "cuenta_deshabilitada";
    if ((status === 401 || deshabilitada) && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("authenticatedUser");
      if (window.location.pathname !== "/login") {
        window.location.href = deshabilitada ? "/login?motivo=deshabilitada" : "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
