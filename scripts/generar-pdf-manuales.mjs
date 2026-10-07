// Genera los PDF de los manuales de uso (aspy/resources/manuales) con Google Chrome; no necesita instalar nada más.
// Uso, desde la raíz del repo:   node scripts/generar-pdf-manuales.mjs
// Si Chrome está en otra ruta:   CHROME_PATH="C:/ruta/chrome.exe" node scripts/generar-pdf-manuales.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../aspy/resources/manuales");
const MANUALES = ["manual-familias", "manual-profesional", "manual-personal", "manual-administrador", "manual-pagina-web"];

const candidatos = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidatos.find((p) => existsSync(p));
if (!chrome) {
  console.error("No encontré Chrome. Indica la ruta con CHROME_PATH.");
  process.exit(1);
}

mkdirSync(join(DIR, "pdf"), { recursive: true });
for (const nombre of MANUALES) {
  const url = pathToFileURL(join(DIR, `${nombre}.html`)).href + "?imprimir";
  const salida = join(DIR, "pdf", `${nombre}.pdf`);
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=20000",
    `--print-to-pdf=${salida}`,
    url,
  ], { stdio: "ignore" });
  console.log(`✔ ${nombre}.pdf (${(statSync(salida).size / 1e6).toFixed(1)} MB)`);
}
