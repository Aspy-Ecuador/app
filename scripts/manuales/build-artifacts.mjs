// Convierte los manuales de aspy/resources/manuales/ en páginas para artifacts de claude.ai:
// sin <html>/<head>/<body>, con el CSS y el JS dentro de la página y los enlaces
// entre manuales apuntando a las URLs de cada artifact (urls.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(DIR, "../../aspy/resources/manuales");
const OUT = path.join(DIR, "artifacts");
const urls = fs.existsSync(path.join(DIR, "urls.json")) ? JSON.parse(fs.readFileSync(path.join(DIR, "urls.json"), "utf8")) : {};

const PAGINAS = {
  "index": "Manuales ASPY",
  "manual-familias": "Manual ASPY Familias",
  "manual-profesional": "Manual ASPY Profesionales",
  "manual-personal": "Manual ASPY Secretaría",
  "manual-administrador": "Manual ASPY Administración",
  "manual-pagina-web": "Manual ASPY Página Web",
};

const css = fs.readFileSync(path.join(SRC, "assets/manual.css"), "utf8");
const js = fs.readFileSync(path.join(SRC, "assets/manual.js"), "utf8");
const FUENTES =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">';

for (const [nombre, titulo] of Object.entries(PAGINAS)) {
  const html = fs.readFileSync(path.join(SRC, `${nombre}.html`), "utf8");
  const bodyTag = html.match(/<body([^>]*)>/)[1];
  const estilo = (bodyTag.match(/style="([^"]*)"/) || [])[1] || "";
  let cuerpo = html.slice(html.indexOf(">", html.indexOf("<body")) + 1, html.lastIndexOf("</body>"));

  // Scripts: el común se incrusta; los propios de la página se conservan
  cuerpo = cuerpo.replace('<script src="assets/manual.js"></script>', `<script>\n${js}\n</script>`);

  // Enlaces entre manuales → URLs de los artifacts
  cuerpo = cuerpo.replace(/href="((?:index|manual-[a-z-]+)\.html)(#[^"]*)?"/g, (m, archivo, ancla = "") => {
    const destino = urls[archivo.replace(".html", "")];
    return destino ? `href="${destino}${ancla}"` : m;
  });

  // Botón PDF: sin atributo download (en el visor no hace nada); si no hay permiso de descargas, abre el PDF en otra pestaña
  cuerpo = cuerpo.replace(/(<a class="btn btn-pdf" data-pdf href="[^"]+") download>/g, '$1 target="_blank" rel="noopener">');

  const salida = `<title>${titulo}</title>\n${FUENTES}\n<style>\n${css}\n</style>\n<div class="pagina"${estilo ? ` style="${estilo}"` : ""}>\n${cuerpo.trim()}\n</div>\n`;
  fs.mkdirSync(path.join(OUT, nombre), { recursive: true });
  fs.writeFileSync(path.join(OUT, nombre, "index.html"), salida);
  console.log("✔", nombre, `${(salida.length / 1024).toFixed(0)} KB`);
}
