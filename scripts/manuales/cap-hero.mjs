// Vuelve a tomar las capturas de la portada de la web (solo lectura, sin backend).
import { browser, context, settle, shot, mark, WEB } from "./lib.mjs";
const b = await browser();
try {
  const ctx = await context(b); const p = await ctx.newPage();
  await p.goto(WEB + "/"); await settle(p, 3000);
  console.log("anillos en la página:", await p.evaluate(() => [...document.images].some((i) => i.src.includes("isotipo"))));
  await shot(p, "pagina-web/web-01-hero", { clip: { x: 0, y: 0, width: 1440, height: await p.evaluate(() => Math.round(document.getElementById("hero").getBoundingClientRect().height)) } });
  await mark(p, p.getByRole("link", { name: /^Ingresar/ }).first(), "1");
  await shot(p, "cliente/01-landing-ingresar");
} finally { await b.close(); }
