// Capturas del manual de SANITY (editar la página web). Solo mira: nunca escribe ni publica nada.
import { studioPage, STUDIO } from "./studio-lib.mjs";
import { browser, context, settle, shot as rawShot, mark, WEB } from "./lib.mjs";

const D = "sanity/";
// En el Chrome de capturas, las miniaturas del Studio a veces quedan pendientes: se cargan a mano antes de cada captura
async function loadImages(p) {
  await p.evaluate(async () => {
    const pending = [...document.querySelectorAll('img[src^="https://cdn.sanity.io/"]')].filter((i) => !i.complete || !i.naturalWidth);
    await Promise.all(pending.map(async (i) => {
      try { i.src = URL.createObjectURL(await (await fetch(i.src)).blob()); await i.decode(); } catch {}
    }));
  }).catch(() => {});
}
const shot = async (p, n, o) => { await loadImages(p); return rawShot(p, D + n, o); };
const fails = [];
const ONLY = process.env.ONLY?.split(",");
const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };

// Oculta la foto de la cuenta, el aviso "What's new" y el globito del campo enfocado para que las capturas queden limpias
async function tidy(p) {
  await p.addStyleTag({ content: `[data-ui="Avatar"] img{visibility:hidden!important}[data-ui="Tooltip"],[role="tooltip"]{display:none!important}` }).catch(() => {});
  await p.evaluate(() => {
    document.activeElement?.blur?.();
    const el = [...document.querySelectorAll("*")].find((e) => e.children.length === 0 && e.textContent.trim() === "What's new");
    if (!el) return;
    let x = el; while (x.parentElement && x.parentElement.getBoundingClientRect().width < 520) x = x.parentElement;
    x.style.visibility = "hidden";
  }).catch(() => {});
}
async function open(p, id, wait = 5000) {
  await p.goto(`${STUDIO}/structure/${id}`); await p.waitForTimeout(wait); await tidy(p);
  await p.mouse.move(5, 890);
}
const field = (p, title) => p.getByText(title, { exact: true }).first();

// ── Inicio de sesión (Studio publicado, sin sesión) ──
await step("login", async () => {
  const b = await browser();
  const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 })).newPage();
  await pg.goto("https://aspy-ecuador.sanity.studio"); await pg.waitForTimeout(6000);
  await shot(pg, "01-login");
  await b.close();
});

const { b, p } = await studioPage({ width: 1440, height: 1000 });
try {
  await step("inicio", async () => {
    await p.goto(`${STUDIO}/structure`); await p.waitForTimeout(6000); await tidy(p);
        await shot(p, "02-inicio");
  });
  await step("ajustes", async () => { await open(p, "siteSettings"); await mark(p, field(p, "Logo"), ""); await shot(p, "03-ajustes"); });
  await step("portada", async () => {
    await open(p, "heroSection");
    await mark(p, p.getByRole("button", { name: /Publicar/ }).last(), "");
    await shot(p, "04-portada");
    await field(p, "Fotos del collage").scrollIntoViewIfNeeded(); await p.waitForTimeout(4000);
    await mark(p, field(p, "Fotos del collage"), "");
    await shot(p, "05-portada-fotos");
    await field(p, "Etiquetas sobre las fotos").scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    await shot(p, "06-portada-botones");
  });
  await step("cifras", async () => {
    await open(p, "impactSection");
    await mark(p, p.getByRole("button", { name: /Añadir elemento/ }), "");
    await shot(p, "07-cifras");
    await p.getByText("Familias acompañadas").first().click(); await p.waitForTimeout(1500); await tidy(p);
    await shot(p, "08-cifras-editar");
    await p.keyboard.press("Escape"); await p.waitForTimeout(500);
  });
  await step("nosotros", async () => { await open(p, "missionSection"); await shot(p, "09-nosotros"); });
  await step("servicios", async () => {
    await open(p, "servicesSection");
    await field(p, "Servicios").scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    await shot(p, "10-servicios");
    await p.getByText("Atención y acompañamiento").first().click(); await p.waitForTimeout(1500); await tidy(p);
    await shot(p, "11-servicio-editar");
    const foto = field(p, "Foto (opcional)");
    if (await foto.count()) {
      // Baja hasta el texto alternativo para que la foto se vea entera
      const alt = field(p, "Texto alternativo");
      await (await alt.count() ? alt : foto).scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
      await mark(p, foto, ""); await shot(p, "12-servicio-foto");
    }
    await p.keyboard.press("Escape"); await p.waitForTimeout(500);
  });
  await step("pasos", async () => { await open(p, "stepsSection"); await shot(p, "13-como-agendar"); });
  await step("testimonios", async () => { await open(p, "testimonialsSection"); await shot(p, "14-testimonios"); });
  await step("band", async () => { await open(p, "bandSection"); await shot(p, "15-band"); });
  await step("aliados", async () => {
    await open(p, "supportSection"); await shot(p, "16-aliados");
    await field(p, "Donaciones").scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await shot(p, "17-donaciones");
  });
  await step("contacto", async () => {
    await open(p, "contactSection"); await mark(p, field(p, "WhatsApp"), ""); await shot(p, "18-contacto");
    await field(p, "Mostrar mapa").scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await shot(p, "19-contacto-mapa");
  });
  await step("redes", async () => { await open(p, "socialSection"); await shot(p, "20-redes"); });
  await step("pie", async () => { await open(p, "footerSection"); await shot(p, "21-pie"); });
} finally {
  await b.close();
}

// ── La página web (contenido real publicado en Sanity) ──
await step("web", async () => {
  const wb = await browser();
  const ctx = await context(wb, { width: 1440, height: 900 });
  const w = await ctx.newPage();
  try {
  await w.goto(WEB + "/"); await settle(w, 3000);
  for (let y = 0; y < 12000; y += 700) { await w.mouse.wheel(0, 700); await w.waitForTimeout(120); }
  await w.evaluate(() => scrollTo(0, 0)); await w.waitForTimeout(1200);
  const ids = await w.evaluate(() => [...document.querySelectorAll("section[id], footer")].map((s) => s.id || "footer"));
  console.log("  secciones:", ids.join(", "));
  let i = 1;
  for (const id of ids) {
    const el = id === "footer" ? w.locator("footer").last() : w.locator(`#${id}`).first();
    if (!(await el.isVisible())) { console.log("  (oculta)", id); continue; }
    await el.scrollIntoViewIfNeeded(); await w.waitForTimeout(900);
    await el.screenshot({ path: `out/${D}web-${String(i++).padStart(2, "0")}-${id}.jpg`, type: "jpeg", quality: 86 });
    console.log("  📸 web", id);
  }
  } finally { await wb.close(); }
});
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
