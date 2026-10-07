// Barrido de diseño responsivo: recorre las pantallas públicas y las de cada rol en celular, tablet, PC y TV,
// y avisa cuando una pantalla se desborda hacia los lados. Guarda una captura de cada una en out/responsive/.
// Uso (con los servidores de demo arriba, ver README.md):
//   WEB=http://localhost:5173 node revisar-responsive.mjs            → todo
//   SOLO=Client,publico TAM=celular,tv4k node revisar-responsive.mjs → solo esos roles y tamaños
import fs from "node:fs";
import path from "node:path";
import { browser, login, settle, go, USERS, WEB, DIR } from "./lib.mjs";

const TAMANOS = {
  celular: { width: 360, height: 740, isMobile: true, hasTouch: true },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true },
  tabletH: { width: 1024, height: 768 },
  pc: { width: 1440, height: 900 },
  tv: { width: 1920, height: 1080 },
  tv2k: { width: 2560, height: 1440 },
  tv4k: { width: 3840, height: 2160 },
};
const RUTAS = {
  publico: ["/", "/login", "/register"],
  Client: ["/dashboard", "/agendar-cita", "/recibos", "/consultarServicios", "/reportes", "/perfil", "/manual", "/sobreAspy"],
  Professional: ["/dashboard", "/pacientes", "/citas", "/seleccionar-horario", "/perfil"],
  Staff: ["/dashboard", "/profesionales", "/pacientes", "/citas", "/agendar-cita", "/recibos", "/pagos", "/servicios", "/registrarCliente", "/crear-servicio", "/perfil"],
  Admin: ["/dashboard", "/usuarios", "/servicios", "/nuevo-usuario", "/nuevo-servicio", "/citas", "/datos-bancarios", "/perfil"],
};
const solo = process.env.SOLO?.split(",");
const tam = process.env.TAM?.split(",");
const OUT = path.join(DIR, "out", "responsive");
fs.mkdirSync(OUT, { recursive: true });

/** Mide si la página se desborda a lo ancho y qué elementos se salen de la pantalla. */
const medir = () => {
  const ancho = document.documentElement.clientWidth;
  const sobra = document.documentElement.scrollWidth - ancho;
  // Elementos visibles que se salen por la derecha y no están dentro de una zona con desplazamiento propio
  const dentroDeScroll = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll" || o === "hidden") return true;
    }
    return false;
  };
  const fuera = [...document.querySelectorAll("body *")]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right > ancho + 2 && !dentroDeScroll(el); })
    .slice(0, 4)
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").filter((c) => c.startsWith("Mui")).slice(0, 2).join(".")} (${Math.round(el.getBoundingClientRect().right - ancho)}px)`);
  return { sobra, fuera, fuente: parseFloat(getComputedStyle(document.body).fontSize), zoom: Number(getComputedStyle(document.documentElement).zoom) || 1 };
};

const b = await browser();
const problemas = [];
try {
  for (const [rol, rutas] of Object.entries(RUTAS)) {
    if (solo && !solo.includes(rol)) continue;
    // Una sola sesión por rol, reutilizada en todos los tamaños
    let storageState;
    if (rol !== "publico") {
      const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
      const p = await c.newPage();
      await login(p, ...USERS[rol]);
      storageState = await c.storageState();
      await c.close();
    }
    for (const [nombre, vp] of Object.entries(TAMANOS)) {
      if (tam && !tam.includes(nombre)) continue;
      const { isMobile = false, hasTouch = false, ...viewport } = vp;
      const ctx = await b.newContext({ viewport, isMobile, hasTouch, storageState, locale: "es-EC", timezoneId: "America/Guayaquil" });
      // Contenido real de Sanity (solo lectura) también en puertos sin CORS
      await ctx.route(/^https:\/\/1windn04\.api(cdn)?\.sanity\.io\//, async (route) => {
        const resp = await route.fetch();
        route.fulfill({ response: resp, headers: { ...resp.headers(), "access-control-allow-origin": "*" } });
      });
      const p = await ctx.newPage();
      let primera = true;
      for (const ruta of rutas) {
        try {
          if (primera || rol === "publico") { await p.goto(WEB + ruta); await settle(p, 1200); primera = false; }
          else await go(p, ruta);
          await p.waitForTimeout(500);
          const m = await p.evaluate(medir);
          const archivo = `${rol}-${ruta.replace(/\W+/g, "_") || "_inicio"}-${nombre}.jpg`;
          await p.screenshot({ path: path.join(OUT, archivo), type: "jpeg", quality: 55 });
          if (m.sobra > 2) { problemas.push({ rol, ruta, nombre, ...m }); console.log(`⚠ ${rol} ${ruta} [${nombre}] se desborda ${m.sobra}px → ${m.fuera.join(" | ")}`); }
        } catch (e) {
          problemas.push({ rol, ruta, nombre, error: e.message.split("\n")[0] });
          console.log(`✖ ${rol} ${ruta} [${nombre}] ${e.message.split("\n")[0]}`);
        }
      }
      console.log(`✔ ${rol} [${nombre}] ${rutas.length} pantallas`);
      await ctx.close();
    }
  }
} finally {
  await b.close();
}
fs.writeFileSync(path.join(OUT, "resultado.json"), JSON.stringify(problemas, null, 2));
console.log(problemas.length ? `\n${problemas.length} pantallas con problemas (out/responsive/resultado.json)` : "\nSin desbordes");
