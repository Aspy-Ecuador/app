// Genera seed/secciones.ndjson (un documento por sección) a partir del contenido
// de la web (aspy-web/src/content/landing/defaultContent.ts), con las fotos incluidas.
// Solo para crear el contenido desde cero en un proyecto de Sanity NUEVO:
// `npm run seed` reemplaza lo que la fundación haya editado.
// Uso:  node scripts/build-seed.mjs   y luego   npm run seed
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const here = path.dirname(fileURLToPath(import.meta.url));
const studio = path.resolve(here, "..");
const web = path.resolve(studio, "../aspy-web");
const seedDir = path.join(studio, "seed");
const imagesDir = path.join(seedDir, "images");
fs.mkdirSync(imagesDir, { recursive: true });

// 1) Cargar defaultContent.ts reemplazando los imports de imágenes por su nombre de archivo
const sourcePath = path.join(web, "src/content/landing/defaultContent.ts");
let source = fs.readFileSync(sourcePath, "utf8");
const imageFiles = {};
source = source.replace(/import (\w+) from "@\/assets\/(.+?)";/g, (_, name, rel) => {
  imageFiles[name] = path.join(web, "src/assets", rel);
  return `const ${name} = ${JSON.stringify(path.basename(rel))};`;
});
source = source.replace(/^import type .*$/gm, "");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const tmp = path.join(seedDir, ".defaultContent.tmp.mjs");
fs.writeFileSync(tmp, js);
const { defaultLandingContent: content } = await import(`file://${tmp.replace(/\\/g, "/")}`);
fs.rmSync(tmp);

// Copiar las fotos usadas al seed
for (const file of Object.values(imageFiles)) fs.copyFileSync(file, path.join(imagesDir, path.basename(file)));

// 2) Convertir al formato de Sanity: un documento único por sección (_id = tipo)
const ARRAY_MEMBER_TYPES = {
  "services.items": "service",
  "steps.items": "step",
  "impact.stats": "stat",
  "testimonials.items": "testimonial",
  "support.partners": "partner",
  "support.donation.details": "detail",
  social: "socialLink",
};
let keyCounter = 0;
const newKey = () => `k${(keyCounter++).toString(36).padStart(4, "0")}`;
const isImage = (v) => v && typeof v === "object" && typeof v.src === "string" && "alt" in v;
const toImage = (v) => ({ _type: "image", _sanityAsset: `image@file://./images/${v.src}`, alt: v.alt });

function convert(value, p) {
  if (isImage(value)) return toImage(value);
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (isImage(item)) return { _key: newKey(), ...toImage(item) };
      if (item && typeof item === "object") return { _key: newKey(), _type: ARRAY_MEMBER_TYPES[p], ...convert(item, p) };
      return item;
    });
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === "" || v === undefined) continue; // campos vacíos: no se cargan
      out[k] = convert(v, p ? `${p}.${k}` : k);
    }
    return out;
  }
  return value;
}

const c = (key) => convert(content[key], key);
const docs = {
  siteSettings: { logo: convert(content.site.logo, "site.logo"), navigation: c("navigation") },
  heroSection: c("hero"),
  impactSection: c("impact"),
  missionSection: c("mission"),
  servicesSection: c("services"),
  stepsSection: c("steps"),
  testimonialsSection: c("testimonials"),
  bandSection: c("band"),
  supportSection: c("support"),
  contactSection: c("contact"),
  socialSection: { links: c("social") },
  footerSection: c("footer"),
};
const lines = Object.entries(docs).map(([id, fields]) => JSON.stringify({ _id: id, _type: id, ...fields }));
fs.writeFileSync(path.join(seedDir, "secciones.ndjson"), lines.join("\n") + "\n");
console.log(`seed/secciones.ndjson: ${lines.length} documentos, ${Object.keys(imageFiles).length} imágenes.`);
