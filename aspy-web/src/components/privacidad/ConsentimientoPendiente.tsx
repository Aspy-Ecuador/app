// Primer ingreso de una cuenta que creó la fundación (desde Admin o Secretaría), o cuando cambió la
// política: nadie aceptó por esa persona, así que se le muestra aquí y no puede continuar hasta
// aceptarla (o cerrar sesión). Aplica a todos los roles. Va dentro de PrivateRoute.
import { useEffect, useState } from "react";
import consentimientoAPI, { type EstadoDelConsentimiento } from "@API/consentimientoAPI";
import { getAuthenticatedUserIdRole, logout } from "@store";
import { declaracionesPara, type Consentimiento } from "@/config/politica";
import DialogoPolitica from "./DialogoPolitica";

const ROL_CLIENTE = 3;

function esPaciente(): boolean {
  try {
    return getAuthenticatedUserIdRole() === ROL_CLIENTE;
  } catch {
    return true; // sin datos del rol se piden las casillas del paciente; el servidor valida las que tocan
  }
}

export default function ConsentimientoPendiente() {
  const [estado, setEstado] = useState<EstadoDelConsentimiento | null>(null);
  const [aceptando, setAceptando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    consentimientoAPI
      .estado()
      .then((e) => {
        if (vigente) setEstado(e);
      })
      // Sin respuesta del servidor no se bloquea a nadie: se volverá a preguntar en el próximo ingreso
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const aceptar = async (consentimiento: Consentimiento) => {
    setAceptando(true);
    setError("");
    try {
      await consentimientoAPI.aceptar(consentimiento);
      setEstado((e) => (e ? { ...e, pendiente: false } : e));
    } catch {
      setError("No se pudo guardar tu aceptación. Revisa los datos y tu conexión, e inténtalo de nuevo.");
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
      open={estado?.pendiente === true}
      obligatorio
      textoCerrar="Cerrar sesión"
      onCerrar={salir}
      onAceptar={aceptar}
      declaraciones={estado?.declaraciones ?? declaracionesPara(esPaciente())}
      representante={estado?.representante ?? "no"}
      aceptando={aceptando}
      error={error}
      aviso="Antes de continuar, lee la política de privacidad de la fundación y marca las casillas del final. Se pide una sola vez (y de nuevo solo si la política cambia)."
    />
  );
}
