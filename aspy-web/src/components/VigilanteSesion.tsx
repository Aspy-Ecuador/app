// Revisa la sesión cada minuto y al volver a la pestaña. Si el administrador deshabilitó la
// cuenta (o el token venció), el interceptor de API/api.ts cierra la sesión y lleva al login
// con el aviso. Sin esto, alguien con la pantalla abierta seguiría viendo los datos ya cargados.
import { useEffect } from "react";
import api from "@API/api";

const CADA_MS = 60_000;

export default function VigilanteSesion() {
  useEffect(() => {
    const revisar = () => {
      if (document.visibilityState === "visible") api.get("/sesion").catch(() => {});
    };
    const id = window.setInterval(revisar, CADA_MS);
    document.addEventListener("visibilitychange", revisar);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", revisar);
    };
  }, []);

  return null;
}
