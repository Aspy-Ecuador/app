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
node cap-aviso-archivos.mjs   # aviso de archivos subidos sin usar en la pantalla de pago
```

- `ONLY=nombre1,nombre2 node cap-x.mjs` rehace solo esos pasos.
- La demo deja horarios presenciales (mañana) y virtuales (tarde) ya aprobados, y tres **por aprobar** para las pantallas de aprobación. `demo-seed.mjs` hace más de 120 escrituras por minuto con una misma cuenta: cuando el sistema la frena (429), espera y repite sola.
- **Avisos:** la carga de la demo genera muchos de golpe (cada reserva, cada pago aprobado…). `demo-finalize.mjs` deja a Lucía y a Sofía como en un día normal: todo leído menos los 3 y los 2 más recientes. Cada rol tiene su paso `avisos` (la pantalla *Avisos* o el recuadro de la Vista General). Para abrir una cita desde la Vista General, usa `calendarioArriba()` antes (`abrirCitaEnMes` ya lo hace): la agenda va debajo del saludo y de los avisos, y la ventana de la cita los tapaba.
- En la agenda, los pasos eligen la cita por sus datos (`citasDe`, `abrirCitaEnMes` en `lib.mjs`), no por "la que tiene cámara": ahora hay varias virtuales.
- Las capturas quedan en `out/<carpeta>/`: `cliente/` → `img/familias/`, `staff/` → `img/personal/`, `profesional/` → `img/profesional/`, `admin/` → `img/administrador/`, `sanity/` y `pagina-web/` → `img/pagina-web/`. Copia las que cambiaron a `aspy/resources/manuales/img/...` con el mismo nombre que usa el HTML.
- Usuarios de demo: `admin@aspy.com` / `ADMIN` (seeder), `recepcion@aspy.com`, `lucia.mendoza@aspy.com`, `sofia.ramirez@gmail.com`, todos con `Aspy2026`.
- Los comprobantes y reportes de demo se suben al backend local (archivos privados, tabla `archivo_privado` de la BD de demo). `lib.mjs` deja pasar el contenido real de Sanity (solo lectura).
- La demo deja el ajuste de horarios en "el mes en curso y el siguiente" (`demo-seed.mjs`), para que los turnos de los próximos 12 días se creen cualquier día del mes; dos citas llevan enlace de reunión (citas virtuales) y hay turnos de **hoy**, libres y ocupados, para el panel "Horarios de hoy" de Secretaría.
- `cap-staff.mjs` fija el reloj del navegador a las 08:30 de hoy (así "Horarios de hoy" sale igual a cualquier hora) y, para la captura de **Horarios** de Secretaría, habilita ese permiso por el API de demo y lo vuelve a apagar.
- Las capturas de la página pública (`cap-sanity.mjs`, pasos `web` y `donaciones-web`) muestran dos cuentas para donar **de ejemplo**, agregadas solo en la respuesta que recibe ese navegador (`conCuentasDeEjemplo`): no escriben nada en Sanity y nunca muestran las cuentas que estén cargadas ahí. El paso `visor-web` abre en grande la foto de un servicio. En las capturas de cada sección el menú fijo solo se deja en la portada (en una sección alta tapaba el título). El paso `apariencia` tapa el nombre y el correo de la cuenta con un texto genérico.
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

Llena y envía, como lo haría una persona, los formularios del panel (crear y editar usuario, servicios, datos bancarios, los ajustes del Admin —comprobantes rechazados y horarios—, horario del profesional con su límite de fechas, horarios creados por Secretaría, enlace de una cita virtual, perfil propio, filtro de citas, filtros de las tablas, y la política de privacidad en el primer ingreso de una cuenta creada desde el panel) y compara en el API lo guardado con lo escrito. Termina con código 1 si algo falla y deja capturas en `out/formularios/`. Solo corre contra servidores locales. Córrela después de tocar cualquier formulario (la lista de formularios y calendarios está en el "Mapa de pantallas" de `CLAUDE.md`).

## Después de cambiar un manual

```bash
node scripts/generar-pdf-manuales.mjs        # desde la raíz: regenera aspy/resources/manuales/pdf/
node scripts/manuales/build-artifacts.mjs    # genera scripts/manuales/artifacts/<manual>/index.html
```

Luego se republica cada artifact con la herramienta Artifact de Claude, usando su `url` (en `urls.json`), la página `artifacts/<manual>/index.html` y como archivos sus `img/<carpeta>/*.jpg`, `assets/logo-aspy.webp` y `pdf/<manual>.pdf` (desde `aspy/resources/manuales`), con el permiso `downloads`.
