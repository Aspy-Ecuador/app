// Pantalla de ingreso y menú de cuenta de cada rol (no modifica datos).
import { browser, context, login, settle, shot, mark, WEB } from "./lib.mjs";
const ROLES = { staff: ["recepcion@aspy.com", "Aspy2026"], profesional: ["lucia.mendoza@aspy.com", "Aspy2026"], admin: ["admin@aspy.com", "ADMIN"] };
const b = await browser();
try {
  for (const [dir, [email, pass]] of Object.entries(ROLES)) {
    const ctx = await context(b); const p = await ctx.newPage();
    await p.goto(WEB + "/login"); await settle(p);
    await p.fill('input[type="email"], input[name="email"]', email);
    await p.fill('input[type="password"]', pass);
    await mark(p, p.locator('input[type="email"], input[name="email"]'), "1");
    await mark(p, p.locator('input[type="password"]'), "2");
    await mark(p, p.getByRole("button", { name: /Iniciar sesión/ }).first(), "3");
    await shot(p, dir + "/00-login");
    await login(p, email, pass); await settle(p, 1200);
    await p.locator('[data-testid="MoreVertRoundedIcon"], [data-testid="MoreVertIcon"]').first().click(); await p.waitForTimeout(500);
    await shot(p, dir + "/00-menu-cuenta", { clip: { x: 0, y: 520, width: 480, height: 380 } });
    await ctx.close();
  }
} finally { await b.close(); }
