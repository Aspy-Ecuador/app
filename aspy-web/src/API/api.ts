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

// Token vencido o inválido: se cierra la sesión local y se vuelve al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("authenticatedUser");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
