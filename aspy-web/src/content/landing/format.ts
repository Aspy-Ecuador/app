// Formatos para mostrar datos de contacto en la web.

/**
 * Muestra un número de Ecuador en el formato local que reconocen las personas.
 * En Sanity se guarda en formato internacional (lo necesita WhatsApp):
 *   593991234567 → 099 123 4567   (celular)
 *   59342345678  → 04 234 5678    (fijo)
 * Números de otros países o con otro formato se muestran tal cual.
 */
export function formatPhoneEc(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("593") ? `0${digits.slice(3)}` : digits;
  if (/^09\d{8}$/.test(local)) return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  if (/^0[2-7]\d{7}$/.test(local)) return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  return value.trim();
}

/** Enlace para llamar: siempre en formato internacional si es de Ecuador. */
export function telHref(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("593")) return `tel:+${digits}`;
  if (/^0\d{8,9}$/.test(digits)) return `tel:+593${digits.slice(1)}`;
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}
