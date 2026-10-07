// Abre el Studio publicado con la sesión del CLI de Sanity de esta máquina (solo para capturas; no edita nada).
import os from "node:os";
import fs from "node:fs";
import { browser } from "./lib.mjs";
export const STUDIO = "http://localhost:3333";
const token = JSON.parse(fs.readFileSync(os.homedir() + "/.config/sanity/config.json", "utf8")).authToken;
export async function studioPage({ width = 1440, height = 900 } = {}) {
  const b = await browser();
  const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1.5, locale: "es-EC" });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem("__studio_auth_token_1windn04", JSON.stringify({ token: t, time: new Date().toISOString() })); } catch {}
  }, token);
  const p = await ctx.newPage();
  return { b, ctx, p };
}
