import { SECTIONS } from "./sections";

export { SECTIONS };

export const schemaTypes = SECTIONS.map((s) => s.type);

/** Documentos únicos (uno por sección): no se pueden crear copias ni borrar. Su _id es igual a su tipo. */
export const SINGLETONS = new Set<string>(SECTIONS.map((s) => s.type.name));
