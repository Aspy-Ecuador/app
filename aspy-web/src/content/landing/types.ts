// Modelo de contenido de la landing.
// Es el contrato entre el diseño y el CMS: hoy se llena con `defaultContent.ts`
// y al conectar Sanity el esquema del Studio debe tener esta misma forma.
// Regla: listas vacías o textos vacíos = la sección/elemento no se muestra.

export interface LandingImage {
  src: string;
  alt: string;
}

export interface LandingLink {
  label: string;
  href: string;
}

/** Íconos disponibles para servicios (se eligen por nombre desde el CMS). */
export type ServiceIconName =
  | "accessibility"
  | "heart"
  | "school"
  | "handshake"
  | "groups"
  | "music"
  | "psychology"
  | "family";

/** Color de acento de la marca. */
export type Accent = "blue" | "pink" | "yellow";

export type SocialNetwork = "instagram" | "facebook" | "tiktok" | "youtube" | "linkedin";

/** Secciones del menú (claves sin guiones: así las exige Sanity; el ancla HTML está en NAV_ITEMS). */
export type NavSectionId = "nosotros" | "servicios" | "comoAgendar" | "aspyband" | "contacto";

export interface LandingContent {
  site: {
    /** Logo del navbar y el footer. */
    logo: LandingImage;
  };
  navigation: {
    labels: Record<NavSectionId, string>;
    loginLabel: string;
    ctaLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    /** Palabra del título que va con degradado (debe estar dentro de `title`). */
    highlight: string;
    tagline: string;
    description: string;
    /** Fotos del collage (se van turnando). Con 1 foto se muestra fija. */
    images: LandingImage[];
    /** Segundos entre cada cambio de fotos del collage. */
    rotationSeconds: number;
    /** Etiquetas cortas que flotan sobre las fotos. */
    chips: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    socialLabel: string;
  };
  impact: {
    /** Cifras reales, p. ej. { value: "+500", label: "familias acompañadas" }. */
    stats: { value: string; label: string }[];
  };
  mission: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    images: LandingImage[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      icon: ServiceIconName;
      accent: Accent;
      title: string;
      description: string;
    }[];
  };
  steps: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
    ctaLabel: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: { quote: string; author: string; role?: string }[];
  };
  band: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    image: LandingImage;
    link: LandingLink;
  };
  support: {
    eyebrow: string;
    title: string;
    subtitle: string;
    partners: { name: string; logo?: LandingImage; url?: string }[];
    donation: {
      title: string;
      description: string;
      /** Datos para donar, p. ej. { label: "Banco", value: "…" }. */
      details: { label: string; value: string }[];
      cta?: LandingLink;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    /** Número en formato internacional sin "+" ni espacios, p. ej. 593991234567. */
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
    schedule: string;
    /** Enlace a Google Maps. */
    mapUrl: string;
    whatsappCtaLabel: string;
  };
  social: { network: SocialNetwork; label: string; url: string }[];
  footer: {
    description: string;
    navTitle: string;
    contactTitle: string;
    location: string;
    loginLabel: string;
  };
}
