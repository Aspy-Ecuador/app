// Genera archivos ficticios (comprobante, firma, reporte) para las capturas.
import fs from "node:fs";
import path from "node:path";
import { browser, ASSETS } from "./lib.mjs";

fs.mkdirSync(ASSETS, { recursive: true });
const b = await browser();
const p = await b.newPage({ viewport: { width: 600, height: 820 }, deviceScaleFactor: 2 });

await p.setContent(`<body style="margin:0;font-family:Segoe UI,Arial;background:#eef2f7">
<div style="margin:30px;background:#fff;border-radius:18px;padding:34px;box-shadow:0 8px 30px #0002;position:relative;overflow:hidden">
<div style="position:absolute;top:300px;left:-40px;transform:rotate(-30deg);font-size:90px;font-weight:900;color:#0001">EJEMPLO</div>
<div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;border-radius:12px;background:#1f6feb"></div><b style="font-size:22px">Banco de Ejemplo</b></div>
<div style="margin-top:28px;text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:#1D9E75;color:#fff;font-size:38px;line-height:64px;margin:auto">✓</div>
<h2 style="margin:14px 0 4px">Transferencia exitosa</h2><div style="color:#667">Comprobante de ejemplo para el manual</div>
<div style="font-size:40px;font-weight:800;margin:18px 0">$30,00</div></div>
<table style="width:100%;font-size:16px;border-collapse:collapse">
${[["Desde", "Cuenta de ahorros ****4521"], ["Para", "Fundación Aspy Ecuador"], ["Cuenta destino", "Corriente ****8890"], ["Concepto", "Terapia - cita"], ["Fecha", "05/10/2026 10:24"], ["N.º de comprobante", "000123456"]].map(([a, v]) => `<tr><td style="padding:10px 0;color:#667;border-bottom:1px solid #eee">${a}</td><td style="text-align:right;border-bottom:1px solid #eee"><b>${v}</b></td></tr>`).join("")}
</table></div></body>`);
await p.screenshot({ path: path.join(ASSETS, "comprobante.png"), fullPage: true });

await p.setViewportSize({ width: 360, height: 140 });
await p.setContent(`<body style="margin:0;background:#fff"><svg width="360" height="140"><path d="M20 100 C 60 20, 90 20, 100 80 S 140 130, 170 60 S 220 20, 240 90 S 300 110, 340 50" stroke="#1a2b5c" stroke-width="4" fill="none" stroke-linecap="round"/></svg></body>`);
await p.screenshot({ path: path.join(ASSETS, "firma.png") });

await p.setContent(`<body style="font-family:Segoe UI,Arial;padding:40px;color:#222">
<div style="border-bottom:4px solid #4DB6E5;padding-bottom:12px;display:flex;justify-content:space-between"><b style="font-size:22px">Fundación Aspy Ecuador</b><span style="color:#888">Documento de ejemplo</span></div>
<h1 style="font-size:24px">Reporte de sesión</h1>
<p><b>Paciente:</b> Sofía Ramírez &nbsp; <b>Profesional:</b> Lucía Mendoza</p>
<p><b>Servicio:</b> Psicología</p>
<h3>Observaciones</h3><p>Texto de ejemplo. Aquí la profesional describe cómo fue la sesión, los avances y las recomendaciones para casa.</p>
<h3>Recomendaciones</h3><ul><li>Actividad de ejemplo 1</li><li>Actividad de ejemplo 2</li></ul></body>`);
await p.pdf({ path: path.join(ASSETS, "reporte.pdf"), format: "A4" });
await b.close();
console.log(fs.readdirSync(ASSETS));
