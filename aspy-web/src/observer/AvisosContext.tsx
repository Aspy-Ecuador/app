/* eslint-disable react-refresh/only-export-components */
// Avisos de la cuenta con sesión y lo que tiene por revisar. Se consultan al entrar, al cambiar de pantalla,
// cada minuto y al volver a la pestaña (el servidor no empuja nada: la web pregunta).
// Cuando llega algo nuevo, se vuelven a pedir las citas, los pagos y los horarios: así el calendario y las
// listas ya muestran lo que el aviso cuenta, sin recargar la página.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import avisosAPI from "@API/avisosAPI";
import type { Aviso, Pendiente, ResumenDeAvisos } from "@/typesResponse/Aviso";
import { useRoleData } from "@/observer/RoleDataContext";

const CADA_MS = 60_000;

interface AvisosContextType {
  avisos: Aviso[];
  sinLeer: number;
  pendientes: Pendiente[];
  /** Lo que muestra el contador del menú: avisos sin leer más lo que a la cuenta le toca resolver. */
  porAtender: number;
  /** false hasta la primera respuesta del servidor. */
  listo: boolean;
  recargar: () => Promise<void>;
  /** Marca como leídos los avisos indicados; sin lista, todos. */
  marcarLeidos: (ids?: number[]) => Promise<void>;
  /** El aviso que acaba de llegar con la pantalla abierta (para el globo); null si no hay o ya se cerró. */
  recienLlegado: Aviso | null;
  cerrarRecienLlegado: () => void;
}

const VACIO: ResumenDeAvisos = { avisos: [], sin_leer: 0, pendientes: [] };

const AvisosContext = createContext<AvisosContextType>({
  avisos: [],
  sinLeer: 0,
  pendientes: [],
  porAtender: 0,
  listo: false,
  recargar: async () => {},
  marcarLeidos: async () => {},
  recienLlegado: null,
  cerrarRecienLlegado: () => {},
});

const firmaDe = (pendientes: Pendiente[]) => pendientes.map((p) => `${p.clave}:${p.cantidad}`).join("|");

export function AvisosProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const datos = useRoleData();
  const [resumen, setResumen] = useState<ResumenDeAvisos>(VACIO);
  const [listo, setListo] = useState(false);
  const [recienLlegado, setRecienLlegado] = useState<Aviso | null>(null);

  // Las funciones de RoleDataContext cambian en cada render: se guardan aparte para no reiniciar la consulta
  const datosRef = useRef(datos);
  useEffect(() => {
    datosRef.current = datos;
  });
  const conocidos = useRef<Set<number> | null>(null);
  const firma = useRef<string | null>(null);

  const recargar = useCallback(async () => {
    let nuevo: ResumenDeAvisos;
    try {
      nuevo = await avisosAPI.listar();
    } catch {
      return; // sin conexión o sesión cerrada (de eso se encarga API/api.ts): se reintenta en la próxima vuelta
    }

    const antes = conocidos.current;
    const llegaron = antes ? nuevo.avisos.filter((a) => !a.leido && !antes.has(a.aviso_id)) : [];
    const cambioLoPendiente = firma.current !== null && firma.current !== firmaDe(nuevo.pendientes);
    conocidos.current = new Set(nuevo.avisos.map((a) => a.aviso_id));
    firma.current = firmaDe(nuevo.pendientes);

    setResumen(nuevo);
    setListo(true);

    if (llegaron.length > 0 || cambioLoPendiente) {
      const d = datosRef.current;
      // Solo lo que este rol ya tiene cargado
      if ("appointments" in d.data) void d.refreshAppointments();
      if ("payments" in d.data) void d.refreshPayments();
      if ("workerProfessional" in d.data) void d.refreshWorkerProfessional();
      if ("appointmentReports" in d.data && llegaron.some((a) => a.tipo === "reporte_listo")) void d.refreshAppointmentReports();
    }
    if (llegaron.length > 0) setRecienLlegado(llegaron[0]);
  }, []);

  // Al entrar y al cambiar de pantalla (después de aprobar un pago, por ejemplo, el contador ya baja)
  useEffect(() => {
    const id = window.setTimeout(() => void recargar(), 0);
    return () => window.clearTimeout(id);
  }, [pathname, recargar]);

  useEffect(() => {
    const revisar = () => {
      if (document.visibilityState === "visible") void recargar();
    };
    const id = window.setInterval(revisar, CADA_MS);
    document.addEventListener("visibilitychange", revisar);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", revisar);
    };
  }, [recargar]);

  const marcarLeidos = useCallback(async (ids?: number[]) => {
    // La pantalla cambia de inmediato; el servidor confirma después
    setResumen((r) => {
      const avisos = r.avisos.map((a) => (!ids || ids.includes(a.aviso_id) ? { ...a, leido: true } : a));
      const marcados = r.avisos.filter((a) => !a.leido && (!ids || ids.includes(a.aviso_id))).length;
      return { ...r, avisos, sin_leer: ids ? Math.max(0, r.sin_leer - marcados) : 0 };
    });
    setRecienLlegado((a) => (a && (!ids || ids.includes(a.aviso_id)) ? null : a));
    try {
      const { sin_leer } = await avisosAPI.marcarLeidos(ids);
      setResumen((r) => ({ ...r, sin_leer }));
    } catch {
      void recargar(); // no se pudo: la pantalla vuelve a lo que diga el servidor
    }
  }, [recargar]);

  const cerrarRecienLlegado = useCallback(() => setRecienLlegado(null), []);

  const valor = useMemo<AvisosContextType>(
    () => ({
      avisos: resumen.avisos,
      sinLeer: resumen.sin_leer,
      pendientes: resumen.pendientes,
      porAtender: resumen.sin_leer + resumen.pendientes.filter((p) => p.accion).reduce((n, p) => n + p.cantidad, 0),
      listo,
      recargar,
      marcarLeidos,
      recienLlegado,
      cerrarRecienLlegado,
    }),
    [resumen, listo, recargar, marcarLeidos, recienLlegado, cerrarRecienLlegado],
  );

  return <AvisosContext.Provider value={valor}>{children}</AvisosContext.Provider>;
}

export const useAvisos = () => useContext(AvisosContext);
