// Manuales de uso · Fundación Aspy Ecuador
// ─────────────────────────────────────────────────────────────────────
// CRÉDITOS: se muestran al final de cada capítulo. Para cambiar un correo,
// edítalo aquí y vuelve a generar los PDF (node manuales/generar-pdf.mjs).
const AUTORES = [
  { nombre: "Carlos Salazar Valverde", correo: "carasala@espol.edu.ec" },
  { nombre: "Carlos Flores Gonzales", correo: "carfgonz@espol.edu.ec" }
];
// ─────────────────────────────────────────────────────────────────────

(function () {
  // Dentro del sistema (pantalla "Manual de uso") el manual se abre con ?embebido:
  // se ocultan los accesos a la portada con todos los manuales; el sistema decide cuáles ve cada rol.
  if (new URLSearchParams(location.search).has("embebido")) {
    document.documentElement.classList.add("embebido");
    document.querySelectorAll('a[href="index.html"]').forEach((a) => a.removeAttribute("href"));
  }

  const nombres = AUTORES.map((a) => a.nombre);
  const listaNombres = nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
  const correos = AUTORES.filter((a) => a.correo);
  // El correo va como texto seleccionable con botón de copiar (los enlaces mailto no abren en todos lados)
  const enlaces = correos
    .map((a) => `<span class="correo">${a.correo}</span> <button type="button" class="copiar no-imprimir" data-correo="${a.correo}">Copiar</button>`)
    .join(" · ");

  // 1. Créditos al final de cada capítulo
  document.querySelectorAll(".capitulo").forEach((cap) => {
    const div = document.createElement("div");
    div.className = "creditos";
    div.innerHTML =
      `<img src="assets/logo-aspy.webp" alt="Fundación Aspy Ecuador">` +
      `<div><p class="autores">Desarrollado por ${listaNombres}.</p>` +
      `<p class="contacto">¿Dudas o algún problema con el sistema? Escríbenos${correos.length ? ": " + enlaces : "."}</p></div>`;
    cap.appendChild(div);
  });

  // 2. Índices (lateral, móvil e impreso) a partir de los capítulos
  const caps = [...document.querySelectorAll(".capitulo")];
  const items = caps.map((c) => `<li><a href="#${c.id}">${c.dataset.titulo || c.querySelector("h2").textContent}</a></li>`).join("");
  document.querySelectorAll("[data-indice]").forEach((ol) => (ol.innerHTML = items));

  // 3. Resalta en el índice el capítulo que se está leyendo
  const links = [...document.querySelectorAll(".indice a")];
  if ("IntersectionObserver" in window && links.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) => l.classList.toggle("activo", l.getAttribute("href") === "#" + e.target.id));
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    caps.forEach((c) => io.observe(c));
  }

  // 4. Ver capturas en grande
  const visor = document.createElement("div");
  visor.className = "visor";
  visor.setAttribute("role", "dialog");
  visor.setAttribute("aria-label", "Imagen ampliada");
  visor.innerHTML = '<img alt="">';
  document.body.appendChild(visor);
  const cerrar = () => visor.classList.remove("abierto");
  visor.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => e.key === "Escape" && cerrar());
  document.querySelectorAll("figure.captura img").forEach((img) => {
    img.decoding = "async";
    img.addEventListener("click", () => {
      visor.querySelector("img").src = img.src;
      visor.querySelector("img").alt = img.alt;
      visor.classList.add("abierto");
    });
  });

  // 5. Al imprimir o generar el PDF: abrir las preguntas frecuentes
  const prepararImpresion = () => {
    document.querySelectorAll("details").forEach((d) => (d.open = true));
  };
  window.addEventListener("beforeprint", prepararImpresion);
  if (new URLSearchParams(location.search).has("imprimir")) prepararImpresion();

  // 6. Copiar correos
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".copiar");
    if (!b) return;
    const correo = b.dataset.correo;
    const marcarTexto = () => {
      const span = b.previousElementSibling;
      const r = document.createRange();
      r.selectNodeContents(span);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    };
    try {
      navigator.clipboard.writeText(correo).then(() => avisar("Correo copiado"), () => { marcarTexto(); avisar("Correo seleccionado: cópialo con Ctrl+C"); });
    } catch {
      marcarTexto();
      avisar("Correo seleccionado: cópialo con Ctrl+C");
    }
  });

  // 7. Botón "Descargar PDF"
  // En claude.ai el visor pide confirmación antes de guardar (permiso de descargas).
  // Abierto como archivo en el computador, el enlace normal descarga el PDF.
  let descargas = null;
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("downloads").then((d) => (descargas = d), () => {});
  }
  document.querySelectorAll("[data-pdf]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (!descargas) return;
      e.preventDefault();
      const ruta = btn.getAttribute("href");
      try {
        const r = await fetch(ruta);
        if (!r.ok) throw { code: "sin_archivo" };
        await descargas.save({ filename: ruta.split("/").pop(), data: await r.blob() });
        avisar("PDF descargado");
      } catch (err) {
        const code = err && err.code;
        if (code === "declined") return;
        if (code === "rate_limited") return avisar("Espera un momento e inténtalo de nuevo.");
        avisar("No se pudo descargar aquí. Abriendo el PDF en otra pestaña…");
        const a = document.createElement("a");
        a.href = ruta;
        a.target = "_blank";
        a.rel = "noopener";
        a.click();
      }
    });
  });

  // Aviso breve en la parte de abajo
  let temporizador;
  function avisar(texto) {
    let t = document.querySelector(".aviso-flotante");
    if (!t) {
      t = document.createElement("div");
      t.className = "aviso-flotante no-imprimir";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => t.classList.remove("visible"), 3200);
  }
})();
