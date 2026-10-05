// Un documento único por sección de la landing (cada uno aparece en la barra lateral del Studio).
// En conjunto replican `LandingContent` (aspy-web/src/content/landing/types.ts).
// Si cambias un campo aquí, cámbialo también allá y en la consulta de aspy-web/src/content/landing/sanity.ts.
import { defineArrayMember, defineField, defineType } from "sanity";
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
    validation: (r) => (min ? r.min(min).max(max) : r.max(max)),
  });

const text = (name: string, title: string, description?: string, required = true, rows?: number) =>
  defineField({
    name,
    title,
    description,
    type: rows ? "text" : "string",
    ...(rows ? { rows } : {}),
    validation: required ? (r) => r.required() : undefined,
  });

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
  text("badge", "Etiqueta superior", "Ej.: Fundación sin fines de lucro · Guayaquil, Ecuador"),
  text("title", "Título"),
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
  text("tagline", "Lema", "Ej.: Todo es posible", false),
  text("description", "Descripción", undefined, true, 4),
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
    of: [defineArrayMember({ type: "string" })],
    validation: (r) => r.max(3),
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
          fields: [text("value", "Valor", "Ej.: +500"), text("label", "Descripción", "Ej.: familias acompañadas")],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.max(4),
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
    of: [defineArrayMember({ type: "text", rows: 4 })],
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
          text("title", "Nombre"),
          text("description", "Descripción", undefined, true, 3),
          defineField({
            name: "icon",
            title: "Ícono",
            type: "string",
            initialValue: "heart",
            options: {
              list: [
                { title: "Accesibilidad", value: "accessibility" },
                { title: "Corazón", value: "heart" },
                { title: "Educación", value: "school" },
                { title: "Apretón de manos", value: "handshake" },
                { title: "Grupo de personas", value: "groups" },
                { title: "Música", value: "music" },
                { title: "Psicología", value: "psychology" },
                { title: "Familia", value: "family" },
              ],
            },
            validation: (r) => r.required(),
          }),
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
        preview: { select: { title: "title", subtitle: "description" } },
      }),
    ],
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
        fields: [text("title", "Título"), text("description", "Descripción", undefined, true, 3)],
      }),
    ],
    validation: (r) => r.max(4),
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
            text("quote", "Testimonio", undefined, true, 4),
            text("author", "Nombre"),
            text("role", "Relación con la fundación", "Ej.: Madre de un participante", false),
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        }),
      ],
    }),
  ],
);

export const bandSection = section("bandSection", "ASPY Band", PlayIcon, [
  text("eyebrow", "Etiqueta"),
  text("title", "Título"),
  text("highlight", "Palabra destacada", "Parte del título que va en rosado", false),
  text("description", "Descripción", undefined, true, 4),
  image("image", "Foto"),
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
          text("name", "Nombre"),
          image("logo", "Logo (opcional)"),
          defineField({ name: "url", title: "Sitio web (opcional)", type: "url" }),
        ],
        preview: { select: { title: "name", media: "logo" } },
      }),
    ],
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
      description: "Número con código de país, sin + ni espacios. Ej.: 593991234567",
      type: "string",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "número" }).warning("Solo números, con código de país"),
    }),
    text("whatsappCtaLabel", "Texto del botón de WhatsApp", "Ej.: Escríbenos por WhatsApp", false),
    text("phone", "Teléfono", undefined, false),
    defineField({ name: "email", title: "Correo", type: "email" }),
    text("address", "Dirección", undefined, false),
    defineField({ name: "mapUrl", title: "Enlace de Google Maps", type: "url" }),
    text("schedule", "Horario de atención", "Ej.: Lun a Vie · 08:00 – 17:00", false),
  ],
  "Los datos vacíos no se muestran en la página.",
);

export const socialSection = section("socialSection", "Redes sociales", ShareIcon, [
  defineField({
    name: "links",
    title: "Redes sociales",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "socialLink",
        fields: [
          defineField({
            name: "network",
            title: "Red",
            type: "string",
            options: {
              list: [
                { title: "Instagram", value: "instagram" },
                { title: "Facebook", value: "facebook" },
                { title: "TikTok", value: "tiktok" },
                { title: "YouTube", value: "youtube" },
                { title: "LinkedIn", value: "linkedin" },
              ],
            },
            validation: (r) => r.required(),
          }),
          text("label", "Texto", "Ej.: @aspyecuador"),
          defineField({ name: "url", title: "Enlace", type: "url", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "network" } },
      }),
    ],
  }),
]);

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
