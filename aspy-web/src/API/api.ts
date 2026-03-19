// FINAL
import axios from "axios";
import apiURL from "./apiConfig";

const api = axios.create({
  baseURL: apiURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
