# CLAUDE.md: contexto del proyecto Aspy

Guía para cualquier sesión de Claude (u otra persona) que trabaje en este repo. Léela completa antes de cambiar código.
Última actualización: 2026-10-05. Para levantar el proyecto, ver `README.md`.

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
- `API/api.ts`: axios con el token. Ante un 401 (token vencido) borra la sesión y redirige a `/login`.
- Alias de imports en `vite.config.ts` / `tsconfig.app.json` (`@components`, `@shared-theme`, `@API`…).

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
   - El cliente solo agenda para sí mismo y en un horario libre del profesional que ofrece ese servicio (`lockForUpdate` evita la doble reserva). Solo cancela citas en estado 1 o 2 y con más de 24 h de anticipación.
   - Marcar asistencia y crear reportes: solo el profesional de esa cita.
3. Límites de intentos: el login tiene `throttle:login` (10/min por email + IP, definido en `AppServiceProvider`); el registro, `throttle:5,1`.
4. Los tokens de Sanctum vencen a los 7 días (`SANCTUM_EXPIRATION`).
5. Las respuestas 500 no exponen `$e->getMessage()`: se usa `serverError()`, que lo deja en el log.

**Al agregar un endpoint:** pon el `role:` en la ruta **y** valida el dueño en el controlador. Luego agrega un caso a `scripts/security-check.mjs`.

**Pruebas de seguridad:** `scripts/security-check.mjs` (56 casos: escalada de privilegios, acceso a datos ajenos, acciones prohibidas y flujos normales). Crea datos, así que solo corre contra un backend local con SQLite; el script se niega si `API_URL` no es localhost. Las instrucciones están en su cabecera. **Nunca lo apuntes a Railway.**

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
- El toggle de modo está en el `SideMenu` (`ColorModeToggle`, que también contempla el modo "system").
- Verificado con capturas de todas las pantallas de los 4 roles, en claro y oscuro.

## Base de datos y migraciones

- `database/migrations/2025_05_31_000000_create_all_tables.php` crea casi todo el esquema.
- `2026_10_05_000000_add_is_available_columns.php` agrega `user_account.is_available`, `service.is_available` y el estado 5 "Cancelada" **solo si faltan** (es idempotente). En producción ya existían; correr `php artisan migrate` allí solo registra la migración.
- Producción (Railway) tiene la tabla `migrations` al día hasta `2026_09_13_..._user_consents`.
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

## Pendientes y recomendaciones conocidas

- **Archivos públicos:** los comprobantes de pago y los reportes clínicos se suben a Cloudinary con un preset *unsigned*, y sus URLs son públicas (cualquiera con el link los ve; cualquiera puede subir al preset). Lo ideal: subida firmada desde el backend y entrega autenticada o URLs firmadas.
- **Docker:** no hay `.dockerignore`, así que `COPY . .` mete el `.env` (con la contraseña de la BD) en la imagen. Crear `.dockerignore` (`.env*`, `vendor`, `node_modules`, `storage/logs`) y pasar las credenciales como variables de la plataforma, verificando antes que el despliegue no dependa del `.env` copiado.
- **Historial de git:** los commits `73bacc1` y `27533a4` contienen un `.env` viejo con un `APP_KEY` y una contraseña de Postgres de otro host de Railway (no los actuales). Si esa BD vieja sigue viva, rota la contraseña o bórrala.
- En producción: `APP_DEBUG=false`. CORS usa el valor por defecto de Laravel (abierto); se puede restringir al dominio de Vercel publicando `config/cors.php`.
- El token vive en `localStorage` (expuesto si hubiera XSS). React escapa el contenido, pero conviene agregar una CSP.
- Endpoints rotos y sin uso en la UI, hoy restringidos a staff/admin: `POST /worker-schedule` (usa `person_id`, que no existe), `POST /payment` y `POST /appointment-report` (campos que no coinciden con el modelo). Arreglarlos o eliminarlos.
- La regla de 24 h para cancelar usa la hora del servidor; conviene fijar `APP_TIMEZONE=America/Guayaquil`.
- El bundle del frontend pesa ~2.5 MB: se puede partir con `React.lazy` por rol.
- Quedan usos de `any` en `utils/utils.ts` y en las tablas.
- **Próximo proyecto: Sanity CMS** para que la fundación edite las imágenes de la landing:
  - Imágenes actuales fijas en el código: `HeroSection` y `AspyBandSection` (`Aspy-banda.jpeg`), `MissionSection` (`Aspy1-3.jpeg`), login (`fondoAspy.webp`).
  - Plan:
    1. Crear un documento único `landingPage` en Sanity.
    2. Agregar `src/API/sanity.ts` con un hook `useLandingContent()` que use las imágenes locales como respaldo si Sanity falla.
    3. Pasar las imágenes por props a esas secciones.
    4. Dataset público de solo lectura, sin token en el frontend, CORS solo para el dominio y `localhost:5173`, y cuentas de Sanity con rol Editor.

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
  - Cambios visuales: revisarlos en modo claro **y** oscuro.
