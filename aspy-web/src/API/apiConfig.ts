// apiConfig.ts

// Prioridad absoluta:
// 1. Variable de entorno en Vercel (VITE_API_URL) -> Ideal para producción en Railway
// 2. Fallback local para cuando estemos desarrollando en nuestras máquina (localhost)
const rawUrl =
  (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000/api";

// Limpia cualquier barra diagonal '/' al final por seguridad
const apiURL = rawUrl.replace(/\/$/, "");

export default apiURL;
