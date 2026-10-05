// Un documento único por sección de la landing (cada uno aparece en la barra lateral del Studio).
// En conjunto replican `LandingContent` (aspy-web/src/content/landing/types.ts).
// Si cambias un campo aquí, cámbialo también allá y en la consulta de aspy-web/src/content/landing/sanity.ts.
import { defineArrayMember, defineField, defineType } from "sanity";
import type { ArrayRule, StringRule } from "sanity";
import { createElement } from "react";
// @sanity/icons v5: cada ícono se importa desde su propio módulo
import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";
import { BarChartIcon } from "@sanity/icons/BarChart";
import { UsersIcon } from "@sanity/icons/Users";
import { HeartIcon } from "@sanity/icons/Heart";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CommentIcon } from "@sanity/icons/Comment";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { ShareIcon } from "@sanity/icons/Share";
import { BlockContentIcon } from "@sanity/icons/BlockContent";

// ─── Ayudantes ───────────────────────────────────────────────────
const altField = defineField({
  name: "alt",
  title: "Texto alternativo",
  type: "string",
  description: "Describe la foto en pocas palabras (lo leen las personas con lectores de pantalla y Google).",
  validation: (r) => r.required().error("Describe la imagen"),
});

const image = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "image", options: { hotspot: true }, fields: [altField] });

const imageList = (name: string, title: string, description: string, min = 0, max = 10) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [altField] })],
    options: { layout: "grid" },
    validation: maxItems(max, "imágenes", min),
  });

const text = (name: string, title: string, description?: string, required = true, rows?: number, max?: number) =>
  defineField({
    name,
    title,
    description: max ? [description, `Máximo ${max} caracteres.`].filter(Boolean).join(" ") : description,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    // Reglas separadas para que cada una tenga su propio mensaje
    validation:
      required || max
        ? (r) => [
            ...(required ? [r.required().error("Este campo es obligatorio")] : []),
            ...(max ? [r.max(max).error(`Máximo ${max} caracteres`)] : []),
          ]
        : undefined,
  });

/**
 * Íconos disponibles (los mismos que conoce la web en SERVICE_ICONS).
 * En el Studio se muestran con un emoji para reconocerlos; en la web se dibuja
 * el ícono equivalente con el estilo del sitio.
 */
const ICONS: { value: string; emoji: string; title: string }[] = [
  { value: "heart", emoji: "❤️", title: "Corazón" },
  { value: "person", emoji: "🧑", title: "Persona" },
  { value: "groups", emoji: "👥", title: "Personas" },
  { value: "family", emoji: "👨‍👩‍👧", title: "Familia" },
  { value: "child", emoji: "🧒", title: "Niños" },
  { value: "chart", emoji: "📊", title: "Estadística" },
  { value: "growth", emoji: "📈", title: "Crecimiento" },
  { value: "calendar", emoji: "📅", title: "Calendario" },
  { value: "star", emoji: "⭐", title: "Estrella" },
  { value: "trophy", emoji: "🏆", title: "Trofeo" },
  { value: "school", emoji: "🎓", title: "Educación" },
  { value: "psychology", emoji: "🧠", title: "Psicología" },
  { value: "health", emoji: "🩺", title: "Salud" },
  { value: "accessibility", emoji: "♿", title: "Accesibilidad" },
  { value: "handshake", emoji: "🤝", title: "Alianza" },
  { value: "volunteer", emoji: "🙌", title: "Voluntariado" },
  { value: "music", emoji: "🎵", title: "Música" },
  { value: "smile", emoji: "😊", title: "Sonrisa" },
  { value: "home", emoji: "🏠", title: "Hogar" },
  { value: "world", emoji: "🌎", title: "Comunidad" },
];
const ICON_OPTIONS = ICONS.map(({ value, emoji, title }) => ({ value, title: `${emoji}  ${title}` }));
const ICON_EMOJI: Record<string, string> = Object.fromEntries(ICONS.map(({ value, emoji }) => [value, emoji]));

/** Muestra el emoji del ícono elegido en las listas del Studio. */
const emojiMedia = (icon?: string) => () =>
  createElement("span", { style: { fontSize: 22, lineHeight: 1 } }, ICON_EMOJI[icon ?? ""] ?? "✨");

/** Campo de ícono: opciones a la vista (no en un desplegable). */
const iconField = (description?: string, required = false) =>
  defineField({
    name: "icon",
    title: required ? "Ícono" : "Ícono (opcional)",
    description,
    type: "string",
    options: { list: ICON_OPTIONS, layout: "radio", direction: "horizontal" },
    ...(required ? { initialValue: "heart", validation: (r: StringRule) => r.required().error("Elige un ícono") } : {}),
  });

/** Límite de elementos de una lista, con mensaje claro para la fundación. */
const maxItems = (max: number, what: string, min = 0) => (r: ArrayRule<unknown[]>) => [
  ...(min ? [r.min(min).error(`Mínimo ${min} ${min === 1 ? what.replace(/es$|s$/, "") : what}`)] : []),
  r.max(max).error(`Máximo ${max} ${what}`),
];

/** Documento único de sección: título fijo en la vista previa. */
const section = (
  name: string,
  title: string,
  icon: typeof HomeIcon,
  fields: ReturnType<typeof defineField>[],
  description?: string,
) =>
  defineType({
    name,
    title,
    description,
    type: "document",
    icon,
    fields,
    preview: { prepare: () => ({ title }) },
  });

// ─── Secciones ───────────────────────────────────────────────────
export const siteSettings = section("siteSettings", "Ajustes generales", CogIcon, [
  image("logo", "Logo", "Se muestra en el menú superior y en el pie de página. Ideal: PNG con fondo transparente."),
  defineField({
    name: "navigation",
    title: "Menú superior",
    type: "object",
    fields: [
      defineField({
        name: "labels",
        title: "Textos del menú",
        type: "object",
        fields: [
          text("nosotros", "Nosotros"),
          text("servicios", "Servicios"),
          text("comoAgendar", "Cómo agendar"),
          text("aspyband", "ASPY Band"),
          text("contacto", "Contacto"),
        ],
      }),
      text("loginLabel", "Botón de ingreso", "Ej.: Ingresar"),
      text("ctaLabel", "Botón principal del menú", "Ej.: Agendar cita"),
    ],
  }),
]);

export const heroSection = section("heroSection", "Portada", HomeIcon, [
  text("badge", "Etiqueta superior", "Ej.: Fundación sin fines de lucro · Guayaquil, Ecuador", true, undefined, 70),
  text("title", "Título", undefined, true, undefined, 40),
  defineField({
    name: "highlight",
    title: "Palabra destacada",
    description: "Parte del título que va con degradado de colores. Debe estar escrita igual que en el título.",
    type: "string",
    validation: (r) =>
      r.custom((value, ctx) => {
        const title = (ctx.document as { title?: string } | undefined)?.title ?? "";
        return !value || title.includes(value) ? true : "Debe ser parte del título";
      }),
  }),
  text("tagline", "Lema", "Ej.: Todo es posible", false, undefined, 40),
  text("description", "Descripción", undefined, true, 4, 320),
  imageList(
    "images",
    "Fotos del collage",
    "Se muestran 3 a la vez y se van turnando. Sube entre 3 y 8 fotos horizontales o cuadradas.",
    1,
    8,
  ),
  defineField({
    name: "rotationSeconds",
    title: "Segundos entre cambios de foto",
    type: "number",
    initialValue: 5,
    validation: (r) => r.min(2).max(30),
  }),
  defineField({
    name: "chips",
    title: "Etiquetas sobre las fotos",
    description: "Hasta 3 palabras cortas. Ej.: Terapia, Inclusión, Arte",
    type: "array",
    of: [defineArrayMember({ type: "string", validation: (r) => r.max(20).error("Máximo 20 caracteres") })],
    validation: maxItems(3, "etiquetas"),
  }),
  text("primaryCtaLabel", "Botón principal", "Lleva al registro. Ej.: Agendar una cita"),
  text("secondaryCtaLabel", "Botón secundario", "Baja a la sección Nosotros. Ej.: Conocer más"),
  text("socialLabel", "Texto antes de las redes", "Ej.: Síguenos"),
]);

export const impactSection = section(
  "impactSection",
  "Cifras de impacto",
  BarChartIcon,
  [
    defineField({
      name: "stats",
      title: "Cifras",
      description: "Solo datos reales. Si la lista está vacía, la franja no se muestra.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            text("value", "Valor", "Ej.: +500, 98% o 1.200. El número se anima contando desde 0.", true, undefined, 10),
            text("label", "Descripción", "Ej.: familias acompañadas", true, undefined, 40),
            iconField("Elige el que mejor represente la cifra. Si no eliges uno, se asigna automáticamente."),
          ],
          preview: {
            select: { title: "value", subtitle: "label", icon: "icon" },
            prepare: ({ title, subtitle, icon }) => ({ title, subtitle, media: emojiMedia(icon) }),
          },
        }),
      ],
      validation: maxItems(4, "cifras"),
    }),
  ],
);

export const missionSection = section("missionSection", "Nosotros", UsersIcon, [
  text("eyebrow", "Etiqueta", "Ej.: Nuestra misión"),
  text("title", "Título"),
  defineField({
    name: "paragraphs",
    title: "Párrafos",
    type: "array",
    of: [defineArrayMember({ type: "text", rows: 4, validation: (r) => r.max(700).error("Máximo 700 caracteres por párrafo") })],
    validation: maxItems(4, "párrafos"),
  }),
  imageList("images", "Galería", "Se usan las 3 primeras: 2 horizontales y 1 vertical (la segunda).", 0, 3),
]);

export const servicesSection = section("servicesSection", "Servicios", HeartIcon, [
  text("eyebrow", "Etiqueta"),
  text("title", "Título"),
  text("subtitle", "Subtítulo", undefined, false, 2),
  defineField({
    name: "items",
    title: "Servicios",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "service",
        fields: [
          text("title", "Nombre", undefined, true, undefined, 50),
          text("description", "Descripción", undefined, true, 3, 200),
          iconField(undefined, true),
          defineField({
            name: "accent",
            title: "Color",
            type: "string",
            initialValue: "blue",
            options: {
              layout: "radio",
              direction: "horizontal",
              list: [
                { title: "Azul", value: "blue" },
                { title: "Rosado", value: "pink" },
                { title: "Amarillo", value: "yellow" },
              ],
            },
            validation: (r) => r.required(),
          }),
        ],
        preview: {
          select: { title: "title", subtitle: "description", icon: "icon" },
          prepare: ({ title, subtitle, icon }) => ({ title, subtitle, media: emojiMedia(icon) }),
        },
      }),
    ],
    validation: maxItems(9, "servicios"),
  }),
]);

export const stepsSection = section("stepsSection", "Cómo agendar", CalendarIcon, [
  text("eyebrow", "Etiqueta"),
  text("title", "Título"),
  text("subtitle", "Subtítulo", undefined, false, 2),
  defineField({
    name: "items",
    title: "Pasos",
    description: "Se recomiendan 3 pasos.",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "step",
        fields: [text("title", "Título", undefined, true, undefined, 40), text("description", "Descripción", undefined, true, 3, 200)],
      }),
    ],
    validation: maxItems(4, "pasos"),
  }),
  text("ctaLabel", "Texto del botón", "Ej.: Crear mi cuenta", false),
]);

export const testimonialsSection = section(
  "testimonialsSection",
  "Testimonios",
  CommentIcon,
  [
    text("eyebrow", "Etiqueta"),
    text("title", "Título"),
    defineField({
      name: "items",
      title: "Testimonios",
      description: "Si no hay testimonios, la sección no se muestra. Usa testimonios reales y con permiso de la persona.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonial",
          fields: [
            text("quote", "Testimonio", undefined, true, 4, 300),
            text("author", "Nombre", undefined, true, undefined, 60),
            text("role", "Relación con la fundación", "Ej.: Madre de un participante", false, undefined, 80),
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        }),
      ],
      validation: maxItems(6, "testimonios"),
    }),
  ],
);

export const bandSection = section("bandSection", "ASPY Band", PlayIcon, [
  text("eyebrow", "Etiqueta"),
  text("title", "Título"),
  text("highlight", "Palabra destacada", "Parte del título que va en rosado", false),
  text("description", "Descripción", undefined, true, 4, 450),
  imageList(
    "images",
    "Fotos de la banda",
    "Se muestran en un carrusel que avanza solo. Sube entre 1 y 10 fotos; se recortan al centro, así que funcionan mejor cuadradas o con las personas al centro. Puedes reordenarlas arrastrándolas.",
    1,
    10,
  ),
  defineField({
    name: "link",
    title: "Botón",
    type: "object",
    fields: [text("label", "Texto"), defineField({ name: "href", title: "Enlace", type: "url" })],
  }),
]);

export const supportSection = section("supportSection", "Aliados y donaciones", StarIcon, [
  text("eyebrow", "Etiqueta"),
  text("title", "Título"),
  text("subtitle", "Subtítulo", undefined, false, 2),
  defineField({
    name: "partners",
    title: "Aliados",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "partner",
        fields: [
          text("name", "Nombre", "Se muestra si no hay logo y al pasar el mouse sobre el logo.", true, undefined, 60),
          defineField({
            name: "logo",
            title: "Logo (opcional)",
            description:
              "PNG o SVG, idealmente con fondo transparente o blanco y en horizontal. Se muestra dentro de un recuadro blanco.",
            type: "image",
            options: { accept: "image/png,image/jpeg,image/webp,image/svg+xml" },
            fields: [altField],
          }),
          defineField({ name: "url", title: "Sitio web (opcional)", type: "url" }),
        ],
        preview: { select: { title: "name", media: "logo" } },
      }),
    ],
    validation: maxItems(12, "aliados"),
  }),
  defineField({
    name: "donation",
    title: "Donaciones",
    description: "El bloque aparece cuando hay al menos un dato para donar o un enlace.",
    type: "object",
    fields: [
      text("title", "Título"),
      text("description", "Descripción", undefined, false, 3),
      defineField({
        name: "details",
        title: "Datos para donar",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "detail",
            fields: [text("label", "Dato", "Ej.: Banco"), text("value", "Valor", "Ej.: Banco Pichincha")],
            preview: { select: { title: "label", subtitle: "value" } },
          }),
        ],
        validation: maxItems(6, "datos"),
      }),
      defineField({
        name: "cta",
        title: "Botón (opcional)",
        type: "object",
        fields: [text("label", "Texto", undefined, false), defineField({ name: "href", title: "Enlace", type: "url" })],
      }),
    ],
  }),
]);

export const contactSection = section(
  "contactSection",
  "Contacto",
  EnvelopeIcon,
  [
    text("title", "Título del bloque final"),
    text("subtitle", "Subtítulo", undefined, false, 2),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      description: "Número con código de país, sin + ni espacios. Ej.: 593991234567. En la web se mostrará como 099 123 4567.",
      type: "string",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "número" }).warning("Solo números, con código de país"),
    }),
    text("whatsappCtaLabel", "Texto del botón de WhatsApp", "Ej.: Escríbenos por WhatsApp", false),
    text(
      "whatsappMessage",
      "Mensaje predeterminado de WhatsApp",
      "Texto que ya aparece escrito cuando la persona abre el chat. Ej.: Hola, quisiera más información.",
      false,
      2,
    ),
    defineField({
      name: "whatsappFloatingButton",
      title: "Mostrar botón flotante de WhatsApp",
      description: "Botón verde fijo en la esquina de la página. Solo aparece si hay un número de WhatsApp.",
      type: "boolean",
      initialValue: true,
    }),
    text("whatsappFloatingLabel", "Texto junto al botón flotante", "Ej.: ¿Tienes dudas? Escríbenos", false),
    text("phone", "Teléfono", undefined, false),
    defineField({ name: "email", title: "Correo", type: "email" }),
    text("address", "Dirección", undefined, false),
    defineField({
      name: "showMap",
      title: "Mostrar mapa",
      description: "Mapa de Google Maps en la sección de contacto. Necesita una dirección o una ubicación exacta.",
      type: "boolean",
      initialValue: true,
    }),
    text("mapTitle", "Título junto al mapa", "Ej.: Visítanos", false, undefined, 40),
    text(
      "mapQuery",
      "Ubicación exacta para el mapa (opcional)",
      "Si el mapa no marca bien el lugar con la dirección, escribe aquí las coordenadas (ej.: -2.1462, -79.8923) o el nombre exacto del lugar en Google Maps.",
      false,
      undefined,
      150,
    ),
    text("mapButtonLabel", "Texto del botón del mapa", "Ej.: Abrir en Google Maps", false, undefined, 40),
    defineField({
      name: "mapUrl",
      title: "Enlace de Google Maps (opcional)",
      description:
        "Abre la ficha de la fundación en Google Maps y copia el enlace de la barra del navegador (empieza con https://www.google.com/maps/place/…). Así el botón abre la ficha y el mapa marca exactamente la fundación. Si está vacío, se usa la dirección.",
      type: "url",
    }),
    text(
      "schedule",
      "Horario de atención",
      "Una línea por horario (Enter para pasar a la siguiente). Ej.: «Lun a Vie · 10:00 – 18:00» y en otra línea «Sábados · 10:00 – 14:00».",
      false,
      3,
      200,
    ),
  ],
  "Los datos vacíos no se muestran en la página.",
);

/** Una red social: si el enlace está vacío, su ícono no se muestra en la web. */
const socialField = (name: string, title: string, example: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: false },
    fields: [
      defineField({
        name: "url",
        title: "Enlace",
        description: "Déjalo vacío si no tienen esta red: el ícono no aparecerá en la página.",
        type: "url",
        validation: (r) => r.uri({ scheme: ["https"] }).error("Debe empezar con https://"),
      }),
      text("label", "Texto visible", `Ej.: ${example}`, false, undefined, 40),
    ],
  });

export const socialSection = section(
  "socialSection",
  "Redes sociales",
  ShareIcon,
  [
    socialField("instagram", "Instagram de la fundación", "@aspyecuador"),
    socialField("instagramBand", "Instagram de ASPY Band", "@aspy_band"),
    socialField("facebook", "Facebook", "Fundación Aspy Ecuador"),
    socialField("tiktok", "TikTok", "@aspyecuador"),
    socialField("youtube", "YouTube", "Fundación Aspy"),
  ],
  "Solo se muestran en la página las redes que tengan enlace.",
);

export const footerSection = section("footerSection", "Pie de página", BlockContentIcon, [
  text("description", "Descripción", undefined, true, 2),
  text("navTitle", "Título de la columna de navegación"),
  text("contactTitle", "Título de la columna de contacto"),
  text("location", "Ubicación", "Ej.: Guayaquil, Ecuador"),
  text("loginLabel", "Enlace de ingreso al sistema"),
]);

/**
 * Orden de la barra lateral. `contentKey` es la clave en `LandingContent`
 * (la usan la carga inicial y la consulta del frontend).
 */
export const SECTIONS = [
  { type: siteSettings, contentKey: "site" },
  { type: heroSection, contentKey: "hero" },
  { type: impactSection, contentKey: "impact" },
  { type: missionSection, contentKey: "mission" },
  { type: servicesSection, contentKey: "services" },
  { type: stepsSection, contentKey: "steps" },
  { type: testimonialsSection, contentKey: "testimonials" },
  { type: bandSection, contentKey: "band" },
  { type: supportSection, contentKey: "support" },
  { type: contactSection, contentKey: "contact" },
  { type: socialSection, contentKey: "social" },
  { type: footerSection, contentKey: "footer" },
] as const;
