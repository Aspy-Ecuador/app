// Lectura del contenido de la landing desde Sanity (dataset público, solo lectura).
// Sin dependencias: usa la API HTTP de Sanity con fetch. Solo devuelve documentos
// publicados (los borradores no se ven sin token, y aquí nunca se usa token).
import type { LandingContent } from "./types";

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const DATASET = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || "production";
const API_VERSION = "2025-02-19";

export const sanityEnabled = Boolean(PROJECT_ID);

// Proyección GROQ de una imagen → { src, alt } (mismo formato que LandingImage)
const IMG = `{ "src": asset->url, alt }`;

// Un documento único por sección (ver aspy-studio/schemaTypes/sections.ts); su _id es igual a su tipo.
// Todo se pide en una sola consulta y se arma con la forma de LandingContent.
const QUERY = `{
  "site": *[_id == "siteSettings"][0]{ logo${IMG} },
  "navigation": *[_id == "siteSettings"][0].navigation,
  "hero": *[_id == "heroSection"][0]{ ..., images[]${IMG} },
  "impact": *[_id == "impactSection"][0],
  "mission": *[_id == "missionSection"][0]{ ..., images[]${IMG} },
  "services": *[_id == "servicesSection"][0],
  "steps": *[_id == "stepsSection"][0],
  "testimonials": *[_id == "testimonialsSection"][0],
  "band": *[_id == "bandSection"][0]{ ..., images[]${IMG} },
  "support": *[_id == "supportSection"][0]{ ..., partners[]{ name, url, logo${IMG} } },
  "contact": *[_id == "contactSection"][0],
  "social": *[_id == "socialSection"][0],
  "footer": *[_id == "footerSection"][0]
}`;

/** Pide el contenido publicado. Devuelve null si no hay documento o falla la red. */
export async function fetchLandingContent(signal?: AbortSignal): Promise<unknown | null> {
  if (!PROJECT_ID) return null;
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const json = (await res.json()) as { result?: unknown };
  return json.result ?? null;
}

// ─── Mezcla con el contenido local ───────────────────────────────

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Las imágenes de Sanity se piden redimensionadas y en el formato más liviano (WebP/AVIF). */
function optimizeImageUrl(src: string): string {
  return src.startsWith("https://cdn.sanity.io/") ? `${src}?w=1600&fit=max&auto=format&q=80` : src;
}

/** Quita los metadatos de Sanity (_key, _type…) y optimiza las URLs de imagen. */
function stripMeta(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripMeta);
  if (!isObject(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (k.startsWith("_")) continue;
    out[k] = k === "src" && typeof v === "string" ? optimizeImageUrl(v) : stripMeta(v);
  }
  return out;
}

/** Limpia una lista que viene de Sanity: quita imágenes sin archivo y metadatos (_key, _type). */
function cleanArray(remote: unknown[], sample: unknown): unknown[] {
  return remote
    .filter((item) => !(isObject(sample) && "src" in sample) || (isObject(item) && typeof item.src === "string"))
    .map((item) => (isObject(item) && isObject(sample) ? merge(sample, item, true) : stripMeta(item)));
}

/**
 * Mezcla `remote` sobre `base` siguiendo la forma de `base`:
 * - Campos ausentes o null en Sanity → se usa el valor local.
 * - Listas presentes en Sanity (aunque estén vacías) → mandan las de Sanity,
 *   así los editores pueden vaciar una sección para ocultarla.
 * - Imágenes sin archivo subido → se usa la local.
 */
function merge<T>(base: T, remote: unknown, isArrayItem = false): T {
  if (remote === null || remote === undefined) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(remote)) return base;
    return cleanArray(remote, base[0]) as T;
  }

  if (isObject(base)) {
    if (!isObject(remote)) return base;
    // Imagen: solo se reemplaza si en Sanity tiene archivo
    if ("src" in base) {
      if (typeof remote.src !== "string") return base;
      return { ...base, src: optimizeImageUrl(remote.src), alt: typeof remote.alt === "string" ? remote.alt : "" } as T;
    }
    const out: Record<string, unknown> = {};
    // En elementos de listas se aceptan campos opcionales que el ejemplo no tiene (role, url, logo…)
    const keys = isArrayItem ? new Set([...Object.keys(base), ...Object.keys(remote)]) : Object.keys(base);
    for (const key of keys) {
      if (key.startsWith("_")) continue;
      const b = (base as Record<string, unknown>)[key];
      const r = remote[key];
      out[key] = b === undefined ? stripMeta(r) : merge(b, r);
    }
    return out as T;
  }

  // Valores simples: se respeta el tipo esperado
  return typeof remote === typeof base ? (remote as T) : base;
}

/** Máximos de cada lista (los mismos que valida el Studio en aspy-studio/schemaTypes/sections.ts). */
export const LIST_LIMITS = {
  heroImages: 8,
  chips: 3,
  stats: 4,
  paragraphs: 4,
  missionImages: 3,
  bandImages: 10,
  services: 9,
  steps: 4,
  testimonials: 6,
  partners: 12,
  donationDetails: 6,
  social: 6,
} as const;

/** Recorta las listas por si llega contenido que no pasó por las validaciones del Studio. */
function applyLimits(c: LandingContent): LandingContent {
  const L = LIST_LIMITS;
  return {
    ...c,
    hero: { ...c.hero, images: c.hero.images.slice(0, L.heroImages), chips: c.hero.chips.slice(0, L.chips) },
    impact: { ...c.impact, stats: c.impact.stats.slice(0, L.stats) },
    mission: { ...c.mission, paragraphs: c.mission.paragraphs.slice(0, L.paragraphs), images: c.mission.images.slice(0, L.missionImages) },
    services: { ...c.services, items: c.services.items.slice(0, L.services) },
    steps: { ...c.steps, items: c.steps.items.slice(0, L.steps) },
    testimonials: { ...c.testimonials, items: c.testimonials.items.slice(0, L.testimonials) },
    band: { ...c.band, images: c.band.images.slice(0, L.bandImages) },
    support: {
      ...c.support,
      partners: c.support.partners.slice(0, L.partners),
      donation: { ...c.support.donation, details: c.support.donation.details.slice(0, L.donationDetails) },
    },
    social: c.social.slice(0, L.social),
  };
}

// Redes: en Sanity hay un campo fijo por red; solo se muestran las que tienen enlace (en este orden)
const SOCIAL_FIELDS = [
  { key: "instagram", network: "instagram", label: "Instagram" },
  { key: "instagramBand", network: "instagram", label: "Instagram" },
  { key: "facebook", network: "facebook", label: "Facebook" },
  { key: "tiktok", network: "tiktok", label: "TikTok" },
  { key: "youtube", network: "youtube", label: "YouTube" },
] as const;

/** Convierte el documento de redes de Sanity en la lista que usa la web. */
function normalizeSocial(remote: unknown): unknown {
  if (!isObject(remote) || !isObject(remote.social)) return remote;
  const doc = remote.social;
  const social = SOCIAL_FIELDS.flatMap(({ key, network, label }) => {
    const field = doc[key];
    if (!isObject(field) || typeof field.url !== "string" || !field.url.trim()) return [];
    return [{ network, label: typeof field.label === "string" && field.label.trim() ? field.label : label, url: field.url }];
  });
  return { ...remote, social };
}

export function mergeLandingContent(base: LandingContent, remote: unknown): LandingContent {
  return applyLimits(merge(base, normalizeSocial(remote)));
}

// ─── Caché local (evita mostrar el contenido viejo en cada visita) ──
const CACHE_KEY = "aspy-landing-content-v1";

export function readCachedRemote(): unknown | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function writeCachedRemote(remote: unknown): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(remote));
  } catch {
    // Sin espacio o almacenamiento bloqueado: no es crítico
  }
}
