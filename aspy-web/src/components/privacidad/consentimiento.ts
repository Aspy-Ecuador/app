// Estado de las casillas del consentimiento y cuándo está completo (ver CasillasConsentimiento).
import { EDAD_PARA_CONSENTIR, type Consentimiento, type Declaracion } from "@/config/politica";

/** Menor de 15: "obligatorio" · de 15 a 17: "opcional" (elige quién consiente) · adulto o personal: "no". */
export type ModoRepresentante = "obligatorio" | "opcional" | "no";

export interface EstadoConsentimiento {
  marcadas: Declaracion[];
  quien: "" | "titular" | "representante";
  nombre: string;
  identificacion: string;
}

export const CONSENTIMIENTO_VACIO: EstadoConsentimiento = { marcadas: [], quien: "", nombre: "", identificacion: "" };

const IDENTIFICACION = /^[A-Za-z0-9]{5,20}$/;

/** Según la edad de la persona dueña de la cuenta (solo pacientes; el personal siempre es "no"). */
export function modoRepresentante(edad: number | null): ModoRepresentante {
  if (edad === null || edad >= 18) return "no";
  return edad < EDAD_PARA_CONSENTIR ? "obligatorio" : "opcional";
}

export function daElRepresentante(estado: EstadoConsentimiento, modo: ModoRepresentante): boolean {
  return modo === "obligatorio" || (modo === "opcional" && estado.quien === "representante");
}

/** El consentimiento listo para enviar, o `null` mientras falte algo. */
export function armarConsentimiento(estado: EstadoConsentimiento, declaraciones: Declaracion[], modo: ModoRepresentante): Consentimiento | null {
  if (!declaraciones.every((d) => estado.marcadas.includes(d))) return null;
  if (modo === "opcional" && !estado.quien) return null;
  if (!daElRepresentante(estado, modo)) return { declaraciones, representante: null };
  const nombre = estado.nombre.trim();
  const identificacion = estado.identificacion.trim();
  if (nombre.length < 5 || !IDENTIFICACION.test(identificacion)) return null;
  return { declaraciones, representante: { nombre, identificacion } };
}

/** Qué le falta a la persona para poder aceptar (texto corto para el botón). */
export function queFalta(estado: EstadoConsentimiento, declaraciones: Declaracion[], modo: ModoRepresentante): string {
  if (modo === "opcional" && !estado.quien) return "Indica quién consiente";
  if (daElRepresentante(estado, modo) && armarConsentimiento({ ...estado, marcadas: declaraciones }, declaraciones, modo) === null) return "Completa los datos de quien autoriza";
  return "Marca las casillas";
}
