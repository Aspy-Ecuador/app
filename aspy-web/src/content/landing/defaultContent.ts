// Contenido inicial de la landing (y respaldo si el CMS no responde).
// Los campos vacíos ocultan su sección: se llenan desde Sanity con datos reales.
import type { LandingContent } from "./types";
import bandaImg from "@/assets/landing/aspy-banda.webp";
import actividadesImg from "@/assets/landing/aspy-actividades.webp";
import inclusionImg from "@/assets/landing/aspy-inclusion.webp";
import comunidadImg from "@/assets/landing/aspy-comunidad.webp";
import logoImg from "@/assets/landing/logo-aspy.webp";

export const defaultLandingContent: LandingContent = {
  site: {
    logo: { src: logoImg, alt: "Fundación Aspy Ecuador · todo es posible" },
  },

  navigation: {
    labels: {
      nosotros: "Nosotros",
      servicios: "Servicios",
      comoAgendar: "Cómo agendar",
      aspyband: "ASPY Band",
      contacto: "Contacto",
    },
    loginLabel: "Ingresar",
    ctaLabel: "Agendar cita",
  },

  hero: {
    badge: "Fundación sin fines de lucro · Guayaquil, Ecuador",
    title: "Fundación Aspy",
    highlight: "Aspy",
    tagline: "Todo es posible",
    description:
      "Organización social dedicada a mejorar la calidad de vida de personas con discapacidad — especialmente dentro del espectro autista — a través del acompañamiento, la terapia y la inclusión.",
    images: [
      { src: bandaImg, alt: "Jóvenes de ASPY Band tocando música juntos" },
      { src: actividadesImg, alt: "Actividades de la fundación ASPY" },
      { src: comunidadImg, alt: "Comunidad ASPY reunida" },
      { src: inclusionImg, alt: "Momento de inclusión en ASPY" },
    ],
    rotationSeconds: 5,
    chips: ["Terapia", "Inclusión", "Arte"],
    primaryCtaLabel: "Agendar una cita",
    secondaryCtaLabel: "Conocer más",
    socialLabel: "Síguenos",
  },

  impact: {
    stats: [],
  },

  mission: {
    eyebrow: "Nuestra misión",
    title: "Inclusión, dignidad y oportunidad para todos",
    paragraphs: [
      "ASPY nació con el propósito de brindar atención integral a personas con discapacidad, especialmente a niños, adolescentes y jóvenes dentro del espectro autista (incluyendo Síndrome de Asperger), ofreciéndoles herramientas reales para desarrollar sus capacidades y participar plenamente en la sociedad.",
      "A través de alianzas con el Municipio de Guayaquil y otras instituciones, la fundación ejecuta programas de rehabilitación, arte, tecnología y capacitación que transforman vidas y fortalecen comunidades.",
    ],
    images: [
      { src: actividadesImg, alt: "Actividades de la fundación ASPY" },
      { src: inclusionImg, alt: "Momento de inclusión en ASPY" },
      { src: comunidadImg, alt: "Comunidad ASPY reunida" },
    ],
  },

  services: {
    eyebrow: "Qué hacemos",
    title: "Nuestros servicios",
    subtitle: "Programas pensados para cada etapa de la vida, con un enfoque humano e inclusivo.",
    items: [
      {
        icon: "accessibility",
        accent: "blue",
        title: "Atención y acompañamiento",
        description:
          "Seguimiento personalizado para personas con discapacidad, especialmente dentro del espectro autista.",
      },
      {
        icon: "heart",
        accent: "pink",
        title: "Terapia e inclusión",
        description:
          "Actividades terapéuticas diseñadas para fomentar la inclusión social y el bienestar emocional.",
      },
      {
        icon: "school",
        accent: "yellow",
        title: "Capacitación y habilidades",
        description:
          "Programas de desarrollo de habilidades, incluyendo arte, tecnología y formación laboral.",
      },
      {
        icon: "handshake",
        accent: "blue",
        title: "Alianzas institucionales",
        description:
          "Proyectos conjuntos con el Municipio de Guayaquil para rehabilitación y apoyo comunitario.",
      },
      {
        icon: "groups",
        accent: "pink",
        title: "Adultos mayores",
        description:
          "Servicios de bienestar social para adultos mayores y personas en situación de vulnerabilidad.",
      },
      {
        icon: "music",
        accent: "yellow",
        title: "Arte como terapia",
        description:
          "La música y las artes como herramientas de expresión, terapia e integración social.",
      },
    ],
  },

  steps: {
    eyebrow: "Cómo agendar",
    title: "Tu cita en tres pasos",
    subtitle: "Todo el proceso es en línea y nuestro equipo te acompaña en cada etapa.",
    items: [
      {
        title: "Crea tu cuenta",
        description: "Regístrate en línea con tus datos básicos. Solo lo haces una vez.",
      },
      {
        title: "Elige y agenda",
        description:
          "Selecciona el servicio, el profesional y el horario disponible, y sube tu comprobante de pago.",
      },
      {
        title: "Recibe la confirmación",
        description:
          "Nuestro equipo revisa tu pago y confirma la cita. Puedes verla y gestionarla desde tu panel.",
      },
    ],
    ctaLabel: "Crear mi cuenta",
  },

  testimonials: {
    eyebrow: "Testimonios",
    title: "Lo que dicen las familias",
    items: [],
  },

  band: {
    eyebrow: "Proyecto especial",
    title: "ASPY Band",
    highlight: "Band",
    description:
      "Un grupo musical formado íntegramente por jóvenes con Síndrome de Asperger. La música se convierte en terapia, en lenguaje común y en puente hacia la inclusión social. ASPY Band no solo toca — demuestra que el talento no tiene límites.",
    image: { src: bandaImg, alt: "ASPY Band ensayando" },
    link: { label: "Seguir a ASPY Band", href: "https://www.instagram.com/aspy_band/" },
  },

  support: {
    eyebrow: "Aliados",
    title: "Juntos llegamos más lejos",
    subtitle: "Trabajamos de la mano con instituciones que creen en la inclusión.",
    partners: [{ name: "Municipio de Guayaquil" }],
    donation: {
      title: "¿Quieres apoyar a la fundación?",
      description:
        "Tu aporte nos ayuda a sostener terapias, talleres y programas de inclusión para más familias.",
      details: [],
    },
  },

  contact: {
    title: "¿Listo para dar el primer paso?",
    subtitle: "Agenda tu cita en línea o escríbenos: te acompañamos durante todo el proceso.",
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    schedule: "",
    mapUrl: "",
    showMap: true,
    mapQuery: "",
    mapButtonLabel: "Abrir en Google Maps",
    mapTitle: "Visítanos",
    whatsappCtaLabel: "Escríbenos por WhatsApp",
    whatsappMessage: "Hola, quisiera más información sobre la Fundación Aspy.",
    whatsappFloatingButton: true,
    whatsappFloatingLabel: "¿Tienes dudas? Escríbenos",
  },

  social: [
    { network: "instagram", label: "@aspyecuador", url: "https://www.instagram.com/aspyecuador/" },
    { network: "instagram", label: "@aspy_band", url: "https://www.instagram.com/aspy_band/" },
  ],

  footer: {
    description:
      "Acompañamiento, terapia e inclusión para personas con discapacidad en Guayaquil, Ecuador.",
    navTitle: "Navegación",
    contactTitle: "Contacto",
    location: "Guayaquil, Ecuador",
    loginLabel: "Ingresar al sistema →",
  },
};
