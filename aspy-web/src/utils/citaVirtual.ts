// Citas virtuales: el enlace de la reunión que acompaña a una cita (vacío = la cita es presencial).
// Solo se aceptan enlaces https de una reunión de estos servicios; el servidor aplica la misma regla al
// guardar (Appointment::PLATAFORMAS_VIRTUALES y plataformaVirtual en aspy/app/Models/Appointment.php).
// Si cambias una lista, cambia las dos.
const PLATAFORMAS: { dominio: string; nombre: string; subdominios: boolean; rutas: string[] }[] = [
  // Zoom usa subdominios (us02web.zoom.us…); los demás, solo su dominio exacto
  { dominio: "zoom.us", nombre: "Zoom", subdominios: true, rutas: ["/j/", "/my/", "/s/", "/w/", "/wc/", "/meeting/"] },
  { dominio: "teams.microsoft.com", nombre: "Microsoft Teams", subdominios: false, rutas: ["/l/meetup-join/", "/meet/", "/v2/"] },
  { dominio: "teams.live.com", nombre: "Microsoft Teams", subdominios: false, rutas: ["/meet/"] },
  { dominio: "meet.google.com", nombre: "Google Meet", subdominios: false, rutas: ["/lookup/"] },
];

/** Google Meet: además, el código de la reunión va directo en la ruta (/abc-defg-hij). */
const CODIGO_DE_MEET = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/i;

// https, un dominio bien formado y, después, solo caracteres ASCII visibles sin los que un navegador
// podría leer de otra forma (\ " ' < > `): nada de espacios ni caracteres de control
const FORMA_DEL_ENLACE = /^https:\/\/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:[/?#][\x21\x23-\x26\x28-\x3B\x3D\x3F-\x5B\x5D-\x5F\x61-\x7E]*)?$/i;

export const AYUDA_ENLACE_VIRTUAL = "Pega el enlace de la reunión de Zoom, Microsoft Teams o Google Meet (empieza con https://).";

/**
 * Nombre del servicio ("Zoom", "Microsoft Teams" o "Google Meet") si el enlace es el de una reunión de
 * uno de los servicios aceptados; si no, null. La web solo muestra como enlace lo que pasa esta comprobación.
 */
export function plataformaVirtual(enlace: string | null | undefined): string | null {
  const texto = String(enlace ?? "").trim();
  if (!FORMA_DEL_ENLACE.test(texto)) return null;
  // Sin segmentos "." ni ".." en la ruta (tampoco como %2e): el navegador los resuelve y abriría otra página.
  // Se mira la ruta tal como se escribió, igual que el servidor (`new URL` la entrega ya resuelta).
  const rutaEscrita = texto.slice("https://".length).replace(/^[^/?#]*/, "").split(/[?#]/)[0];
  if (/(?:^|\/)(?:\.|%2e){1,2}(?:\/|$)/i.test(rutaEscrita)) return null;
  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
  const dominio = url.hostname.toLowerCase();
  const ruta = url.pathname.toLowerCase();
  const servicio = PLATAFORMAS.find((s) => dominio === s.dominio || (s.subdominios && dominio.endsWith(`.${s.dominio}`)));
  if (!servicio) return null;
  if (servicio.rutas.some((comienzo) => ruta.startsWith(comienzo))) return servicio.nombre;
  return servicio.dominio === "meet.google.com" && CODIGO_DE_MEET.test(ruta) ? servicio.nombre : null;
}
