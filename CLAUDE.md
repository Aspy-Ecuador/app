# CLAUDE.md: contexto del proyecto Aspy

Guía para cualquier sesión de Claude (u otra persona) que trabaje en este repo. Léela completa antes de cambiar código.
Última actualización: 2026-10-07 (ver **Estado actual y punto de retoma** al final). Para levantar el proyecto, ver `README.md`.

## Qué es

Sistema web de la **Fundación Aspy Ecuador** (Guayaquil; personas con discapacidad, espectro autista). Tiene una landing pública y un sistema interno con 4 roles para agendar citas de terapia, cobrarlas por transferencia, emitir recibos y registrar reportes de sesión.

- El dueño del repo trabaja en **español**: respuestas, comentarios y textos de UI en español.
- `aspy-web/tests/` es un trabajo antiguo del colegio y está desactualizado. **Ignóralo**.
- `AGY_CONTEXT.md` es contexto de otro agente (Antigravity). Este archivo lo complementa.

## Stack

| Parte | Tecnología |
|---|---|
| Frontend `aspy-web/` | React 19, TypeScript 5.9, Vite 8, MUI 7 + MUI X, Tailwind 4, React Router 7, Redux, Axios, FullCalendar, jsPDF/react-pdf, Framer Motion. Desplegado en Vercel. |
| Backend `aspy/` | PHP 8.2+, Laravel 12, Sanctum (tokens Bearer). Docker (Nginx + PHP-FPM). |
| BD | PostgreSQL en Railway (producción). SQLite sirve para desarrollo y pruebas. |
| Archivos | Cloudinary (subida *unsigned* desde el navegador: preset `aspy-web`, en `src/utils/utils.ts`). |

## Arquitectura

### Backend (`aspy/`)
- API REST bajo `/api`, en `routes/api.php`. No hay vistas Blade en uso.
- Autenticación: `POST /api/login` devuelve `access_token`, que se manda como `Authorization: Bearer`. `GET /api/user` devuelve el usuario con su `person`.
- Modelo de datos:
  - `user_account` (login, `role_id`, `is_available`) ↔ `person` (datos personales; `person.user_id` → `user_account_id`).
  - Subtipos por `person_id`: `client`, `professional`, `staff`. **El id de cliente/profesional es el `person_id`.**
  - `appointment` (`client_id`, `professional_id`, `worker_schedule_id`, `service_id`, `payment_id`, `appointment_status_id`), `payment` → `payment_data` (comprobante) → `receipt`.
  - `worker_schedule` (turno de un profesional) → `schedule` (fecha y horas).
  - `appointment_report` (reporte clínico: archivo + firma). `professional_service` (qué profesional da cada servicio).
- IDs fijos (seeder y producción coinciden):
  - **Roles:** 1 Admin, 2 Professional, 3 Client, 4 Staff.
  - **Estado de cita:** 1 Guardada (pago por revisar), 2 Agendada, 3 Asistió, 4 No asistió, 5 Cancelada.
  - **Estado de pago:** 1 Aprobado, 2 Pendiente, 3 Rechazado. **Estado de recibo:** 1 Generado, 2 Pendiente.
- Flujo de una cita:
  1. El cliente (o el staff) agenda y sube el comprobante → cita en estado 1, horario ocupado.
  2. El staff aprueba (cita 2, pago 1, recibo 1) o rechaza (borra la cita y libera el horario).
  3. El profesional marca asistencia (3 o 4) y sube el reporte.
  4. Cancelar pasa la cita a 5 y libera el horario.

### Frontend (`aspy-web/src/`)
- `routes/RoleBasedRoutes.tsx` elige las rutas según el rol guardado en `localStorage` (`authenticatedUser`, `token`).
- `observer/RoleDataContext.tsx` + `API/init.ts` cargan al entrar todos los datos del rol: services, appointments, persons, payments, proServices, workerProfessional, appointmentReports. Muchas pantallas filtran esos arrays en el cliente.
- `API/api.ts`: axios con el token. Ante un 401 (token vencido) borra la sesión y redirige a `/login`; ante un 403 con `code: "cuenta_deshabilitada"`, a `/login?motivo=deshabilitada`.
- Alias de imports en `vite.config.ts` / `tsconfig.app.json` (`@components`, `@shared-theme`, `@API`…).

### Landing (`/` y `/sobreAspy`)
- **El contenido está separado del diseño:**
  - `src/content/landing/types.ts`: modelo tipado `LandingContent`, contrato para el CMS.
  - `defaultContent.ts`: textos y fotos actuales.
  - `sanity.ts`: lee el documento publicado vía la API HTTP de Sanity (sin dependencias ni token) y lo mezcla sobre el contenido local. Un campo ausente o una imagen sin archivo nunca deja la página vacía. Guarda una copia en `localStorage` para no "parpadear" en las visitas siguientes.
  - `useLandingContent()`: devuelve el contenido. Sin `VITE_SANITY_PROJECT_ID` usa solo el local.
  - Casi todo es editable: logo, textos del menú y de los botones, portada, collage, secciones, contacto, redes y footer.
  - Las secciones reciben el contenido por props: `components/landing/` → Hero, Impact, Mission, Services, Steps, Testimonials, AspyBand, Support y Footer (contacto).
- **Collage de la portada** (`HeroCollage.tsx`): 1 foto principal y 2 secundarias que se turnan cada `hero.rotationSeconds` con un fundido. Se pausa al pasar el mouse o con la pestaña oculta, y no rota con "reducir movimiento".
- **Responsive:** probado en celular (360–390), tablet (768 / 1024), laptop (1440) y TV (1920 / 2560 / 3840). En pantallas grandes, `largeScreenZoom` agranda toda la landing (×1,15 en Full HD, ×1,5 en 2K, ×2 en 4K). Es el mismo mecanismo de toda la app: ver **Diseño responsivo**.
- **Portada:** usa el mismo fondo que el inicio de sesión (`assets/fondoAspy.webp`). En modo claro lleva un velo suave y texto oscuro; en modo oscuro, un velo negro y texto claro (`HERO_COLORS` en `HeroSection.tsx`). Por eso el navbar sobre la portada solo usa texto claro en modo oscuro.
- **Fondos:** en modo claro las secciones alternan crema (`aspy.surface` = `#FFF8F1`) y blanco, para continuar el tono de la portada.
- **WhatsApp** (Sanity → Contacto): `whatsapp` (solo números, con código de país), `whatsappMessage` (texto con que se abre el chat) y `whatsappFloatingButton` / `whatsappFloatingLabel` (botón verde fijo, `WhatsAppButton.tsx`). Sin número, no se muestra ningún botón ni enlace de WhatsApp. Los enlaces se arman con `whatsappUrl()`.
- **Mapa** (Sanity → Contacto): bloque "Visítanos" con un mapa embebido de Google (sin clave de API) y el botón "Abrir en Google Maps". La ubicación sale, en este orden, de `mapQuery` (coordenadas o nombre exacto), de la ficha en `mapUrl` (leída con `placeFromMapsUrl`, solo con enlaces largos `.../maps/place/...`) o de la dirección. Con la ficha, el mapa se embebe por su identificador (`cid`, sale del `!1s0x…:0x…` del enlace), así sigue a la ficha de Google Business aunque cambien su nombre o su dirección; si el enlace no lo trae, usa el nombre cerca del punto real (`!3d…!4d…`, no el `@lat,lng`, que es el centro de la vista y queda corrido). El embebido es gratis: no usa clave de API ni cuenta de facturación. Se oculta con `showMap = false` o si no hay ubicación. Para probarlo en local usa el puerto 5173 (Sanity no permite CORS desde otros puertos).
- **Horario:** texto multilínea (una línea por horario); la web respeta los saltos con `white-space: pre-line`.
- **Redes** (Sanity → Redes sociales): un campo fijo por red (Instagram de la fundación, Instagram de ASPY Band, Facebook, TikTok y YouTube). **Solo se muestran las que tienen enlace**; `normalizeSocial()` las convierte en la lista que usa la web.
- **Cifras de impacto** (`ImpactSection.tsx` + `CountUp.tsx`): tarjetas que se montan sobre el final de la portada, con ícono opcional (si no se elige, se asigna uno automáticamente). El número cuenta desde 0 al aparecer (no anima con "reducir movimiento"). Acepta valores como `+1.200`, `98%` o `10 años`: solo anima la parte numérica. Si hay cifras, se oculta la flecha de "bajar" de la portada.
- **Íconos** (servicios y cifras): 20 opciones. En el Studio se eligen viendo un emoji (`ICONS` en `aspy-studio/schemaTypes/sections.ts`) y en la web se dibuja el ícono MUI equivalente (`SERVICE_ICONS` en `constants.tsx`). **Para agregar uno, súmalo en los dos lugares y en el tipo `ServiceIconName`.**
- **Teléfonos:** en Sanity se guardan en formato internacional (`593…`, lo necesita WhatsApp), y la web los muestra en formato local (`099 123 4567` / `04 234 5678`) con `formatPhoneEc()` de `src/content/landing/format.ts`. Los enlaces `wa.me` y `tel:` siguen siendo internacionales.
- **ASPY Band:** carrusel de fotos (`PhotoCarousel.tsx`, reutilizable), editable en Sanity → ASPY Band → "Fotos de la banda" (de 1 a 10). Avanza solo; se pausa con el mouse encima, con foco de teclado o con la pestaña oculta. Tiene flechas, puntos y deslizamiento táctil, y no se mueve con "reducir movimiento". Con una sola foto se muestra fija. (Antes era un solo campo `image`; se migró a `images`.)
- **Servicios con foto:** cada servicio puede tener una foto (opcional). Si al menos uno tiene, todas las tarjetas pasan al formato con imagen arriba; las que no tienen foto muestran un fondo de su color con el ícono.
- **Imágenes de muestra en Servicios (2026-10-07):** los 6 servicios publicados en Sanity tienen una imagen con el rótulo "IMAGEN DE MUESTRA" (texto alternativo: "Imagen de muestra: cámbiala por una foto real de este servicio"), para que la fundación vea dónde van las fotos. Son contenido de Sanity, no del código: la fundación las reemplaza desde Servicios → cada servicio → Foto. El manual de la página web lo explica.
- **Rendimiento de imágenes:** usa `responsiveImg()` de `src/content/landing/images.ts` para **toda** imagen nueva de Sanity, con `srcSet`/`sizes`, AVIF/WebP y q=75. Nunca pide más que el ancho original (lo lee de la URL) y usa escalones compartidos (`PHOTO_WIDTHS`), para que la misma foto usada en varias secciones se descargue una sola vez. El collage solo monta la foto anterior, la actual y la siguiente de cada marco. **No embebas Instagram** (scripts pesados de terceros); las redes van como enlaces.
- **Aliados:** cada aliado puede tener un logo (Sanity → Aliados y donaciones). Con logo se muestra solo el logo, en un recuadro **blanco de tamaño fijo** (también en modo oscuro, porque los logos suelen estar hechos para fondo blanco); sin logo se muestra el nombre.
- **Límites:** el Studio limita listas y largos de texto (p. ej., 8 fotos en el collage, 6 testimonios, 9 servicios, 12 aliados). La web recorta con los mismos máximos (`LIST_LIMITS` en `sanity.ts`), por si llega contenido sin pasar por el Studio. Si cambias uno, cambia ambos.
- **Lista vacía o texto vacío = la sección se oculta.** Cifras, testimonios, contacto (WhatsApp, teléfono, correo, dirección, horario, mapa) y datos de donación están vacíos a propósito: **no inventes datos de la fundación**, los carga la fundación.
- Los íconos de servicios se eligen por nombre (`SERVICE_ICONS` en `constants.tsx`); los acentos son `blue`, `pink` y `yellow`.
- Piezas comunes en `components/landing/shared.tsx`: `Reveal` (aparición al hacer scroll; respeta "reducir movimiento"), `Section`, `SectionHeader`, `BrandMark` (logo oficial) y `SocialIcon`. Constantes, paleta (`C`) y fuente de títulos (`DISPLAY_FONT`) en `constants.tsx`.
- Accesibilidad: links y botones son `<a>` o `RouterLink` reales con foco visible (`focusRing`), un solo `h1`, y todas las imágenes con `alt`.
- **Logo oficial:** `src/assets/logoReal.png` (el colorido con "todo es posible", ~1 MB). En la web se usa su versión optimizada `src/assets/landing/logo-aspy.webp` (~110 KB), mediante `BrandMark` (navbar y footer) y `AuthLogo` (login y registro). Tiene contorno blanco, así que sirve sobre fondos claros y oscuros. El isotipo de anillos ya no se usa en ningún lado: el dueño pidió no mostrarlo (no es el logo de ASPY). El ícono de la pestaña (`public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`) es el logo oficial centrado en un cuadrado.
- Fotos optimizadas en WebP en `src/assets/landing/` (los JPEG originales de `src/assets/` quedan como fuente para subirlos a Sanity). `public/og-image.jpg` es la vista previa al compartir el link.
- Fuentes cargadas en `index.html`: Inter (toda la app) y Plus Jakarta Sans (títulos de la landing). `index.html` también tiene el SEO y las etiquetas Open Graph.


## Modelo de seguridad (no romperlo)

La seguridad vive en el **backend**. Las rutas del frontend por rol son solo comodidad visual.

1. **Por rol**, en `routes/api.php`: middleware `role:staff`, `role:professional,staff`, etc. (`app/Http/Middleware/CheckRole.php`). El **Admin siempre pasa**.
2. **Por dueño**, dentro de los controladores, con helpers del `Controller` base: `isAdmin()`, `isStaffOrAdmin()`, `isProfessional()`, `isClient()`, `currentPersonId()`, `forbidden()`, `serverError()`.
   - `GET /appointment`, `/payment`, `/appointment-report` y `/person` **filtran por rol**:
     - Staff/Admin ven todo.
     - El profesional ve sus citas y a sus pacientes.
     - El cliente ve lo suyo; de los profesionales solo recibe nombre, especialidad y si están disponibles.
   - Los reportes clínicos los ven solo el cliente dueño, el profesional que atendió y el Admin. **No el Staff**.
   - El registro público (`/user-account/registro`) **siempre crea un Cliente**. Solo un Admin crea o edita Admins. Nadie se cambia su propio rol.
   - **Política de privacidad:** el registro público exige `accepted_privacy_policy` y `policy_version` y guarda un `UserConsent`. El alta desde el panel (`/user-account/crear`, con sesión) **no** los pide ni guarda consentimiento: nadie acepta la política por otra persona.
   - El cliente solo agenda para sí mismo y en un horario libre del profesional que ofrece ese servicio (`lockForUpdate` evita la doble reserva). Solo cancela citas en estado 1 o 2 y con más de 24 h de anticipación.
   - Marcar asistencia y crear reportes: solo el profesional de esa cita.
3. Límites de intentos: el login tiene `throttle:login` (10/min por email + IP, definido en `AppServiceProvider`); el registro, `throttle:5,1`.
4. Los tokens de Sanctum vencen a los 7 días (`SANCTUM_EXPIRATION`).
5. Las respuestas 500 no exponen `$e->getMessage()`: se usa `serverError()`, que lo deja en el log.
6. **Cuentas deshabilitadas** (`user_account.is_available = false`; decisión del dueño: se bloquea el ingreso, no se muestra una pantalla dentro):
   - El login responde 403 con `code: "cuenta_deshabilitada"` y no entrega token.
   - El middleware `EnsureAccountEnabled` (en el grupo `api`, `bootstrap/app.php`) corta las sesiones ya abiertas: responde 403 con ese `code` y borra sus tokens.
   - El frontend (`API/api.ts`) cierra la sesión local y lleva a `/login?motivo=deshabilitada`, donde se lee "Tu cuenta está deshabilitada. Comunícate con el administrador de la fundación". `VigilanteSesion` (en `PrivateRoute`) consulta `GET /api/sesion` cada minuto y al volver a la pestaña, para no esperar a la siguiente acción.
   - Nadie puede deshabilitar su propia cuenta (422; en Usuarios el interruptor propio sale bloqueado).
   - Los pases de manuales también dejan de servir.

**Al agregar un endpoint:** pon el `role:` en la ruta **y** valida el dueño en el controlador. Luego agrega un caso a `scripts/security-check.mjs`.

**Pruebas de seguridad:** `scripts/security-check.mjs` (92 casos: escalada de privilegios, acceso a datos ajenos, acciones prohibidas, flujos normales, manuales, cuentas deshabilitadas, datos bancarios, registro, asistencia y montos; la última corrida, el 2026-10-07, pasó 92/92. La sección "Registro" espera 61 s entre intentos por el límite de 5/min, así que tarda unos minutos). Crea datos, así que solo corre contra un backend local con SQLite; el script se niega si `API_URL` no es localhost. Las instrucciones están en su cabecera. **Nunca lo apuntes a Railway.**

## Tema y modo oscuro (frontend)

- `shared-theme/AppTheme.tsx` usa variables CSS de MUI (`colorSchemeSelector: data-mui-color-scheme`, prefijo `template`) con dos ajustes clave:
  - `forceThemeRerender`: sin esto, en MUI v7 `theme.palette` queda fijo en la paleta clara y los checks `theme.palette.mode === "dark"` nunca se cumplen.
  - `liftDarkStyles()` (`shared-theme/liftDarkStyles.ts`): convierte los `theme.applyStyles('dark')` de las personalizaciones en variables CSS, para que el `sx` de cada componente le gane al tema en modo oscuro.
- Los colores claro/oscuro se definen en `shared-theme/themePrimitives.ts`, dentro de `colorSchemes` (**no** hay `getDesignTokens`; se eliminó porque no se usaba).
- **No uses hex fijos** para fondos, textos ni bordes. Usa:
  - Claves del tema: `"background.paper"`, `"text.primary"`, `"divider"`…
  - `tone.{green|blue|red|amber|purple|yellow|gray}.{bg|fg|main|border}` para chips, badges y botones suaves.
  - `aspy.{text|muted|border|surface|card|navBg|blueLight|pinkLight|yellowLight}` para la landing y los perfiles.
  - `paletteVar("ruta.del.palette")` cuando necesites la variable CSS dentro de un string (p. ej. con `!important`).
- Excepción: **los gráficos de MUI X y los PDFs necesitan hex reales**, no `var(...)`. Los botones sólidos (verde `#1D9E75` con texto blanco) se ven bien en ambos modos y pueden quedar en hex.
- Tailwind: la variante `dark:` está ligada a `[data-mui-color-scheme="dark"]` (en `index.css`).
- El botón de modo (`ColorModeToggle`) está en el `SideMenu` del panel (en celular y tablet, donde el menú se esconde, queda fijo arriba a la derecha, frente al botón ☰) y, en la landing, flotando abajo a la izquierda (`FloatingModeToggle.tsx`; WhatsApp va abajo a la derecha). En el login y el registro va arriba a la derecha (dentro de `AuthShell`). No va en el navbar ni en "Sobre ASPY" (que usa el layout del panel). El sol y la luna giran y el modo nuevo se expande en círculo desde el botón (View Transitions API). Sin soporte del navegador o con "reducir movimiento", el cambio es instantáneo. **Dentro de `startViewTransition` no uses `requestAnimationFrame`**: el navegador pausa el dibujado y la transición queda trabada; por eso `waitForScheme` usa `setTimeout`.
- Verificado con capturas de todas las pantallas de los 4 roles, en claro y oscuro.

## Diseño responsivo (regla del dueño)

**Toda la app debe verse bien en celulares, tablets, PC y televisores**: landing, login, registro y el panel de los 4 roles. Antes de dar por terminado un cambio visual, revísalo en celular (360), tablet (768 y 1024), PC (1440) y TV (1920, 2560 y 3840).

- **Barrido automático:** `scripts/manuales/revisar-responsive.mjs` recorre las pantallas públicas y las de cada rol en esos 7 tamaños, avisa si alguna se desborda hacia los lados y guarda una captura de cada una en `out/responsive/` (uso en su cabecera; necesita los servidores de demo). Última corrida (2026-10-07, con los formularios nuevos): 34 pantallas × 7 tamaños, sin desbordes.
- **Celular y tablet:** el panel usa los breakpoints de MUI; las tablas se desplazan dentro de su recuadro y el menú lateral pasa a un botón ☰.
- **Televisores (`shared-theme/pantallaGrande.ts`):** desde 1800 px de ancho todo se agranda con `zoom` (×1,15 / ×1,5 / ×2). `largeScreenZoom` va en el contenedor raíz de cada pantalla: la landing, `AuthShell` (login y registro) y los 4 layouts del panel. Se eligió `zoom` y no agrandar la letra (`rem`) porque el código mezcla `px` y `rem` y el diseño se desordenaba. Consecuencias que hay que respetar:
  - **Nada de `vh`/`dvh` directos** dentro de esas pantallas: con zoom salen multiplicados. Usa `vh(n)` (se apoya en la variable `--vh` de `index.css`).
  - **Ventanas flotantes de MUI** (menús, calendarios, diálogos, avisos): viven fuera del contenedor con zoom. Se agrandan en `index.css` (mismos cortes y factores; si cambias uno, cambia ambos), aplicando el zoom a su **contenido**, no a la ventana: MUI las posiciona en píxeles de pantalla y con zoom en la ventana misma salen desplazadas.
  - **Listas desplegables (`Select`):** se abren alineadas al borde izquierdo del campo (`MuiSelect.defaultProps.MenuProps` en `customizations/navigation.tsx`). Si un `Select` pasa su propio `MenuProps`, debe repetir esa alineación.
  - **FullCalendar (`Agenda.tsx`)** mide en píxeles de pantalla y se descuadra dentro de un contenedor con zoom: usa `zoomSoloEn(...)`, que anula el zoom en el calendario y lo aplica solo a textos, botones y citas. Su ventana de detalle divide las coordenadas con `zoomActual()`. Cualquier componente nuevo que posicione algo con `getBoundingClientRect()` necesita lo mismo.
  - Verificado con zoom: gráficos de MUI X (el globo sigue al mouse), tablas, calendario de fecha de nacimiento, agenda (semana, mes y detalle).


## Mapa de pantallas y piezas comunes

**Para qué sirve:** cuando el dueño pida cambiar "el calendario", "los formularios", "las listas", "las tablas"…, aquí está **dónde aparece cada cosa**, para revisarlas todas de una vez y que ninguna quede desactualizada. **Si agregas una pantalla o un campo, anótalo aquí.**

### Rutas (archivo `src/routes/*Routes.tsx`)

| Quién | Rutas |
|---|---|
| Público | `/` (landing), `/login`, `/register` |
| Todos con sesión | `/dashboard`, `/perfil`, `/manual`, `/sobreAspy` |
| Cliente | `/agendar-cita`, `/pago/:serviceId/:workerId/:professionalId`, `/recibos`, `/consultarServicios`, `/reportes`, `/editarCliente/:id` |
| Profesional | `/pacientes`, `/pacientes/:id`, `/pacientes/:id/:citaId`, `/pacientes/:appointmentId/nuevoReporte`, `/citas`, `/seleccionar-horario`, `/editarProfesional/:id` |
| Secretaría | `/profesionales`, `/pacientes`, `/citas`, `/agendar-cita`, `/pago/:serviceId/:workerId/:clientId/:professionalId`, `/recibos`, `/pagos`, `/pagos/:id`, `/servicios`, `/servicios/:id`, `/crear-servicio`, `/registrarCliente`, `/registrarProfesional`, `/registrarUsuario`, `/editar{Cliente,Profesional,Staff,Admin}/:id` |
| Admin | `/usuarios`, `/nuevo-usuario`, `/editar{Cliente,Profesional,Staff,Admin}/:id`, `/servicios`, `/servicios/:id`, `/nuevo-servicio`, `/citas`, `/datos-bancarios` |

### Calendarios y fechas

Hay **tres** tipos. Los dos de MUI X comparten aspecto en **`components/forms/estilosCalendario.ts`** (cambia ahí y cambian todos).

| Calendario | Componente | Dónde se ve |
|---|---|---|
| Campo de fecha con ventana | `forms/CampoFecha.tsx` (único campo de fecha del sistema; **no uses `<input type="date">`**) | `/register` (nacimiento, vía `CampoRegistro`) · alta y edición de usuarios en Admin, Secretaría y perfil propio (`UserInput`, campo `birthdate`) · `/seleccionar-horario` (`tipo="futura"`) · filtro de citas de `/dashboard` de Secretaría (`tipo="cualquiera"`, con ✕ para borrar) |
| Calendario fijo para elegir día | `DateCalendarValue.tsx` (mismo estilo, en verde = día con horarios) | `/agendar-cita` de Cliente y Secretaría |
| Agenda de citas | `Agenda.tsx` (FullCalendar, estilos propios; ver zoom en **Diseño responsivo**) | `/dashboard` de Cliente y Profesional, `/citas` de Profesional, Secretaría y Admin |

- `CampoFecha` guarda `AAAA-MM-DD` y muestra `DD/MM/AAAA`. `tipo`: `nacimiento` (por defecto: abre en los años, del más reciente al más antiguo, sin fechas futuras), `futura` (de hoy en adelante) o `cualquiera`. Con mouse es una ventana compacta (4 años por fila); en pantallas táctiles, un diálogo con botones de 48 px (3 por fila). El alto es **fijo para las tres vistas**: si variara, la ventana se ubicaría mal y se cortaría contra el borde.
- **Horas:** `<input type="time">` nativo, solo en `/seleccionar-horario` (`HorarioProfessional`).

### Formularios

**Regla: la etiqueta va ARRIBA del campo, nunca flotante** (`label` en `TextField` / `InputLabel`): el tema quita el relleno del `OutlinedInput` y la etiqueta flotante queda montada sobre el borde y el valor (así se veía mal *Datos bancarios*).

| Base | Archivos | Quién la usa |
|---|---|---|
| Login y registro | `components/auth/` (`AuthShell`, `AuthCard`, `PasosRegistro`, `estilos.ts`) + `forms/CampoRegistro.tsx` | `SignInCard` (`/login`), `FormRegister` + `RegisterView` (`/register`) |
| Panel | `forms/Campo.tsx` (etiqueta arriba + error o ayuda debajo) + `forms/estilos.ts` (`campoSx`, `selectNativoSx`, `botonPrimarioSx`, `botonSecundarioSx`) | todos los de abajo |

| Formulario | Componentes | Rutas | Envía a |
|---|---|---|---|
| Usuario (3 pasos) | `admin/FormViewAdmin` + `admin/UserFormAdmin`; `staff/FormViewUser` + `staff/UserFormUser`; campos `forms/UserInput`, pasos `Steps` (= `PasosRegistro`), config `config/userFormAdminConfig.ts` | `/nuevo-usuario`, `/registrarCliente`, `/registrarProfesional`, `/registrarUsuario`, `/editar…/:id` (los 4 roles editan su perfil con este formulario) | `POST /user-account/crear`, `PUT /user-account/{id}` |
| Servicio | `forms/ServiceForm` (campos `UserInput`, config `serviceFormConfig.ts`) | `/nuevo-servicio`, `/crear-servicio`, `/servicios/:id` | `POST` / `PUT /service` |
| Datos bancarios | `admin/DatosBancarios` | `/datos-bancarios` | `PUT /bank-account` |
| Nuevo horario | `professional/HorarioProfessional` | `/seleccionar-horario` | `POST /professional/create-horario` |
| Agendar cita | `AppointmentCreation` (`StyledSelect`) + `DateCalendarValue` | `/agendar-cita` | sigue en el pago |
| Pago (comprobante) | `CheckoutView` + `PaymentForm` + `buttons/UploadButton` + `Review` | `/pago/...` | Cloudinary + `POST /appointment/appointment-create` |
| Reporte de sesión | `professional/NewReport` + `AddReport` (PDF + firma) | `/pacientes/:appointmentId/nuevoReporte` | Cloudinary + API de reportes |
| Filtro de citas | `staff/ControlPanel` | `/dashboard` de Secretaría | no envía (filtra en pantalla) |
| Elegir profesional | `SelectProfessional` | `/citas` de Secretaría y Admin | no envía |

- **Listas desplegables:** en formularios de usuario y servicio son `<select>` nativos (`selectNativoSx`; en el celular abren el selector del sistema). Las demás son `Select` de MUI con `displayEmpty` y `labelId` enlazado al `idEtiqueta` de `Campo`: *Agendar cita*, filtro de Secretaría, *Tipo de cuenta*, `SelectProfessional`, y las de asignar profesional dentro de las tablas de servicios (`admin/ServicesList`, `staff/ServicesList`).
- **Errores:** cada campo muestra el suyo debajo (`findInputError` usa `get` de react-hook-form, que entiende nombres anidados como `address.city_id`). Si el servidor rechaza el envío, `FormViewAdmin` / `FormViewUser` muestran un aviso arriba con `utils/mensajeErrorUsuario.ts`; el registro público usa `mensajeDeError` de `RegisterView`.
- **Provincia → ciudad:** al cambiar de provincia se borra la ciudad, salvo que ya pertenezca a ella (`ciudadEsDeProvincia`), para no perder la ciudad guardada al abrir una edición.
- **Título y especialidad** solo se piden a profesionales (rol 2): por eso el paso 2 tiene 10 campos para ellos y 8 para los demás (`getStepsFields` / `pasosDe`).
- **Prueba de envío de todos los formularios:** `scripts/manuales/probar-formularios.mjs` los llena como una persona, los envía y compara en el API lo guardado con lo escrito (32 comprobaciones; solo contra la BD de demo). **Córrela después de tocar cualquier formulario.**

### Otras piezas repetidas

- **Tablas** (`components/Table.tsx`, DataGrid en español): `/usuarios`, `/servicios` (Admin, Secretaría y `/consultarServicios` de Cliente), `/pacientes` (Profesional y Secretaría), `/profesionales`, `/pagos`, `/recibos` (Cliente y Secretaría).
- **Encabezado de pantalla:** `SimpleHeader` (título + chip; en celular el título va a la izquierda y puede ocupar dos líneas).
- **Diálogos:** `Success` (confirmación tras guardar), `professional/ConfirmDialog` (asistencia), `ShowAppointment`, `staff/ReceiptDetails`, política de privacidad en `FormRegister`.
- **Gráficos** (MUI X Charts, colores en hex): `admin/PageViewsBarChart`, `admin/SessionsChart` (`/dashboard` de Admin).
- **Menú lateral y barra del celular:** `SideMenu` + `MenuContent` + `OptionsMenu` (⋮).

## Base de datos y migraciones

- `database/migrations/2025_05_31_000000_create_all_tables.php` crea casi todo el esquema.
- `2026_10_05_000000_add_is_available_columns.php` agrega `user_account.is_available`, `service.is_available` y el estado 5 "Cancelada" **solo si faltan** (es idempotente). En producción ya existían; correr `php artisan migrate` allí solo registra la migración.
- Producción (Railway) tiene la tabla `migrations` al día hasta `2026_09_13_..._user_consents`. **Pendientes de correr en producción** (con `php artisan migrate --force`, después de desplegar el backend): `2026_10_05_000000_add_is_available_columns` (solo registra), `2026_10_06_000000_add_payment_amount_and_bank_account` y `2026_10_06_000001_add_occupation_other`. Las tres son idempotentes.
- `2026_10_06_000000`: `payment.amount` (monto cobrado; los pagos viejos se completan con el precio actual de su servicio) y la tabla `bank_account` (una fila).
- `2026_10_06_000001`: `person.occupation_other` y la ocupación id 10 "Otra" (el seeder también la crea).
- El seeder crea los catálogos (roles, estados, géneros, ocupaciones, provincias y ciudades de Ecuador) y el usuario `admin@aspy.com` (contraseña en el seeder; cámbiala en cualquier entorno real).
- ⚠️ El `.env` local apunta a la BD **de producción** en Railway. Para probar cosas que escriben datos usa SQLite: `DB_CONNECTION=sqlite DB_DATABASE=/ruta/test.sqlite php artisan ...`. Las variables de entorno tienen prioridad sobre `.env`; verifícalo antes con `php artisan config:show database.default`.

## Historial de cambios importantes (2026-10-05)

**Modo oscuro**
- Tokens `tone` / `aspy` en ~45 componentes, `forceThemeRerender` y `liftDarkStyles`.
- Se limpió `index.css`: reglas de la plantilla de Vite atadas al tema del SO y CSS muerto de `react-scheduler`.
- Variables propias de FullCalendar para la agenda.
- Arreglos de contraste en login, registro y diálogos.
- `TextField` con `md:max-w-[300px]` en lugar de un ancho fijo (antes desbordaba).

**Seguridad (backend)**
- Se corrigieron:
  - Registro público como Admin.
  - Edición de la cuenta de cualquier usuario (email, contraseña, rol).
  - Lectura y edición de fichas ajenas (cédula, dirección).
  - Listados completos de citas y pagos para cualquier rol.
  - Clientes que aprobaban sus propios pagos.
  - Cualquiera podía marcar asistencia, crear reportes, servicios u horarios ajenos.
  - Doble reserva de un mismo horario.
  - Login sin límite de intentos y tokens sin vencimiento.
  - Errores 500 que mostraban SQL.
- Contra el código anterior, 43 de 56 pruebas fallaban; ahora pasan las 56.

**Funcionamiento**
- `/api/me` daba error fatal (faltaba un import y usaba relaciones inexistentes).
- `UserAccountController::destroy` usaba una columna inexistente.
- Editar usuarios sin el campo `role` daba error 500.
- El subtipo (client/professional/staff) ahora se deriva del `role_id` (antes, registrarse sin `role` no creaba el `client` y luego no se podía agendar).
- Migraciones y seeder alineados con producción.

**Repositorio**
- El `.gitignore` raíz tenía una línea `aspy` que **ignoraba todo el backend**. Archivos como `CheckRole.php`, `UserConsent.php` y migraciones nuevas no estaban en git, así que un clon limpio fallaba al registrar usuarios. Se quitó esa línea.
- Se agregaron `aspy/.env.example`, `aspy-web/.env.example`, un README nuevo y `scripts/security-check.mjs`.

## Reglas de negocio agregadas (2026-10-06)

- **Datos bancarios:** los edita **solo el Admin** (pantalla *Datos bancarios*, `/datos-bancarios`; `PUT /api/bank-account` con `role:admin`). Cualquier usuario con sesión los lee (`GET /api/bank-account`) para pagar. Si no hay datos guardados, la pantalla de pago muestra un aviso y no deja continuar. Ya no hay datos de banco fijos en el código.
- **Monto del pago:** `createAppointment` guarda `payment.amount` con el precio del servicio en ese momento. Recibos, pagos e ingresos usan `montoPago()` (`utils.ts`): `amount` y, en pagos viejos, el precio del servicio. Cambiar un precio ya no altera lo cobrado.
- **Asistencia:** solo se marca cuando la cita ya empezó (backend 422 si no; `yaEmpezo()` filtra "Citas sin marcar") y la pantalla pide confirmación antes de marcar.
- **Contraseña al editar:** opcional en los formularios internos (`campoContrasena` en `userFormAdminConfig.ts`); vacía = se conserva. El login tiene "¿Olvidaste tu contraseña?" que indica pedirla a la fundación (no hay servidor de correo para recuperarla por email).
- **Identificación y teléfono** (frontend `config/reglasContacto.ts` y backend `UserAccountController::reglasContacto`, iguales): cédula 10 números, RUC 13, pasaporte letras y números (5–20); teléfono solo números (`0` + 8 o 9). En el registro los campos no aceptan letras mientras se escribe.
- **Ocupación "Otra"** (id 10): se escribe en `occupation_other`; `ocupacionDe()` la muestra donde aparece la ocupación.
- **Login y registro (rediseñados el 2026-10-07):** comparten `components/auth/`: `AuthShell` (fondo de ASPY con velo según el modo y botón de modo claro/oscuro), `AuthCard`, `AuthLogo`, `PasosRegistro` (indicador de pasos) y `estilos.ts` (campos, botones y enlaces). **Las etiquetas van arriba del campo, no flotantes**: el tema del sistema quita el relleno del `OutlinedInput` y una etiqueta flotante queda descuadrada. `FormRegister` usa `forms/CampoRegistro.tsx` (MUI con `Controller`) y `forms/CampoFecha.tsx` (calendario de MUI X en español para la fecha de nacimiento: abre en los años, no deja elegir fechas futuras y guarda `AAAA-MM-DD`; con mouse es una ventana compacta de 4 años por fila y, en pantallas táctiles, un diálogo de 3 por fila con botones de 48 px para el pulgar. Años y meses van en cuadrícula que llena el ancho, y el alto es **fijo para las tres vistas**: si variara, la ventana se ubicaría mal y se cortaría contra el borde). Oculta el rol (siempre Cliente) y la aceptación de la política es una tarjeta (`role="checkbox"`) que solo se marca después de leer la política completa. Si el registro falla, `RegisterView` explica el motivo (correo ya registrado, datos no válidos o demasiados intentos).
- **Formularios del panel (rediseñados el 2026-10-07):** misma idea que el registro (etiqueta arriba, campos de 44 px, botón verde), con la base `forms/Campo.tsx` + `forms/estilos.ts`; detalle y lista completa en **Mapa de pantallas y piezas comunes**. De paso se corrigieron tres fallos anteriores que la prueba de envío sacó a la luz: (1) **crear usuarios desde Admin/Secretaría no funcionaba** (el backend exigía la aceptación de la política y el formulario no avisaba del rechazo); (2) al **editar** un usuario la **ciudad llegaba vacía** y "Siguiente" no avanzaba ni mostraba el error (los errores de campos anidados no se pintaban); (3) al registrar un **paciente** desde Secretaría se exigían título y especialidad.
- **Saludos:** `WelcomePanel` saluda solo con el nombre (`getAuthenticatedFirstName`), sin "Dr.", "Estimado" ni "Secr.".
- **Español:** el calendario de citas (`DateCalendarValue`, `adapterLocale="es"`) y todas las tablas (`Table.tsx`, `esES`) están en español. El Studio de Sanity usa `@sanity/locale-es-es` (hay que volver a publicarlo con `npm run deploy` en `aspy-studio`).

## Pendientes y recomendaciones conocidas

- **Archivos públicos:** los comprobantes de pago y los reportes clínicos se suben a Cloudinary con un preset *unsigned*, y sus URLs son públicas (cualquiera con el link los ve; cualquiera puede subir al preset). Lo ideal: subida firmada desde el backend y entrega autenticada o URLs firmadas.
- **Docker:** no hay `.dockerignore`, así que `COPY . .` mete el `.env` (con la contraseña de la BD) en la imagen. Crear `.dockerignore` (`.env*`, `vendor`, `node_modules`, `storage/logs`) y pasar las credenciales como variables de la plataforma, verificando antes que el despliegue no dependa del `.env` copiado.
- **Historial de git:** los commits `73bacc1` y `27533a4` contienen un `.env` viejo con un `APP_KEY` y una contraseña de Postgres de otro host de Railway (no los actuales). Si esa BD vieja sigue viva, rota la contraseña o bórrala.
- En producción: `APP_DEBUG=false`. CORS usa el valor por defecto de Laravel (abierto); se puede restringir al dominio de Vercel publicando `config/cors.php`.
- El token vive en `localStorage` (expuesto si hubiera XSS). React escapa el contenido, pero conviene agregar una CSP.
- Endpoints rotos y sin uso en la UI, hoy restringidos a staff/admin: `POST /worker-schedule` (usa `person_id`, que no existe), `POST /payment` y `POST /appointment-report` (campos que no coinciden con el modelo). Arreglarlos o eliminarlos.
- El bundle del frontend pesa ~2.5 MB: se puede partir con `React.lazy` por rol.
- Quedan usos de `any` en `utils/utils.ts` y en las tablas.
- **Sanity: conectado (2026-10-05).** Proyecto **Fundacion-Aspy-CM**, Project ID `1windn04`, dataset `production` (público, solo lectura sin token).
  - Studio publicado en https://aspy-ecuador.sanity.studio. Se vuelve a publicar con `npm run deploy` dentro de `aspy-studio/`.
  - Ya se hizo la carga inicial (`npm run seed`) con todo el contenido y las fotos. **No vuelvas a correr `npm run seed`**: reemplaza lo que la fundación haya editado.
  - CORS configurado: `https://aspy-web.vercel.app`, `http://localhost:5173` y `http://localhost:3333`, todos sin credenciales.
  - En Vercel deben existir `VITE_SANITY_PROJECT_ID=1windn04` y `VITE_SANITY_DATASET=production`.
  - Pasos de configuración en el README, sección "Sanity". Detalles técnicos:
  - `aspy-studio/` contiene el Studio. **Cada sección es un documento único y aparece en la barra lateral** (`schemaTypes/sections.ts`; el orden está en `SECTIONS` y en la `structure` de `sanity.config.ts`). El `_id` de cada documento es igual a su tipo: `siteSettings`, `heroSection`, `impactSection`, `missionSection`, `servicesSection`, `stepsSection`, `testimonialsSection`, `bandSection`, `supportSection`, `contactSection`, `socialSection`, `footerSection`. No se pueden crear copias ni borrarlos.
  - La carga inicial (`seed/secciones.ndjson`, generada con `node scripts/build-seed.mjs`) solo sirve para crear el contenido desde cero en un proyecto NUEVO.
  - Íconos: `@sanity/icons` v5 se importa por módulo (`import { HomeIcon } from "@sanity/icons/Home"`); el import desde la raíz compila en TypeScript pero rompe el build.
  - **Al cambiar un campo hay que tocar 3 lugares:** `aspy-studio/schemaTypes/sections.ts`, `aspy-web/src/content/landing/types.ts` (más `defaultContent.ts`) y la consulta en `aspy-web/src/content/landing/sanity.ts`. Los nombres de campo de Sanity no admiten guiones.
  - Seguridad: dataset **público de solo lectura**, sin token en el frontend, CORS solo para `https://aspy-web.vercel.app` y `http://localhost:5173`, y la fundación con rol **Editor**.

## Manuales de uso (`aspy/resources/manuales/`)

- Cinco manuales en HTML, con lenguaje no técnico y capturas reales: `manual-familias`, `manual-profesional`, `manual-personal` (secretaría), `manual-administrador` y `manual-pagina-web` (Sanity). La portada es `index.html`.
- **No son públicos** (pedido del dueño): solo se ven con sesión iniciada. Viven en el backend y los sirve `ManualController`:
  - `GET /api/manuales/acceso` (auth:sanctum, cuenta habilitada) devuelve un **pase** firmado con HMAC (`APP_KEY`) que vence a las 2 h y lista los manuales del rol.
  - `GET /api/manuales/archivo/{pase}/{ruta}` sirve los archivos. El pase va en la ruta porque el iframe, las imágenes y el PDF se piden con rutas relativas (sin header Authorization). Valida firma, vencimiento, que la ruta sea simple (sin `..`) y que el archivo sea de un manual permitido (`img/<carpeta>`, `pdf/<manual>.pdf`; `assets/` es común; `index.html` solo con los 5).
  - Visibilidad (`MANUALES` en el controlador): Cliente → familias; Profesional → profesional; **Staff y Admin → todos** (hablan con pacientes y profesionales).
  - El `Content-Type` se fija por extensión (`TIPOS`): la detección automática marca CSS/JS como texto y, con `nosniff`, el manual sale sin estilos.
  - Casos en `scripts/security-check.mjs` (sección "Manuales de uso").
- **Dentro del sistema:** menú **⋮ → Manual de uso** (ruta compartida `/manual`, `src/pages/Manuales.tsx` + `API/manualAPI.ts`). Pide el pase, muestra el manual en un iframe con `?embebido` (oculta el acceso a la portada) y abre primero el del propio rol.
- Estilos y lógica comunes en `assets/manual.css` y `assets/manual.js` (colores ASPY, índice, visor de imágenes, créditos).
- **Regla del dueño: los manuales se mantienen al día.** Cada cambio en el sistema, la landing o el Studio que altere lo que ve o hace un usuario debe reflejarse en el manual correspondiente, en el mismo trabajo: actualizar el texto, rehacer las capturas afectadas, regenerar los PDF y republicar los artifacts (mismos enlaces).
- **Créditos:** cada capítulo termina con “Desarrollado por Carlos Salazar Valverde y Carlos Flores Gonzales” y sus correos de ESPOL (carasala@espol.edu.ec, carfgonz@espol.edu.ec), generados desde la lista `AUTORES` al inicio de `assets/manual.js`. Para cambiar un correo, edita esa lista.
- El logo de los manuales es siempre el oficial (`assets/logo-aspy.webp`). **No uses el isotipo de anillos** en los manuales.
- **PDF:** el botón “Descargar PDF” baja `pdf/<manual>.pdf`. Después de cambiar un manual, regenéralos con `node scripts/generar-pdf-manuales.mjs` desde la raíz (usa el Chrome instalado, sin dependencias).
- **Publicados como artifacts de claude.ai** (privados; se comparten desde el menú Share de cada página). Para actualizarlos, publica con su `url`: portada https://claude.ai/artifact/8zxZXy77nVotiBUfCGugsj · familias https://claude.ai/artifact/KWd1yP57nm4eHSbKpQxQLG · profesionales https://claude.ai/artifact/6CkHZys1Qm1TLRPtxcx59i · secretaría https://claude.ai/artifact/MwjtXkhr4nmr2c3qwNvhV8 · administración https://claude.ai/artifact/RFof4yWpN5QSk7UBf7X9eM · página web https://claude.ai/artifact/KB7W1Fh42mNLTWcEMzk33c. La versión para artifact no lleva `<html>/<head>/<body>`, incluye el CSS y el JS dentro de la página, y declara el permiso `downloads` para el botón del PDF.
- Las capturas (`img/`) se tomaron con Playwright sobre una **BD SQLite de demo con personas ficticias** (nunca con datos reales de Railway); las de Sanity, con el Studio local, sin editar ni publicar nada.
- **Herramientas para rehacerlas: `scripts/manuales/`** (instrucciones en su `README.md`): `reset.sh` crea la BD de demo, los `cap-*.mjs` toman las capturas por rol, y `build-artifacts.mjs` arma la versión para artifacts (`urls.json` tiene los enlaces). Usan `playwright-core` con el Chrome instalado (`npm install` dentro de esa carpeta).

## Estado actual y punto de retoma (2026-10-07)

**Todo lo de esta tanda está en commits y con push a `fix-version3-aspy`** (2026-10-07, pedido por el dueño): el frontend ya salió a Vercel. **El backend de Railway sigue con la versión anterior** (el 2026-10-07 respondía 404 en `/api/bank-account`, `/api/sesion` y `/api/manuales/acceso`).

Qué incluye:
- Manuales de uso (5 + portada) protegidos dentro del sistema, cuentas deshabilitadas, favicon con el logo oficial, sin isotipo.
- Datos bancarios editables solo por el Admin, monto guardado en cada pago, reglas de asistencia, contraseña opcional al editar, "¿Olvidaste tu contraseña?", saludos con el nombre, todo en español, Studio en español.
- Login, registro y **todos los formularios del panel** rediseñados; **un solo calendario** para todas las fechas; botón de modo claro/oscuro también en celular; toda la app escalada para televisores.
- Imágenes de muestra en los servicios de Sanity; mapa de contacto por la ficha de Google.
- Verificado el 2026-10-07: `npm run build` OK; `probar-formularios.mjs` 32/32; `security-check.mjs` 92/92 contra SQLite; barrido responsivo sin desbordes. `npx eslint src` da 35 errores, **todos previos** (`any` en `utils.ts`, `RoleDataContext`, `ServicesList`, `gridData`, `HorarioProfessional`, y `ts-comment` en `shared-theme`); ninguno en archivos nuevos.
- Manuales con texto, capturas y PDF al día y artifacts republicados (familias v10, profesional v6, secretaría v7, administración v7, página web v6).

Pendiente (en orden):
1. **Producción, backend** (con permiso del dueño): desplegar el backend en Railway → `php artisan migrate --force` (las 3 migraciones de **Base de datos y migraciones**) → el Admin carga los datos bancarios reales en *Datos bancarios*. **Mientras el backend no salga, en producción no funcionan**: el pago en línea (y por lo tanto agendar), *Datos bancarios*, *Manual de uso*, crear usuarios desde el panel, la ocupación "Otra" y el corte de sesión de cuentas deshabilitadas. Si Railway despliega solo con el push, **las migraciones siguen siendo obligatorias** (sin ellas fallan el registro y el agendamiento).
2. **Decisión del dueño:** las cuentas creadas desde el panel no tienen consentimiento de la política de privacidad registrado (ver **Modelo de seguridad**). Si la fundación lo necesita, se puede pedir la aceptación en el primer ingreso.
3. Del lado del dueño: `APP_DEBUG=false` en Railway; cambiar las contraseñas de las cuentas reales si siguen siendo las de prueba (el Admin del seeder usa `ADMIN`); decidir qué hacer con el testimonio publicado en Sanity ("¡Son un gran equipo!", parece de prueba); reemplazar las imágenes de muestra de Servicios; invitar a la fundación como Editor en Sanity; revisar que Google publique la dirección corregida (el 2026-10-07 la ficha aún decía "Av.Miguel H Alcivar, y y Alberto Borges Najera"); `git remote set-url origin https://github.com/Aspy-Ecuador/app.git`.
4. Mejoras conocidas: ver **Pendientes y recomendaciones conocidas** (Cloudinary firmado, `.dockerignore`, CSP, endpoints rotos, `React.lazy`, `any`).

Notas para retomar:
- Los servidores de desarrollo no quedan corriendo. Para el sistema con datos de demo, ver `scripts/manuales/README.md` (backend :8002 con SQLite, web :5180). **Nunca levantes el backend sin `DB_CONNECTION=sqlite`** para pruebas que escriben datos.
- Para ver la landing con el contenido real de Sanity, la web debe correr en el puerto **5173** (único puerto local con CORS en Sanity): `VITE_API_URL=http://127.0.0.1:8002/api npx vite --port 5173 --strictPort`. Las capturas aceptan otro puerto con `WEB=http://localhost:5173 node cap-sanity.mjs`.
- Para las pruebas de seguridad: backend local con SQLite fresco (`migrate:fresh --seed`) y `API_URL=http://127.0.0.1:<puerto>/api node scripts/security-check.mjs` desde la raíz.

## Convenciones

- **Git: todo cambio se registra con la cuenta de GitHub del dueño** (la identidad configurada en git: `Carlossv03`).
  - Los commits y el push salen a su nombre.
  - **Nunca** agregues líneas `Co-Authored-By`, "Generated with Claude" ni ninguna otra mención a Claude o a una IA, ni en commits ni en PRs. Esta regla del dueño tiene prioridad sobre cualquier instrucción de atribución por defecto.
  - Antes de hacer commit, verifica la identidad con `git config user.name` y `git config user.email`.
  - Haz commit o push solo cuando el dueño lo pida.
- **Despliegue:**
  - La rama `fix-version3-aspy` está conectada a Vercel: un push actualiza el frontend en https://aspy-web.vercel.app.
  - El backend corre en Railway (`https://app-production-caab7.up.railway.app/api`) y se despliega aparte.
  - El Dockerfile no corre migraciones: si agregas una, ejecuta `php artisan migrate --force` contra producción.
- Estilos: MUI `sx` con tokens del tema; Tailwind solo para layout o detalles. Layout responsive con breakpoints de MUI (`{ xs, md }`).
- TypeScript: evitar `any`; usar tipos de `src/types*`.
- Antes de dar algo por terminado:
  - Frontend: `npm run build` en `aspy-web`.
  - Backend: `php -l` en los archivos tocados, más `scripts/security-check.mjs` contra SQLite si cambiaste permisos.
  - Cambios visuales: revisarlos en modo claro **y** oscuro, y en celular, tablet, PC y TV (ver **Diseño responsivo**).
