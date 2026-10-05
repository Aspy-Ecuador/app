import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes, SECTIONS, SINGLETONS } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

// Acciones permitidas en documentos únicos (sin "duplicar" ni "eliminar")
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** Elemento de la barra lateral que abre directamente el documento único de una sección. */
const sectionItem = (S: StructureBuilder, section: (typeof SECTIONS)[number]) => {
  const { name, title, icon } = section.type;
  return S.listItem()
    .title(title ?? name)
    .id(name)
    .icon(icon)
    .child(S.document().schemaType(name).documentId(name).title(title ?? name));
};

export default defineConfig({
  name: "aspy",
  title: "Fundación Aspy · Contenido",
  projectId,
  dataset,

  plugins: [
    structureTool({
      title: "Página de inicio",
      structure: (S) => {
        const [settings, ...rest] = SECTIONS;
        const pageSections = rest.filter((s) => !["socialSection", "footerSection"].includes(s.type.name));
        const footerItems = rest.filter((s) => ["socialSection", "footerSection"].includes(s.type.name));
        return S.list()
          .title("Página de inicio")
          .items([
            sectionItem(S, settings),
            S.divider(),
            // Secciones en el mismo orden en que aparecen en la página
            ...pageSections.map((s) => sectionItem(S, s)),
            S.divider(),
            ...footerItems.map((s) => sectionItem(S, s)),
          ]);
      },
    }),
    // Consola de consultas GROQ (útil para desarrolladores)
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // No ofrecer "crear nuevo" para documentos únicos
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType) ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : input,
    // Tampoco desde el botón "+" global
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETONS.has(item.templateId)),
  },
});
