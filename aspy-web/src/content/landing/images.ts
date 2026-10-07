// Imágenes de Sanity al tamaño justo: el navegador elige el ancho según la pantalla
// (srcSet + sizes) y Sanity entrega WebP/AVIF comprimido. Las imágenes locales se dejan igual.

const SANITY_CDN = "https://cdn.sanity.io/";

/** Escalones de ancho compartidos por todas las fotos (pocos y espaciados, para reutilizar la caché). */
export const PHOTO_WIDTHS = [400, 800, 1200, 1600];

/** Ancho original de una imagen de Sanity (viene en el nombre: image-<id>-<ancho>x<alto>.<ext>). */
function originalWidth(src: string): number | null {
  const m = src.split("?")[0].match(/-(\d+)x\d+\.[a-z]+$/i);
  return m ? Number(m[1]) : null;
}

/** URL de una imagen de Sanity con el ancho pedido (las locales no cambian). */
export function sanityUrl(src: string, width: number, quality = 75): string {
  if (!src.startsWith(SANITY_CDN)) return src;
  return `${src.split("?")[0]}?w=${width}&fit=max&auto=format&q=${quality}`;
}

/**
 * Props para <img>: `src` de respaldo, `srcSet` con varios anchos y `sizes`
 * (cuánto ocupa la imagen en pantalla), para que nunca se descargue más de lo necesario.
 * Nunca pide más que el ancho original: así, cuando varias secciones necesitan la foto
 * completa, comparten la misma URL y el navegador la descarga una sola vez.
 */
export function responsiveImg(
  src: string,
  sizes: string,
  widths: number[] = PHOTO_WIDTHS,
): { src: string; srcSet?: string; sizes?: string } {
  if (!src.startsWith(SANITY_CDN)) return { src };
  const max = originalWidth(src) ?? Infinity;
  const steps = [...new Set(widths.map((w) => Math.min(w, max)))].sort((a, b) => a - b);
  return {
    src: sanityUrl(src, steps[Math.min(1, steps.length - 1)]),
    srcSet: steps.map((w) => `${sanityUrl(src, w)} ${w}w`).join(", "),
    sizes,
  };
}
