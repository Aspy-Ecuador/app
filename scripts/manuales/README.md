# Capturas de los manuales de uso

Herramientas para rehacer las capturas de `aspy/resources/manuales/img/` y la versión "artifact" de los manuales.
Solo desarrollo: usan una **BD SQLite de demo con personas ficticias** y nunca tocan Railway.

## Preparar (una vez)

```bash
cd scripts/manuales
npm install            # playwright-core (usa el Chrome instalado: C:/Program Files/Google/Chrome/...)
node make-assets.mjs   # comprobante, firma y reporte ficticios en demo-assets/ (ya están en git)
```

## Levantar los servidores de demo (3 terminales)

```bash
# 1) Backend en :8002 con la BD de demo (NUNCA sin DB_CONNECTION=sqlite: el .env apunta a producción)
cd aspy
DB_CONNECTION=sqlite DB_DATABASE="$(pwd)/../scripts/manuales/demo.sqlite" php artisan serve --port=8002

# 2) Web en :5180 apuntando a ese backend
cd aspy-web
VITE_API_URL=http://127.0.0.1:8002/api npx vite --port 5180 --strictPort

# 3) Solo para el manual de la página web: Studio de Sanity local en :3333
cd aspy-studio
npx sanity dev --port 3333
```

## Rehacer las capturas

```bash
cd scripts/manuales
bash reset.sh                 # BD de demo desde cero: usuarios, servicios, horarios, citas, pagos y datos bancarios ficticios
node cap-logins.mjs
node cap-registro.mjs
node cap-cliente.mjs          # en este orden: cliente → staff → profesional → admin (cada uno usa lo que dejó el anterior)
node cap-staff.mjs
node cap-profesional.mjs
node cap-admin.mjs
node cap-sanity.mjs           # solo mira el Studio; no edita ni publica
node cap-hero.mjs             # portada de la web
```

- `ONLY=nombre1,nombre2 node cap-x.mjs` rehace solo esos pasos.
- Las capturas quedan en `out/<carpeta>/`: `cliente/` → `img/familias/`, `staff/` → `img/personal/`, `profesional/` → `img/profesional/`, `admin/` → `img/administrador/`, `sanity/` y `pagina-web/` → `img/pagina-web/`. Copia las que cambiaron a `aspy/resources/manuales/img/...` con el mismo nombre que usa el HTML.
- Usuarios de demo: `admin@aspy.com` / `ADMIN` (seeder), `recepcion@aspy.com`, `lucia.mendoza@aspy.com`, `sofia.ramirez@gmail.com`, todos con `Aspy2026`.
- `lib.mjs` simula Cloudinary (no sube nada real) y deja pasar el contenido real de Sanity (solo lectura).
- `studio-lib.mjs` entra al Studio local con la sesión del CLI de Sanity de esta máquina (`~/.config/sanity/config.json`; hay que haber hecho `npx sanity login`).

## Revisar el diseño responsivo

```bash
cd scripts/manuales
WEB=http://localhost:5173 node revisar-responsive.mjs            # todas las pantallas en celular, tablet, PC y TV
SOLO=Client,publico TAM=celular,tv4k node revisar-responsive.mjs  # solo esos roles y tamaños
```

Avisa si alguna pantalla se desborda hacia los lados y deja una captura de cada una en `out/responsive/`. Úsalo después de cualquier cambio visual (la app debe verse bien en celulares, tablets, PC y televisores).

## Probar que los formularios envían bien los datos

```bash
cd scripts/manuales
bash reset.sh
WEB=http://localhost:5173 node probar-formularios.mjs
bash reset.sh                 # deja la BD de demo limpia otra vez (la prueba crea usuarios y servicios)
```

Llena y envía, como lo haría una persona, los formularios del panel (crear y editar usuario, servicios, datos bancarios, horario, perfil propio, filtro de citas, y la política de privacidad en el primer ingreso de una cuenta creada desde el panel) y compara en el API lo guardado con lo escrito. Termina con código 1 si algo falla y deja capturas en `out/formularios/`. Solo corre contra servidores locales. Córrela después de tocar cualquier formulario (la lista de formularios y calendarios está en el "Mapa de pantallas" de `CLAUDE.md`).

## Después de cambiar un manual

```bash
node scripts/generar-pdf-manuales.mjs        # desde la raíz: regenera aspy/resources/manuales/pdf/
node scripts/manuales/build-artifacts.mjs    # genera scripts/manuales/artifacts/<manual>/index.html
```

Luego se republica cada artifact con la herramienta Artifact de Claude, usando su `url` (en `urls.json`), la página `artifacts/<manual>/index.html` y como archivos sus `img/<carpeta>/*.jpg`, `assets/logo-aspy.webp` y `pdf/<manual>.pdf` (desde `aspy/resources/manuales`), con el permiso `downloads`.
