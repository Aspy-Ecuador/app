// Capturas del registro de una cuenta nueva (manual de familias). Formulario rediseñado (MUI).
import { browser, context, settle, shot as rawShot, mark, WEB } from "./lib.mjs";

const D = "cliente/";
const shot = (p, n, o) => rawShot(p, D + n, o);
const fails = [];
const ONLY = process.env.ONLY?.split(",");
const step = async (name, fn) => { if (ONLY && !ONLY.includes(name)) return; try { await fn(); } catch (e) { fails.push(name); console.log("FALLÓ", name, e.message.split("\n")[0]); } };
const elegir = async (p, id, texto) => {
  await p.locator(`[id="${id}"]`).click();
  await p.getByRole("option", { name: texto }).first().click();
  await p.waitForTimeout(150);
};
const escribir = (p, id, v) => p.locator(`input[id="${id}"]`).fill(v);

const b = await browser();
const ctx = await context(b);
const p = await ctx.newPage();
try {
  await step("registro", async () => {
    await p.goto(WEB + "/register"); await settle(p);
    await escribir(p, "first_name", "Carmen"); await escribir(p, "last_name", "Vera");
    // Fecha de nacimiento: se escribe y luego se muestra el calendario (año → mes → día) con ese día marcado
    await escribir(p, "birthdate", "21/07/1989");
    await p.getByRole("button", { name: /calendario/i }).click(); await p.waitForTimeout(600);
    await p.getByRole("radio", { name: "1989" }).click(); await p.waitForTimeout(400);
    await p.getByRole("radio", { name: /jul/i }).click(); await p.waitForTimeout(400);
    await p.mouse.move(1200, 500); await p.waitForTimeout(200);
    await shot(p, "04b-registro-calendario");
    await p.getByRole("gridcell", { name: "21", exact: true }).click(); await p.waitForTimeout(400);
    await elegir(p, "gender_id", "Femenino");
    await elegir(p, "occupation_id", "Otra");
    await escribir(p, "occupation_other", "Diseñadora gráfica");
    await elegir(p, "marital_status_id", "Casado/a"); await elegir(p, "education_id", "Universitario");
    await elegir(p, "identification.type", "Cédula");
    await escribir(p, "identification.number", "0923456781");
    await mark(p, p.locator(`input[id="occupation_other"]`).locator("xpath=ancestor::div[contains(@class,'MuiFormControl')][1]/.."), "1");
    await mark(p, p.locator(`input[id="identification.number"]`).locator("xpath=ancestor::div[contains(@class,'MuiFormControl')][1]/.."), "2");
    await mark(p, p.getByRole("button", { name: /Siguiente/ }), "3");
    await shot(p, "04-registro-paso1", { fullPage: true });
    await p.getByRole("button", { name: /Siguiente/ }).click(); await p.waitForTimeout(500);

    await elegir(p, "phone.type", "Móvil");
    await escribir(p, "phone.number", "0991234567");
    await elegir(p, "address.state_id", "Guayas"); await elegir(p, "address.city_id", "Guayaquil");
    await elegir(p, "address.type", "Casa");
    await escribir(p, "address.primary_address", "Cdla. Los Ceibos"); await escribir(p, "address.secondary_address", "Calle 5ta y Av. del Bombero");
    await shot(p, "05-registro-paso2", { fullPage: true });
    await p.getByRole("button", { name: /Siguiente/ }).click(); await p.waitForTimeout(500);

    await escribir(p, "email", "carmen.vera@gmail.com"); await escribir(p, "password", "Aspy2026"); await escribir(p, "password_confirmation", "Aspy2026");
    // La tarjeta de la política es el único role="checkbox" fuera de la ventana; dentro están las casillas
    const tarjeta = p.locator('form [role="checkbox"]');
    await mark(p, tarjeta, "");
    await shot(p, "06-registro-paso3-antes", { fullPage: true });
    await tarjeta.click(); await p.waitForTimeout(600);
    await shot(p, "06a-registro-politica");
    await p.locator('[role="dialog"] .MuiDialogContent-root').evaluate((e) => e.scrollTo(0, e.scrollHeight)); await p.waitForTimeout(500);
    const casillas = p.locator('[role="dialog"] input[type="checkbox"]');
    for (let i = 0; i < (await casillas.count()); i++) await casillas.nth(i).check();
    await p.locator('[role="dialog"] .MuiDialogContent-root').evaluate((e) => e.scrollTo(0, e.scrollHeight)); await p.waitForTimeout(400);
    const ok = p.locator('[role="dialog"]').getByRole("button", { name: "Acepto", exact: true });
    await mark(p, casillas.first().locator("xpath=ancestor::label[1]/.."), "1");
    await mark(p, ok, "2");
    await shot(p, "06b-registro-politica-aceptar");
    await ok.click(); await p.waitForTimeout(600);
    await mark(p, tarjeta, "1");
    await mark(p, p.getByRole("button", { name: /Registrarse/ }), "2");
    await shot(p, "06-registro-paso3", { fullPage: true });
    await p.getByRole("button", { name: /Registrarse/ }).click(); await settle(p, 2000);
    await shot(p, "07-registro-listo");
  });
} finally {
  await b.close();
}
console.log(fails.length ? "Fallaron: " + fails.join(", ") : "Todo OK");
