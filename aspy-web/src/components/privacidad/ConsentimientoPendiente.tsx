// Primer ingreso de una cuenta que creó la fundación (desde Admin o Secretaría): nadie aceptó la
// política de privacidad por esa persona, así que se le muestra aquí y no puede continuar hasta
// aceptarla (o cerrar sesión). Aplica a todos los roles. Va dentro de PrivateRoute.
import { useEffect, useState } from "react";
import consentimientoAPI from "@API/consentimientoAPI";
import { logout } from "@store";
import DialogoPolitica from "./DialogoPolitica";

export default function ConsentimientoPendiente() {
  const [pendiente, setPendiente] = useState(false);
  const [aceptando, setAceptando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    consentimientoAPI
      .pendiente()
      .then((p) => {
        if (vigente) setPendiente(p);
      })
      // Sin respuesta del servidor no se bloquea a nadie: se volverá a preguntar en el próximo ingreso
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const aceptar = async () => {
    setAceptando(true);
    setError("");
    try {
      await consentimientoAPI.aceptar();
      setPendiente(false);
    } catch {
      setError("No se pudo guardar tu aceptación. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setAceptando(false);
    }
  };

  const salir = async () => {
    await logout();
    window.location.assign("/login");
  };

  return (
    <DialogoPolitica
      open={pendiente}
      obligatorio
      textoCerrar="Cerrar sesión"
      onCerrar={salir}
      onAceptar={aceptar}
      aceptando={aceptando}
      error={error}
      aviso="Antes de continuar, lee y acepta la política de privacidad de la fundación. Se pide una sola vez."
    />
  );
}
