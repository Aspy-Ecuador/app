// Subida y lectura de comprobantes y reportes (archivos privados del servidor).
import { useEffect, useState } from "react";
import axios from "axios";
import archivoAPI, { esArchivoPrivado, type TipoArchivo } from "@API/archivoAPI";
import type { FileData } from "@/types/FileData";

/** Igual que el máximo del servidor (ArchivoPrivadoController::MAX_KB). */
const MAX_BYTES = 8 * 1024 * 1024;
/** Lado más largo de una foto al subirla: suficiente para leer un comprobante sin guardar 5 MB. */
const LADO_MAX = 1800;

/** Achica las fotos antes de subirlas (las del celular pesan varios MB). Los PDF no se tocan. */
async function achicarImagen(archivo: File): Promise<File> {
  if (!archivo.type.startsWith("image/") || archivo.size < 400 * 1024) return archivo;
  try {
    const imagen = await createImageBitmap(archivo);
    const escala = Math.min(1, LADO_MAX / Math.max(imagen.width, imagen.height));
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.round(imagen.width * escala);
    lienzo.height = Math.round(imagen.height * escala);
    const ctx = lienzo.getContext("2d");
    if (!ctx) return archivo;
    // Fondo blanco: un PNG transparente pasado a JPG quedaría negro
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
    imagen.close();
    const blob = await new Promise<Blob | null>((listo) => lienzo.toBlob(listo, "image/jpeg", 0.82));
    if (!blob || blob.size >= archivo.size) return archivo;
    return new File([blob], archivo.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return archivo; // formato que el navegador no sabe dibujar: se sube tal cual y decide el servidor
  }
}

/** Sube un comprobante o un reporte y devuelve la referencia para crear la cita o el reporte. */
export async function subirArchivo(datos: FileData, tipo: TipoArchivo): Promise<string> {
  const original = datos.file;
  if (!(original instanceof File)) throw new Error("Falta el archivo.");
  const esPdf = original.type === "application/pdf";
  if (tipo === "reporte" && !esPdf) throw new Error("El reporte debe ser un PDF.");
  if (!esPdf && !original.type.startsWith("image/")) throw new Error("Solo se aceptan imágenes o archivos PDF.");

  const archivo = await achicarImagen(original);
  if (archivo.size > MAX_BYTES) throw new Error("El archivo pesa demasiado (máximo 8 MB).");

  try {
    return await archivoAPI.subir(archivo, tipo);
  } catch (error) {
    throw new Error(mensajeDeError(error, "No se pudo subir el archivo. Intenta de nuevo."));
  }
}

/** Mensaje del servidor (422/403) o uno general. */
export function mensajeDeError(error: unknown, general: string): string {
  if (axios.isAxiosError(error)) {
    const datos = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    const primero = datos?.errors ? Object.values(datos.errors)[0]?.[0] : undefined;
    if (error.response?.status === 413) return "El archivo pesa demasiado (máximo 8 MB).";
    return primero ?? datos?.message ?? general;
  }
  return error instanceof Error && error.message ? error.message : general;
}

const ES_IMAGEN = /\.(png|jpe?g|webp|gif)(\?|#|$)/i;

export interface ArchivoListo {
  /** Dirección para `<img>`, `<iframe>` o descargar. Vacía mientras carga o si no hay archivo. */
  url: string;
  esImagen: boolean;
  cargando: boolean;
  error: string;
}

/**
 * Deja listo para mostrar un comprobante o un reporte. Los archivos privados se piden con la sesión
 * y se muestran desde la memoria del navegador; los enlaces viejos (http) se usan tal cual.
 */
export function useArchivo(referencia?: string | null): ArchivoListo {
  const privado = esArchivoPrivado(referencia) ? referencia : null;
  // Resultado de la última descarga; solo vale si es de la referencia que se está mostrando
  const [descargado, setDescargado] = useState<{ de: string; url: string; esImagen: boolean; error: string } | null>(null);

  useEffect(() => {
    if (!privado) return;
    let vigente = true;
    let url = "";
    archivoAPI
      .descargar(privado)
      .then((blob) => {
        if (!vigente) return;
        url = URL.createObjectURL(blob);
        setDescargado({ de: privado, url, esImagen: blob.type.startsWith("image/"), error: "" });
      })
      .catch((error) => {
        if (!vigente) return;
        const sinPermiso = axios.isAxiosError(error) && error.response?.status === 403;
        setDescargado({
          de: privado,
          url: "",
          esImagen: false,
          error: sinPermiso ? "No tienes permiso para ver este archivo." : "No se pudo abrir el archivo. Intenta de nuevo.",
        });
      });

    return () => {
      vigente = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [privado]);

  if (!referencia) return { url: "", esImagen: false, cargando: false, error: "" };
  if (!privado) return { url: referencia, esImagen: ES_IMAGEN.test(referencia), cargando: false, error: "" };
  if (descargado?.de !== privado) return { url: "", esImagen: false, cargando: true, error: "" };
  return { url: descargado.url, esImagen: descargado.esImagen, cargando: false, error: descargado.error };
}

const EXTENSIONES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Descarga un comprobante o un reporte con el nombre indicado (sin extensión). */
export async function descargarArchivo(referencia: string, nombre: string): Promise<void> {
  const blob = esArchivoPrivado(referencia)
    ? await archivoAPI.descargar(referencia)
    : await fetch(referencia).then((r) => {
        if (!r.ok) throw new Error("No se pudo descargar");
        return r.blob();
      });
  const extension = EXTENSIONES[blob.type] ?? (referencia.match(/\.(pdf|png|jpe?g|webp)(\?|#|$)/i)?.[1] ?? "");
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = extension ? `${nombre}.${extension}` : nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
