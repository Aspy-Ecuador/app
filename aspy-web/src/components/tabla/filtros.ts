// Ayudantes de los filtros de las tablas (ver BarraFiltros.tsx). Todas las listas del sistema filtran
// en pantalla, sobre los datos que ya cargó el rol: pagos, recibos, usuarios, pacientes y servicios.
import { useCallback, useMemo, useState } from "react";
import { fechaLocal, hoyEcuador, sumarDias } from "@utils/utils";

/** Minúsculas y sin tildes, para comparar los textos como los escribe la gente ("jose" encuentra "José"). */
export const normalizar = (texto: unknown): string =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/**
 * true si TODAS las palabras de la búsqueda aparecen en alguno de los textos (en cualquier orden):
 * "ana perez" encuentra a "Ana María Pérez" y también por su correo o su número.
 */
export function coincide(busqueda: string, ...textos: unknown[]): boolean {
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return true;
  const donde = textos.map(normalizar).join(" ");
  return palabras.every((p) => donde.includes(p));
}

/** true si la fecha cae dentro del periodo (extremos incluidos). Un extremo vacío no limita. */
export function enPeriodo(fecha: string | Date | null | undefined, desde: string, hasta: string): boolean {
  if (!desde && !hasta) return true;
  // Un periodo escrito al revés (desde posterior a hasta) se entiende igual
  if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde];
  const dia = fechaLocal(fecha);
  if (!dia) return false;
  return (!desde || dia >= desde) && (!hasta || dia <= hasta);
}

/**
 * Periodos rápidos, contados desde el día de hoy en Ecuador (la semana va de lunes a domingo, igual
 * que en la agenda). Se calculan con fechas "AAAA-MM-DD", sin horas, para no depender del dispositivo.
 */
export const PERIODOS_RAPIDOS: { texto: string; rango: () => [desde: string, hasta: string] }[] = [
  {
    texto: "Hoy",
    rango: () => {
      const hoy = hoyEcuador();
      return [hoy, hoy];
    },
  },
  {
    texto: "Esta semana",
    rango: () => {
      const hoy = hoyEcuador();
      const [a, m, d] = hoy.split("-").map(Number);
      const diaDeSemana = new Date(Date.UTC(a, m - 1, d)).getUTCDay(); // 0 = domingo
      const lunes = sumarDias(hoy, -((diaDeSemana + 6) % 7));
      return [lunes, sumarDias(lunes, 6)];
    },
  },
  {
    texto: "Este mes",
    rango: () => {
      const hoy = hoyEcuador();
      const [a, m] = hoy.split("-").map(Number);
      const ultimo = new Date(Date.UTC(a, m, 0)).getUTCDate();
      return [`${hoy.slice(0, 8)}01`, `${hoy.slice(0, 8)}${String(ultimo).padStart(2, "0")}`];
    },
  },
];

/** Estado de los filtros de una tabla: valores de texto ("" = sin filtrar). */
export function useFiltros<T extends Record<string, string>>(inicial: T) {
  const [valores, setValores] = useState<T>(inicial);
  const cambiar = useCallback(<K extends keyof T>(campo: K, valor: string) => setValores((v) => ({ ...v, [campo]: valor })), []);
  const limpiar = useCallback(() => setValores(inicial), [inicial]);
  const hayFiltros = useMemo(() => Object.values(valores).some((v) => v !== ""), [valores]);
  return { valores, cambiar, limpiar, hayFiltros };
}

/** Opciones del filtro "Habilitado" de las listas de personas. */
export const OPCIONES_HABILITADO = [
  { value: "si", texto: "Habilitadas" },
  { value: "no", texto: "Deshabilitadas" },
];

/** true si la cuenta pasa el filtro de habilitado ("" = todos). */
export const pasaHabilitado = (filtro: string, habilitado: boolean): boolean => filtro === "" || (filtro === "si") === habilitado;
